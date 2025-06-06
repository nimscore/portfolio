export type Item = { id: number; label: string }

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL

export async function fetchItems({
	offset,
	limit,
	search,
}: {
	offset: number
	limit: number
	search: string
}): Promise<Item[]> {
	const query = new URLSearchParams({
		offset: offset.toString(),
		limit: limit.toString(),
		search,
	})
	const res = await fetch(`${SERVER}/api/items?${query.toString()}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to fetch items')
	return res.json()
}

export async function fetchState(): Promise<{
	order: number[]
	selected: number[]
}> {
	const res = await fetch(`${SERVER}/api/state`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to fetch state')
	return res.json()
}

export async function saveState(
	order: number[] | undefined,
	selected: number[]
) {
	const body: { selected: number[]; order?: number[] } = { selected }
	if (Array.isArray(order)) {
		body.order = order
	}
	const res = await fetch(`${SERVER}/api/state`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed to save state')
}

export async function reorderFiltered(filteredOrder: number[]) {
	const res = await fetch(`${SERVER}/api/state/reorderFiltered`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ filteredOrder }),
	})
	if (!res.ok) throw new Error('Failed to reorder filtered')
}
