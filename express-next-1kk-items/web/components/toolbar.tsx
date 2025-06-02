'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ModeToggle } from './ui/mode-toggle'

export function Toolbar({ onSearch }: { onSearch: (term: string) => void }) {
	const [value, setValue] = useState('')

	return (
		<div className='flex p-4 gap-2 bg-muted rounded-t-lg'>
			<Input
				value={value}
				onChange={e => {
					setValue(e.target.value)
					onSearch(e.target.value)
				}}
				placeholder='Поиск...'
				className='flex-1'
			/>
			<ModeToggle />
		</div>
	)
}
