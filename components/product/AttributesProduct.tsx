'use client'

import { Button } from '@/components/ui/button'
import { FullProductData, VariantDetailed } from '@/types/select'

interface Props {
	product: FullProductData
	selectedVariant: VariantDetailed
	onVariantChange: (variant: VariantDetailed) => void
}

export const AttributesProduct = ({ product, selectedVariant, onVariantChange }: Props) => {
	const { variants, category } = product

	const selectedMap = new Map(
		selectedVariant.attributes.map((a) => [
			a.attributeValue.categoryAttribute.attributeId,
			a.attributeValue.id,
		]),
	)

	const findVariant = (targetAttrId: number, targetValueId: number) =>
		variants.find((variant) =>
			variant.attributes.every((a) => {
				const attrId = a.attributeValue.categoryAttribute.attributeId
				const expectedValue = attrId === targetAttrId ? targetValueId : selectedMap.get(attrId)
				return expectedValue === a.attributeValue.id
			}),
		)

	return (
		<div className='space-y-4'>
			{category.attributes.map((attrGroup) => {
				const { attribute } = attrGroup
				const availableValues = attrGroup.values.filter((val) =>
					variants.some((v) => v.attributes.some((a) => a.attributeValue.id === val.id)),
				)

				if (!availableValues.length) return null

				return (
					<div
						key={attribute.id}
						className='space-y-2'
					>
						<p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
							{attribute.name}
						</p>

						<div className='flex flex-wrap gap-2'>
							{availableValues.map((val) => {
								const isSelected = selectedMap.get(attribute.id) === val.id
								const nextVariant = isSelected ? null : findVariant(attribute.id, val.id)

								return (
									<Button
										key={val.id}
										size='sm'
										variant={isSelected ? 'default' : 'secondary'}
										disabled={!isSelected && !nextVariant}
										onClick={() => nextVariant && onVariantChange(nextVariant)}
									>
										{val.value}
									</Button>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default AttributesProduct
