import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

const SESSION_COOKIE = 'sessionId'

export default function sessionMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let sessionId = req.cookies[SESSION_COOKIE]

	if (!sessionId) {
		sessionId = uuid()
		res.cookie(SESSION_COOKIE, sessionId, { httpOnly: true })
	}

	;(req as any).sessionId = sessionId
	next()
}
