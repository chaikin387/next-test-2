import { Container } from '@/components/container/Container'
import { SectionProduct } from '@/components/product/SectionProduct'
import { getCategoriesWithProducts } from '@/services/category.service'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Страница магазина',
	description: 'Интернет-магазин с широким ассортиментом товаров',
}

export default async function HomePage() {
	const categories = await getCategoriesWithProducts()

	return (
		<Container>
			{categories.map((category) => (
				<SectionProduct
					key={category.id}
					category={category}
				/>
			))}
		</Container>
	)
}
