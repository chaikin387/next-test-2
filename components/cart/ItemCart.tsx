'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CartDetailed } from '@/types/cart-select'
import { formatPrice } from '@/utils/format-price'
import { formatWeight } from '@/utils/format-weight'
import { Loader2, ShoppingBasket, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { QuickDialog } from '../product/QuickDialog'
import { clearCart, removeItem, toggleSelectCart, toggleSelectItem } from './actions/cart-actions'
import { getCartTotals } from './calculate/calculate-cart'
import { CartItemQuantity } from './CartItemQuantity'
import { InfoAttributeCart } from './InfoAttributeCart'

interface Props {
	cart: CartDetailed | null
}

export const ItemCart = ({ cart }: Props) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const items = cart?.items ?? []
	const { totalAmount, totalWeight, totalCount, isAllSelected } = getCartTotals(items)

	const isCheckoutDisabled = totalCount === 0 || isPending

	if (!cart || items.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='bg-muted mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
					<ShoppingBasket className='text-muted-foreground h-12 w-12' />
				</div>
				<h1 className='text-foreground mb-2 text-3xl font-black'>Корзина пуста</h1>
				<p className='text-muted-foreground mb-8 max-w-75'>
					Ваша корзина ждет своего первого товара. Начните покупки прямо сейчас!
				</p>
				<Button onClick={() => router.push('/')}>Перейти в магазин</Button>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-8 pb-12'>
			<h1 className='text-primary text-4xl font-black tracking-tight'>Корзина</h1>

			<div className='grid gap-8 lg:grid-cols-3'>
				<section
					className={cn(
						'space-y-4 transition-all duration-300 lg:col-span-2',
						isPending && 'opacity-50 grayscale-50',
					)}
				>
					<header className='border-border bg-card flex items-center justify-between rounded-2xl border p-5 shadow-sm'>
						<div className='flex items-center gap-3'>
							<Checkbox
								id='all'
								checked={isAllSelected}
								onCheckedChange={(v) => startTransition(() => toggleSelectCart(cart.id, !!v))}
								className='size-5'
							/>
							<Label
								htmlFor='all'
								className='text-foreground cursor-pointer text-base font-bold'
							>
								Выбрать все
							</Label>
						</div>

						<Button
							variant='ghost'
							size='sm'
							disabled={isPending}
							onClick={() => startTransition(clearCart)}
						>
							Очистить корзину
							<Trash2 className='ml-2 size-4' />
						</Button>
					</header>

					<div className='space-y-4'>
						{items.map((item) => (
							<article
								key={item.id}
								className={cn(
									'border-border bg-card flex flex-col items-center gap-5 rounded-2xl border p-5 shadow-sm transition-all sm:flex-row',
									!item.isSelected && 'bg-muted/50 opacity-80',
								)}
							>
								<Checkbox
									checked={item.isSelected}
									onCheckedChange={(v) => startTransition(() => toggleSelectItem(item.id, !!v))}
									className='size-5'
								/>

								<QuickDialog
									product={item.variant.product}
									cartItems={items}
									initialVariantId={item.variant.id}
									isCartModal
								>
									<div className='bg-muted/30 relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl p-2 transition-opacity hover:opacity-80'>
										<Image
											src={item.variant.images[0]?.url ?? '/placeholder.png'}
											alt={item.variant.name}
											fill
											sizes='96px'
											className='object-contain'
										/>
									</div>
								</QuickDialog>

								<div className='flex w-full flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center'>
									<div className='flex flex-1 flex-col space-y-1'>
										<QuickDialog
											product={item.variant.product}
											cartItems={items}
											initialVariantId={item.variant.id}
											isCartModal
										>
											<h3 className='text-foreground hover:text-chart-1 cursor-pointer text-lg leading-tight font-black transition-colors'>
												{item.variant.product.name}
											</h3>
										</QuickDialog>

										<InfoAttributeCart variant={item.variant} />
									</div>

									<div className='flex items-center gap-6'>
										<CartItemQuantity
											id={item.id}
											quantity={item.quantity}
											disabled={isPending}
											startTransition={startTransition}
										/>

										<div className='min-w-25 text-right'>
											<p className='text-foreground text-xl font-black'>
												{formatPrice(item.variant.price * item.quantity)}
											</p>
										</div>

										<Button
											size='icon'
											variant='ghost'
											disabled={isPending}
											onClick={() => startTransition(() => removeItem(item.id))}
										>
											<Trash2 className='size-5' />
										</Button>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				<aside className='h-fit lg:sticky lg:top-12'>
					<div className='border-border bg-card rounded-2xl border p-8 shadow-xl'>
						<h2 className='text-foreground mb-6 text-2xl font-black tracking-tight'>Итог заказа</h2>

						<div className='border-border space-y-4 border-b pb-6'>
							<div className='flex justify-between'>
								<span className='text-muted-foreground font-medium'>Товары ({totalCount})</span>
								<span className='text-foreground font-bold'>{formatPrice(totalAmount)}</span>
							</div>

							<div className='flex justify-between'>
								<span className='text-muted-foreground font-medium'>Вес</span>
								<span className='text-foreground font-bold'>{formatWeight(totalWeight)}</span>
							</div>

							<div className='flex justify-between'>
								<span className='text-muted-foreground font-medium'>Доставка</span>
								<span className='text-chart-2 font-bold'>Бесплатно</span>
							</div>
						</div>

						<div className='my-8 flex items-end justify-between'>
							<span className='text-foreground font-bold'>К оплате</span>
							<span className='text-chart-1 text-3xl font-black'>{formatPrice(totalAmount)}</span>
						</div>

						<Button
							size='lg'
							disabled={isCheckoutDisabled}
							className='w-full'
						>
							{isPending ? <Loader2 className='size-6 animate-spin' /> : 'Оформить заказ'}
						</Button>
					</div>
				</aside>
			</div>
		</div>
	)
}

export default ItemCart
