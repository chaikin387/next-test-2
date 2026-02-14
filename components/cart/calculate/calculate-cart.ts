import { CartItemDetailed } from '@/types/cart-select'

export const getCartTotals = (items: CartItemDetailed[] = []) =>
	items.reduce(
		(acc, { isSelected, quantity, variant }) => {
			acc.totalItems++

			if (!isSelected) {
				acc.isAllSelected = false
				return acc
			}

			acc.totalCount += quantity
			acc.totalWeight += (variant.weight ?? 0) * quantity
			acc.totalAmount += variant.price * quantity

			return acc
		},
		{
			totalCount: 0,
			totalWeight: 0,
			totalAmount: 0,
			totalItems: 0,
			isAllSelected: items.length > 0,
		},
	)
