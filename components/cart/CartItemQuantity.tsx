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
	const handleUpdate = (delta: number) => {
		startTransition(() => updateQuantity(id, quantity + delta))
	}

	return (
		<div
			className={cn(
				'bg-secondary flex w-28 items-center gap-2 rounded-md p-1',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<Button
				variant='ghost'
				size='icon'
				className='hover:bg-primary hover:text-accent size-8'
				onClick={() => handleUpdate(-1)}
			>
				<Minus size={14} />
			</Button>

			<span className='w-6 text-center text-sm font-bold'>{quantity}</span>

			<Button
				variant='ghost'
				size='icon'
				className='hover:bg-primary hover:text-accent size-8'
				onClick={() => handleUpdate(1)}
			>
				<Plus size={14} />
			</Button>
		</div>
	)
}

export default CartItemQuantity
