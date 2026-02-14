export const formatCartCount = (count: number) => {
	const cases = ['товар', 'товара', 'товаров'] as const
	const rules = [2, 0, 1, 1, 1, 2]

	const index = count % 100 > 4 && count % 100 < 20 ? 2 : rules[Math.min(count % 10, 5)]

	return `${count} ${cases[index]}`
}
