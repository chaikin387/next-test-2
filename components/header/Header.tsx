import { LucidePizza } from 'lucide-react'
import Link from 'next/link'
import { Container } from '../container/Container'
import { CartCounterButton } from './CartCounterButton'
import { UserButton } from './UserButton'

export const Header = () => {
	return (
		<Container>
			<header className='mb-12 flex items-center justify-between border-b p-4'>
				<Link href='/'>
					<LucidePizza className='size-8' />
				</Link>

				<nav className='flex items-baseline gap-6'>
					<UserButton />
					<CartCounterButton />
				</nav>
			</header>
		</Container>
	)
}
