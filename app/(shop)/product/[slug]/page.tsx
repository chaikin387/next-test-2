// app/product/[slug]/page.tsx

import { Container } from '@/components/container/Container'
import { FullViewProduct } from '@/components/product/FullViewProduct'
import { getCart } from '@/services/cart.service' // Импортируем сервис
import { getProductBySlug } from '@/services/product.service'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Карточка товара',
	description: 'Подробная информация о товаре',
}

interface Props {
	params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
	const { slug } = await params

	const [product, cart] = await Promise.all([getProductBySlug(slug), getCart()])

	if (!product) notFound()

	const cartItems = cart?.items ?? []

	return (
		<Container>
			<FullViewProduct
				product={product}
				cartItems={cartItems}
			/>
		</Container>
	)
}
