import { AttributeType } from '@/lib/generated/prisma/client'

export interface SeedImage {
	url: string
	alt?: string
	position?: number
}

export interface SeedVariant {
	sku: string
	name: string
	slug: string
	price: number
	oldPrice?: number
	weight: number
	stock?: number
	isDefault?: boolean
	position?: number
	attributeSlugs?: string[]
	images?: SeedImage[]
}

export interface SeedProduct {
	name: string
	slug: string
	description?: string
	isActive?: boolean
	variants: SeedVariant[]
}

export interface SeedAttributeValue {
	value: string
	slug: string
	position: number
}

export interface SeedCategoryAttribute {
	attribute: {
		name: string
		slug: string
		type: AttributeType
	}
	isRequired: boolean
	position: number
	values: SeedAttributeValue[]
}

export interface SeedCategoryData {
	category: {
		name: string
		slug: string
		position: number
		isActive: boolean
	}
	categoryAttributes: SeedCategoryAttribute[]
	products: SeedProduct[]
}
