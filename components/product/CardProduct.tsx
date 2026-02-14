'use client'

import { CartItemDetailed } from '@/types/cart-select'
import { ProductCardData } from '@/types/select'
import { formatPrice } from '@/utils/format-price'
import { formatWeight } from '@/utils/format-weight'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { addToCart } from '../cart/actions/cart-actions'
import { Button } from '../ui/button'
import QuickDialog from './QuickDialog'

interface Props {
	product: ProductCardData
	cartItems: CartItemDetailed[]
}

export const CardProduct = ({ product, cartItems }: Props) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const mainVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0]
	const hasVariants = product.variants.length > 1
	const isAdded = cartItems.some((item) => item.variant.id === mainVariant.id)

	const minPrice = Math.min(...product.variants.map((v) => v.price))
	const mainImage = mainVariant.images[0]?.url ?? '/placeholder.png'

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		startTransition(async () => {
			if (hasVariants) {
				router.push(`/product/${product.slug}`)
				return
			}

			if (isAdded) {
				router.push('/cart')
				return
			}

			await addToCart(mainVariant.id)
			toast.success('Товар добавлен в корзину')
		})
	}

	const buttonText = hasVariants ? 'Выбрать' : isAdded ? 'В корзине' : 'В корзину'
	const buttonVariant = !hasVariants && isAdded ? 'outline' : 'default'

	return (
		<div
			className={`group bg-background relative flex flex-col rounded-3xl border p-3 transition-all hover:shadow-xl ${
				isPending ? 'pointer-events-none opacity-70' : ''
			}`}
		>
			<Link
				href={`/product/${product.slug}`}
				className='absolute inset-0 z-10 rounded-2xl'
			/>

			<div className='bg-accent relative mb-4 aspect-square w-full overflow-hidden rounded-2xl'>
				<Image
					src={mainImage}
					alt={product.name}
					fill
					sizes='(max-width: 768px) 100vw, 50vw'
					loading='eager'
					draggable={false}
					className='object-contain p-3 transition-transform duration-500 select-none group-hover:scale-105'
				/>

				<div
					className='absolute inset-0 flex items-end justify-center p-2'
					onClick={(e) => e.stopPropagation()}
				>
					<QuickDialog
						product={product}
						cartItems={cartItems}
					>
						<Button
							variant='outline'
							size='lg'
							className='relative z-30 w-full opacity-0 transition-opacity select-none group-hover:opacity-100'
						>
							Быстрый просмотр
						</Button>
					</QuickDialog>
				</div>
			</div>

			<div className='relative flex flex-1 flex-col'>
				<h3 className='group-hover:text-chart-1 line-clamp-1 text-xl font-bold'>{product.name}</h3>

				<p className='text-muted-foreground mt-2 line-clamp-2 text-sm'>{product.description}</p>

				<footer className='mt-auto flex items-end justify-between gap-3 pt-5'>
					<div className='flex flex-col'>
						<span className='flex items-baseline gap-2 text-2xl font-bold text-gray-900'>
							{hasVariants && (
								<span className='text-muted-foreground text-base font-normal'>от</span>
							)}
							{formatPrice(minPrice)}
						</span>

						{mainVariant.weight > 0 && (
							<span className='text-muted-foreground text-sm font-semibold'>
								{formatWeight(mainVariant.weight)}
							</span>
						)}
					</div>

					<div
						className='relative z-30'
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							size='sm'
							variant={buttonVariant}
							disabled={isPending}
							onClick={handleAddToCart}
							className='w-28'
						>
							{isPending ? <Loader2 className='size-4 animate-spin' /> : buttonText}
						</Button>
					</div>
				</footer>
			</div>
		</div>
	)
}

export default CardProduct
