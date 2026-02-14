import { getCart } from '@/services/cart.service'
import { Metadata } from 'next'

import { ItemCart } from '@/components/cart/ItemCart'
import { Container } from '@/components/container/Container'

export const metadata: Metadata = {
	title: 'Корзина',
	description: 'Управление вашими покупками',
}

export default async function CartPage() {
	const cart = await getCart()

	return (
		<Container>
			<ItemCart cart={cart} />
		</Container>
	)
}
