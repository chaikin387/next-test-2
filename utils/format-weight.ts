// lib/utils/format-weight.ts

export function formatWeight(grams: number): string {
	if (grams < 1000) {
		return `${grams} г`
	}

	const kg = grams / 1000

	return `${kg.toFixed(kg % 1 === 0 ? 0 : 1)} кг`
}
