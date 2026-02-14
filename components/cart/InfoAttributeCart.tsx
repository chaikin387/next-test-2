'use client'

import { CartVariantDetailed } from '@/types/cart-select'
import { formatWeight } from '@/utils/format-weight'

interface Props {
	variant: CartVariantDetailed
}

export const InfoAttributeCart = ({ variant }: Props) => {
	const { attributes, weight } = variant

	if (!attributes?.length && !weight) return null

	return (
		<div className='flex flex-wrap gap-x-3 gap-y-1 text-xs'>
			{attributes.map(({ attributeValue }) => {
				const attribute = attributeValue.categoryAttribute.attribute

				return (
					<div
						key={attributeValue.id}
						className='flex items-center gap-1.5'
					>
						<span className='text-primary'>{attribute.name}:</span>
						<span className='text-muted-foreground font-semibold'>{attributeValue.value}</span>
					</div>
				)
			})}

			{/* Выводим вес, если он указан */}
			{weight > 0 && (
				<div className='flex items-center gap-1.5'>
					<span className='text-primary'>Вес:</span>
					<span className='text-muted-foreground font-semibold'>{formatWeight(weight)}</span>
				</div>
			)}
		</div>
	)
}

export default InfoAttributeCart
