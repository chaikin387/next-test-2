import { LucidePizza } from 'lucide-react'
import Link from 'next/link'
import { Container } from '../container/Container'
import { CartCounterButton } from './CartCounterButton'

export const Header = () => {
	return (
		<Container>
			<header className='mb-12 flex justify-between border-b p-4'>
				<Link href='/'>
					<LucidePizza className='size-8' />
				</Link>
				<CartCounterButton />
			</header>
		</Container>
	)
}

export default Header
