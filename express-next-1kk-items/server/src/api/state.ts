import { Request, Response, Router } from 'express'
import { getSessionState } from '../services/session-store'

const router = Router()

router.get('/', (req: Request, res: Response) => {
	const sessionId = (req as any).sessionId
	const state = getSessionState(sessionId)

	res.json({
		order: state.order,
		selected: Array.from(state.selected),
	})
})

router.post('/', (req: Request, res: Response) => {
	const sessionId = (req as any).sessionId
	const state = getSessionState(sessionId)

	const { order, selected } = req.body

	if (Array.isArray(order)) {
		state.order = order
	}
	if (Array.isArray(selected)) {
		state.selected = new Set<number>(selected)
	}

	res.json({ success: true })
})

router.post('/reorderFiltered', (req: Request, res: Response) => {
	const sessionId = (req as any).sessionId as string
	const state = getSessionState(sessionId)

	const { filteredOrder } = req.body as { filteredOrder: number[] }
	if (!Array.isArray(filteredOrder)) {
		res.status(400).json({ error: 'filteredOrder must be an array of IDs' })
		return
	}

	const fullOrder = state.order
	const filteredSet = new Set<number>(filteredOrder)

	const positions: number[] = []
	for (let i = 0; i < fullOrder.length; i++) {
		if (filteredSet.has(fullOrder[i])) {
			positions.push(i)
		}
	}
	positions.sort((a, b) => a - b)

	if (positions.length !== filteredOrder.length) {
		res.status(400).json({
			error: 'filteredOrder содержит ID, которые отсутствуют в общей order',
		})
		return
	}

	const newFullOrder = [...fullOrder]
	for (let idx = 0; idx < positions.length; idx++) {
		const slot = positions[idx]
		const newId = filteredOrder[idx]
		newFullOrder[slot] = newId
	}

	state.order = newFullOrder

	res.json({ success: true })
})

export default router
