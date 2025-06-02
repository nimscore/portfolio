'use client'

import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
	sortableKeyboardCoordinates,
	useSortable,
} from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import {
	Item,
	fetchItems,
	fetchState,
	reorderFiltered,
	saveState,
} from '@/lib/api'
import { ItemRow } from './item-row'
import { Toolbar } from './toolbar'

const LIMIT = 20

export function ItemList() {
	const [items, setItems] = useState<Item[]>([])
	const [offset, setOffset] = useState(0)
	const [selected, setSelected] = useState<Set<number>>(new Set())
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)

	const { ref: inViewRef, inView } = useInView({ threshold: 0.5 })

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	useEffect(() => {
		loadInitialState()
	}, [])

	useEffect(() => {
		if (inView) {
			loadMore()
		}
	}, [inView])

	async function loadInitialState() {
		try {
			const state = await fetchState()
			setSelected(new Set(state.selected))

			const firstPage = await fetchItems({
				offset: 0,
				limit: LIMIT,
				search: '',
			})
			setItems(firstPage)
			setOffset(firstPage.length)
		} catch (err) {
			console.error(err)
		}
	}

	async function loadMore() {
		if (loading) return
		setLoading(true)

		try {
			const newItems = await fetchItems({
				offset,
				limit: LIMIT,
				search,
			})
			if (newItems.length === 0) {
				setLoading(false)
				return
			}
			setItems(prev => [...prev, ...newItems])
			setOffset(prev => prev + newItems.length)
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		setItems([])
		setOffset(0)
		loadFirstPageForSearch()
	}, [search])

	async function loadFirstPageForSearch() {
		try {
			setLoading(true)
			const firstPage = await fetchItems({
				offset: 0,
				limit: LIMIT,
				search,
			})
			setItems(firstPage)
			setOffset(firstPage.length)
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleToggle = useCallback(
		(id: number, checked: boolean) => {
			const newSet = new Set(selected)
			if (checked) newSet.add(id)
			else newSet.delete(id)

			setSelected(newSet)
			saveState(undefined, Array.from(newSet)).catch(console.error)
		},
		[selected]
	)

	const handleSearch = (term: string) => {
		setSearch(term)
	}

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return

		const oldIndex = items.findIndex(i => i.id === Number(active.id))
		const newIndex = items.findIndex(i => i.id === Number(over.id))
		if (oldIndex < 0 || newIndex < 0) return

		const newItemsArr = arrayMove(items, oldIndex, newIndex)
		setItems(newItemsArr)

		const newFilteredOrder = newItemsArr.map(i => i.id)

		try {
			await reorderFiltered(newFilteredOrder)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className='w-full max-w-2xl mx-auto'>
			<Toolbar onSearch={handleSearch} />

			<div className='border rounded-lg overflow-auto max-h-[600px]'>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map(i => i.id.toString())}
						strategy={rectSortingStrategy}
					>
						{items.map(item => (
							<SortableItemRow
								key={item.id}
								id={item.id}
								label={item.label}
								checked={selected.has(item.id)}
								onChange={handleToggle}
							/>
						))}
					</SortableContext>
				</DndContext>

				<div ref={inViewRef} className='py-4 text-center text-muted-foreground'>
					{loading && 'Загрузка...'}
					{!loading &&
						items.length > 0 &&
						items.length % LIMIT !== 0 &&
						'Больше нет данных.'}
				</div>
			</div>
		</div>
	)
}

interface SortableItemRowProps {
	id: number
	label: string
	checked: boolean
	onChange: (id: number, checked: boolean) => void
}

function SortableItemRow({
	id,
	label,
	checked,
	onChange,
}: SortableItemRowProps) {
	const {
		attributes: handleAttributes,
		listeners: handleListeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: id.toString() })

	return (
		<ItemRow
			id={id}
			label={label}
			checked={checked}
			onChange={onChange}
			refCallback={setNodeRef}
			handleAttributes={handleAttributes}
			handleListeners={handleListeners}
			transform={transform}
			transition={transition as string}
		/>
	)
}
