import { Prisma } from '@/lib/generated/prisma/client'

const attributeSelect = {
	id: true,
	name: true,
	slug: true,
	type: true,
} satisfies Prisma.AttributeSelect

const variantImageSelect = {
	id: true,
	url: true,
	alt: true,
} satisfies Prisma.VariantImageSelect

const variantAttributeValueSelect = {
	select: {
		attributeValue: {
			select: {
				id: true,
				value: true,
				slug: true,
				categoryAttribute: {
					select: {
						attributeId: true,
						attribute: {
							select: {
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		},
	},
} satisfies Prisma.VariantAttributeValueFindManyArgs

export const productCardSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	category: { select: { name: true, slug: true } },
	variants: {
		where: { isActive: true },
		select: {
			id: true,
			price: true,
			weight: true,
			isDefault: true,
			images: {
				where: { isActive: true },
				take: 1,
				select: variantImageSelect,
			},
		},
	},
} satisfies Prisma.ProductSelect

export const variantDetailedSelect = {
	id: true,
	name: true,
	slug: true,
	sku: true,
	price: true,
	oldPrice: true,
	weight: true,
	stock: true,
	isDefault: true,
	images: {
		where: { isActive: true },
		orderBy: { position: 'asc' },
		select: variantImageSelect,
	},
	attributes: variantAttributeValueSelect,
} satisfies Prisma.ProductVariantSelect

export const fullProductSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	imageUrl: true,
	category: {
		select: {
			id: true,
			name: true,
			slug: true,
			attributes: {
				where: { attribute: { isActive: true } },
				orderBy: { position: 'asc' },
				select: {
					isRequired: true,
					attribute: { select: attributeSelect },
					values: {
						where: { isActive: true },
						orderBy: { position: 'asc' },
						select: { id: true, value: true, slug: true },
					},
				},
			},
		},
	},
	variants: {
		where: { isActive: true },
		orderBy: { position: 'asc' },
		select: variantDetailedSelect,
	},
} satisfies Prisma.ProductSelect

export const categoryWithProductsSelect = {
	id: true,
	name: true,
	slug: true,
	products: {
		where: { isActive: true },
		orderBy: { id: 'asc' },
		select: productCardSelect,
	},
} satisfies Prisma.CategorySelect

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>
export type FullProductData = Prisma.ProductGetPayload<{ select: typeof fullProductSelect }>
export type CategoryWithProducts = Prisma.CategoryGetPayload<{
	select: typeof categoryWithProductsSelect
}>
export type VariantDetailed = Prisma.ProductVariantGetPayload<{
	select: typeof variantDetailedSelect
}>
