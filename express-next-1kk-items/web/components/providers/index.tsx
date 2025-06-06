'use client'

import React from 'react'
import { ThemeProvider } from './theme'

export const Providers: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
			{children}
		</ThemeProvider>
	)
}
