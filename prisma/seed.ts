import { PrismaClient } from '@/lib/generated/prisma/client'
import { SeedCategoryData } from '@/types/seed-types'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
	console.log('🚀 Запуск Seed...')

	// 1. Быстрая очистка базы
	const tables = [
		'users',
		'categories',
		'attributes',
		'category_attributes',
		'category_attribute_values',
		'products',
		'product_variants',
		'variant_attribute_values',
		'variant_images',
		'carts',
		'cart_items',
	]
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE;`)

	const dir = path.resolve(process.cwd(), 'prisma/db')
	const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))

	for (const file of files) {
		const {
			category: catData,
			categoryAttributes,
			products,
		}: SeedCategoryData = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))

		console.log(`→ Обработка: ${catData.name}`)

		// 2. Создаем дерево Категория -> Атрибуты -> Значения за ОДИН запрос
		const category = await prisma.category.create({
			data: {
				...catData,
				attributes: {
					create: categoryAttributes.map((ca) => ({
						isRequired: ca.isRequired,
						position: ca.position,
						attribute: {
							connectOrCreate: {
								where: { slug: ca.attribute.slug },
								create: ca.attribute,
							},
						},
						values: {
							create: ca.values.map((v) => ({ ...v })),
						},
					})),
				},
			},
			include: { attributes: { include: { values: true, attribute: true } } },
		})

		// Создаем карту: "attrSlug:valSlug" -> valueId
		const valMap = Object.fromEntries(
			category.attributes.flatMap((ca) =>
				ca.values.map((v) => [`${ca.attribute.slug}:${v.slug}`, v.id]),
			),
		)

		// 3. Создаем продукты параллельно
		await Promise.all(
			products.map(({ variants, ...p }) =>
				prisma.product.create({
					data: {
						...p,
						categoryId: category.id,
						imageUrl: variants[0]?.images?.[0]?.url || null,
						variants: {
							create: variants.map(({ attributeSlugs, images, ...v }) => ({
								...v,
								images: { create: images },
								attributes: {
									create: attributeSlugs?.map((slug) => {
										const valueId = Object.entries(valMap).find(([key]) =>
											key.endsWith(`:${slug}`),
										)?.[1]
										if (!valueId) throw new Error(`Slug значения "${slug}" не найден в категории`)
										return { attributeValueId: valueId }
									}),
								},
							})),
						},
					},
				}),
			),
		)
	}
	console.log('✅ Seed успешно завершен!')
}

main()
	.catch((e) => (console.error('❌ Ошибка:', e), process.exit(1)))
	.finally(() => prisma.$disconnect())
