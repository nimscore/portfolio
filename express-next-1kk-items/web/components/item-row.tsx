'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { CSS, type Transform } from '@dnd-kit/utilities'
import { LucideGripHorizontal } from 'lucide-react'
import React from 'react'

interface ItemRowProps {
	id: number
	label: string
	checked: boolean
	onChange: (id: number, checked: boolean) => void

	handleAttributes?: React.HTMLAttributes<HTMLElement>
	handleListeners?: React.HTMLAttributes<HTMLElement>
	refCallback?: (node: HTMLElement | null) => void
	transform?: Transform | null
	transition?: string
}

export function ItemRow({
	id,
	label,
	checked,
	onChange,
	handleAttributes,
	handleListeners,
	refCallback,
	transform,
	transition,
}: ItemRowProps) {
	const style: React.CSSProperties = {
		transform: transform ? CSS.Transform.toString(transform) : undefined,
		transition,
	}

	return (
		<div
			ref={refCallback}
			style={style}
			className='flex items-center justify-between border-b px-4 py-2 bg-background hover:bg-muted rounded-sm'
		>
			<div
				{...handleAttributes}
				{...handleListeners}
				className='mr-3 flex cursor-grab items-center justify-center p-1 text-muted-foreground hover:bg-muted/50 rounded'
			>
				<LucideGripHorizontal size={16} />
			</div>

			<span className='flex-1'>{label}</span>

			<Checkbox
				checked={checked}
				onCheckedChange={v => onChange(id, Boolean(v))}
			/>
		</div>
	)
}
