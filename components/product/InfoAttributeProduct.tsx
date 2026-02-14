'use client'

import { cn } from '@/lib/utils'
import { VariantDetailed } from '@/types/select'
import { formatWeight } from '@/utils/format-weight'
import {
	Beef,
	CircleEllipsis,
	Coffee,
	LucideIcon,
	Pizza,
	Ruler,
	UtensilsCrossed,
	Weight,
} from 'lucide-react'

interface Props {
	variant: VariantDetailed
	className?: string
}

const ATTRIBUTE_ICON_MAP: Record<string, LucideIcon> = {
	'tip-testa': Pizza,
	razmer: Ruler,
	obem: Coffee,
	porciya: Beef,
	kolichestvo: UtensilsCrossed,
}

export const InfoAttributeProduct = ({ variant, className }: Props) => {
	const { attributes, weight } = variant

	if (!attributes?.length && !weight) return null

	return (
		<div className={cn('flex flex-wrap gap-x-3 gap-y-2', className)}>
			{attributes.map(({ attributeValue }) => {
				const attribute = attributeValue.categoryAttribute.attribute
				const Icon = ATTRIBUTE_ICON_MAP[attribute.slug] || CircleEllipsis

				return (
					<div
						key={attributeValue.id}
						className='flex items-center gap-2'
					>
						<Icon className='text-chart-1 size-4' />
						<span className='text-primary text-sm font-bold'>{attribute.name}:</span>
						<span className='text-muted-foreground text-sm font-semibold'>
							{attributeValue.value}
						</span>
					</div>
				)
			})}

			{weight > 0 && (
				<div className='flex items-center gap-2'>
					<Weight className='text-chart-1 size-4' />
					<span className='text-primary text-sm font-bold'>Вес:</span>
					<span className='text-muted-foreground text-sm font-semibold'>
						{formatWeight(weight)}
					</span>
				</div>
			)}
		</div>
	)
}

export default InfoAttributeProduct
