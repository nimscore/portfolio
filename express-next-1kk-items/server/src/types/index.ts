export interface Item {
	id: number
	label: string
}

export interface SessionState {
	order: number[]
	selected: Set<number>
}
