import prisma from '@/lib/prisma'
import { CartDetailed, cartDetailedSelect } from '@/types/cart-select'
import { cookies } from 'next/headers'

export const CART_COOKIE_NAME = 'cartToken'

export const getCart = async (): Promise<CartDetailed | null> => {
	const token = (await cookies()).get(CART_COOKIE_NAME)?.value ?? null
	if (!token) return null

	return prisma.cart.findFirst({
		where: { guestId: token },
		select: cartDetailedSelect,
	})
}
