'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import { updateQuantity } from './actions/cart-actions'

interface Props {
	id: number
	quantity: number
	disabled?: boolean
	startTransition: (callback: () => Promise<void>) => void
}

export const CartItemQuantity = ({ id, quantity, disabled, startTransition }: Props) => {
	const handleDecrease = () => {
		startTransition(() => updateQuantity(id, quantity - 1))
	}

	const handleIncrease = () => {
		startTransition(() => updateQuantity(id, quantity + 1))
	}

	return (
		<div
			className={cn(
				'border-input bg-background inline-flex items-center rounded-md border',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<Button
				variant='ghost'
				size='icon'
				className='border-input hover:bg-primary hover:text-primary-foreground h-8 w-8 rounded-r-none border-r'
				onClick={handleDecrease}
			>
				<Minus className='h-3 w-3' />
			</Button>

			<span className='flex h-8 w-10 items-center justify-center text-sm font-medium tabular-nums'>
				{quantity}
			</span>

			<Button
				variant='ghost'
				size='icon'
				className='border-input hover:bg-primary hover:text-primary-foreground h-8 w-8 rounded-l-none border-l'
				onClick={handleIncrease}
			>
				<Plus className='h-3 w-3' />
			</Button>
		</div>
	)
}

export default CartItemQuantity
