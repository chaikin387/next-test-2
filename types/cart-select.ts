import { Prisma } from '@/lib/generated/prisma/client'
import { variantDetailedSelect } from './select'

export const cartVariantSelect = {
	...variantDetailedSelect,
	product: {
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
			category: {
				select: {
					name: true,
					slug: true,
				},
			},
			variants: {
				select: variantDetailedSelect,
			},
		},
	},
} satisfies Prisma.ProductVariantSelect

export const cartItemSelect = {
	id: true,
	quantity: true,
	isSelected: true,
	variant: {
		select: cartVariantSelect,
	},
} satisfies Prisma.CartItemSelect

export const cartDetailedSelect = {
	id: true,
	userId: true,
	guestId: true,
	createdAt: true,
	updatedAt: true,
	items: {
		orderBy: [{ createdAt: 'desc' }],
		select: cartItemSelect,
	},
} satisfies Prisma.CartSelect

export type CartDetailed = Prisma.CartGetPayload<{
	select: typeof cartDetailedSelect
}>

export type CartItemDetailed = Prisma.CartItemGetPayload<{
	select: typeof cartItemSelect
}>

export type CartVariantDetailed = Prisma.ProductVariantGetPayload<{
	select: typeof cartVariantSelect
}>
