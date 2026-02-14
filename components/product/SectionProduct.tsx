import { getCart } from '@/services/cart.service' // Импортируем сервис
import { CategoryWithProducts } from '@/types/select'
import CardProduct from './CardProduct'

interface Props {
	category: CategoryWithProducts
}

export const SectionProduct = async ({ category }: Props) => {
	if (category.products.length === 0) return null

	const cart = await getCart()
	const cartItems = cart?.items ?? []

	return (
		<section
			id={category.slug}
			className='pb-12'
		>
			<h2 className='mb-8 text-3xl font-bold tracking-tight text-gray-900'>{category.name}</h2>

			<div className='grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{category.products.map((product) => (
					<CardProduct
						key={product.id}
						product={product}
						cartItems={cartItems}
					/>
				))}
			</div>
		</section>
	)
}

export default SectionProduct
