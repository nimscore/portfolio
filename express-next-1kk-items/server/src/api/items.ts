import express from 'express'
import { getSessionState } from '../services/session-store'
import { generateItem } from '../utils/generate-item'

const router = express.Router()

router.get('/', (req, res) => {
	const sessionId = (req as any).sessionId
	const state = getSessionState(sessionId)
	const { offset = 0, limit = 20, search = '' } = req.query

	const searchLower = (search as string).toLowerCase()
	const filtered = state.order.filter(id =>
		searchLower.length > 0
			? `item ${id}`.toLowerCase().includes(searchLower)
			: true
	)

	const paginated = filtered.slice(
		Number(offset),
		Number(offset) + Number(limit)
	)

	const items = paginated.map(generateItem)

	res.json(items)
})

export default router
