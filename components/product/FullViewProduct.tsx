'use client'

import { CartItemDetailed } from '@/types/cart-select'
import { FullProductData, VariantDetailed } from '@/types/select'
import { formatPrice } from '@/utils/format-price'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { addToCart } from '../cart/actions/cart-actions'
import { CartItemQuantity } from '../cart/CartItemQuantity'
import { Button } from '../ui/button'
import { AttributesProduct } from './AttributesProduct'
import { InfoAttributeProduct } from './InfoAttributeProduct'

interface Props {
	product: FullProductData
	cartItems: CartItemDetailed[]
	initialVariantId?: number
	isCartModal?: boolean
}

export function FullViewProduct({ product, cartItems, initialVariantId, isCartModal }: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const [selectedVariant, setSelectedVariant] = useState<VariantDetailed>(() => {
		if (initialVariantId) {
			const found = product.variants.find((v) => v.id === initialVariantId)
			if (found) return found
		}
		return product.variants.find((v) => v.isDefault) ?? product.variants[0]
	})

	const cartItem = cartItems.find((item) => item.variant.id === selectedVariant.id)
	const isAdded = !!cartItem
	const totalItemPrice = selectedVariant.price * (cartItem?.quantity ?? 0)

	const handleAction = () => {
		startTransition(async () => {
			if (!isAdded) {
				await addToCart(selectedVariant.id)
				toast.success('Товар добавлен в корзину')
				return
			}
			router.push('/cart')
		})
	}

	const buttonText = isAdded ? 'В корзине' : 'В корзину'
	const buttonVariant = isAdded ? 'outline' : 'default'
	const shouldShowButton = !isAdded || !isCartModal

	return (
		<div className='flex flex-col items-stretch gap-12 md:flex-row'>
			<div className='bg-muted-foreground/10 pointer-events-none relative aspect-square w-full overflow-hidden rounded-2xl md:w-2/5'>
				<Image
					src={selectedVariant.images[0]?.url ?? '/placeholder.png'}
					alt={product.name}
					loading='eager'
					draggable={false}
					fill
					sizes='(max-width: 768px) 100vw, 50vw'
					className='object-contain p-12'
				/>
			</div>

			{/* Информация о продукте - добавлено flex flex-col, чтобы mt-auto внутри сработал */}
			<div className='flex flex-1 flex-col'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-bold md:text-4xl'>{product.name}</h1>
					<p className='text-muted-foreground'>{product.description}</p>
				</div>

				<div className='mt-6'>
					<InfoAttributeProduct variant={selectedVariant} />
				</div>

				<div className='mt-6'>
					<AttributesProduct
						product={product}
						selectedVariant={selectedVariant}
						onVariantChange={setSelectedVariant}
					/>
				</div>

				{/* Блок с ценой - теперь mt-auto прижмет его к низу, так как родитель имеет высоту изображения */}
				<div className='mt-auto flex items-center justify-between rounded-xl border p-4'>
					<div>
						<p className='text-xs text-gray-400 uppercase'>Цена</p>
						<div className='flex items-baseline gap-2'>
							<span className='text-2xl font-bold'>{formatPrice(selectedVariant.price)}</span>
							{isAdded && cartItem.quantity > 1 && (
								<span className='animate-in fade-in slide-in-from-left-2 text-chart-1 text-lg font-bold'>
									/ {formatPrice(totalItemPrice)}
								</span>
							)}
						</div>
					</div>

					<div className='flex items-center gap-2'>
						{isAdded && cartItem && (
							<CartItemQuantity
								id={cartItem.id}
								quantity={cartItem.quantity}
								startTransition={startTransition}
								disabled={isPending}
							/>
						)}

						{shouldShowButton && (
							<Button
								variant={buttonVariant}
								disabled={isPending}
								onClick={handleAction}
								className='w-28'
							>
								{isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : buttonText}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default FullViewProduct
