'use server'

import prisma from '@/lib/prisma'
import { CART_COOKIE_NAME } from '@/services/cart.service'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const getAuth = async () => {
	const cookieStore = await cookies()
	const token = cookieStore.get(CART_COOKIE_NAME)?.value
	return { token, cookieStore }
}

const getOrCreateCartId = async () => {
	const cookieStore = await cookies()
	let guestId = cookieStore.get(CART_COOKIE_NAME)?.value

	if (!guestId) {
		guestId = crypto.randomUUID()
		cookieStore.set(CART_COOKIE_NAME, guestId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax',
		})
	}

	const cart = await prisma.cart.upsert({
		where: { guestId },
		update: {},
		create: { guestId },
		select: { id: true },
	})
	return cart.id
}

export const addToCart = async (variantId: number) => {
	const cartId = await getOrCreateCartId()
	await prisma.cartItem.upsert({
		where: { cartId_variantId: { cartId, variantId } },
		update: { quantity: { increment: 1 } },
		create: { cartId, variantId, quantity: 1, isSelected: true },
	})
	revalidatePath('/', 'layout')
}

export const updateQuantity = async (itemId: number, quantity: number) => {
	const { token } = await getAuth()
	if (!token) return
	if (quantity < 1) return removeItem(itemId)

	await prisma.cartItem.update({
		where: { id: itemId, cart: { guestId: token } },
		data: { quantity },
	})
	revalidatePath('/', 'layout')
}

export const removeItem = async (itemId: number) => {
	const { token, cookieStore } = await getAuth()
	if (!token) return

	const item = await prisma.cartItem.delete({
		where: { id: itemId, cart: { guestId: token } },
		select: { cartId: true },
	})

	const count = await prisma.cartItem.count({ where: { cartId: item.cartId } })

	if (count === 0) {
		await prisma.cart.delete({ where: { id: item.cartId } })
		cookieStore.delete(CART_COOKIE_NAME)
	}
	revalidatePath('/', 'layout')
}

export const clearCart = async () => {
	const { token, cookieStore } = await getAuth()
	if (!token) return

	await prisma.cart.delete({ where: { guestId: token } })
	cookieStore.delete(CART_COOKIE_NAME)
	revalidatePath('/', 'layout')
}

export const toggleSelectItem = async (itemId: number, isSelected: boolean) => {
	const { token } = await getAuth()
	if (!token) return

	await prisma.cartItem.update({
		where: { id: itemId, cart: { guestId: token } },
		data: { isSelected },
	})
	revalidatePath('/', 'layout')
}

export const toggleSelectCart = async (cartId: number, isSelected: boolean) => {
	const { token } = await getAuth()
	if (!token) return

	await prisma.cartItem.updateMany({
		where: { cartId, cart: { guestId: token } },
		data: { isSelected },
	})
	revalidatePath('/', 'layout')
}
