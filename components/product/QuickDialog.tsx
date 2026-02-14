'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getProductBySlug } from '@/services/product.service'
import { CartItemDetailed } from '@/types/cart-select'
import { FullProductData, ProductCardData } from '@/types/select'
import { useState } from 'react'
import { DialogViewProduct } from './DialogViewProduct'

interface Props {
	product: ProductCardData
	cartItems: CartItemDetailed[]
	children: React.ReactNode
	initialVariantId?: number
	isCartModal?: boolean
}

export const QuickDialog = ({
	product,
	cartItems,
	children,
	initialVariantId,
	isCartModal,
}: Props) => {
	const [open, setOpen] = useState(false)
	const [fullProduct, setFullProduct] = useState<FullProductData | null>(null)

	const handleOpen = async (isOpen: boolean) => {
		setOpen(isOpen)
		if (isOpen && !fullProduct) {
			const data = await getProductBySlug(product.slug)
			setFullProduct(data)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpen}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent
				className={cn('bg-background rounded-3xl p-6 lg:min-h-160 lg:max-w-6xl')}
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DialogHeader className='sr-only'>
					<DialogTitle>{product.name}</DialogTitle>
					<DialogDescription>{product.description}</DialogDescription>
				</DialogHeader>

				{fullProduct && (
					<DialogViewProduct
						product={fullProduct}
						cartItems={cartItems}
						initialVariantId={initialVariantId}
						isCartModal={isCartModal}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default QuickDialog
