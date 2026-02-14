import { getCart } from '@/services/cart.service'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { getCartTotals } from '../cart/calculate/calculate-cart'

export const CartCounterButton = async () => {
	const cart = await getCart()
	const { totalCount } = getCartTotals(cart?.items)

	return (
		<Link
			href={'/cart'}
			className='relative'
		>
			<ShoppingCart className='size-8' />
			{totalCount > 0 && (
				<span className='bg-primary text-background absolute -top-3 -right-3 flex size-5 items-center justify-center rounded-full text-xs font-medium'>
					{totalCount}
				</span>
			)}
		</Link>
	)
}

export default CartCounterButton
