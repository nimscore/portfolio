import { SessionState } from '../types'

const sessionMap = new Map<string, SessionState>()
const TOTAL = 1_000_000

export function getSessionState(sessionId: string): SessionState {
	if (!sessionMap.has(sessionId)) {
		sessionMap.set(sessionId, {
			order: Array.from({ length: TOTAL }, (_, i) => i + 1),
			selected: new Set<number>(),
		})
	}
	return sessionMap.get(sessionId)!
}
