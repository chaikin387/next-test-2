'use server'

import prisma from '@/lib/prisma'
import { FullProductData, fullProductSelect } from '@/types/select'

export const getProductBySlug = async (slug: string): Promise<FullProductData | null> => {
	return await prisma.product.findUnique({
		where: {
			slug,
			isActive: true,
		},
		select: fullProductSelect,
	})
}
