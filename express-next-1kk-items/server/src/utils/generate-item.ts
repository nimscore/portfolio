import { Item } from '../types'

export function generateItem(id: number): Item {
	return { id, label: `Item ${id}` }
}
