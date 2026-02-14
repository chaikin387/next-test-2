'use server'

import prisma from '@/lib/prisma'
import { CategoryWithProducts, categoryWithProductsSelect } from '@/types/select'

export async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
	return await prisma.category.findMany({
		where: {
			isActive: true,
			products: {
				some: { isActive: true },
			},
		},
		orderBy: { position: 'asc' },
		select: categoryWithProductsSelect,
	})
}
