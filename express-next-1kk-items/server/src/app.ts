import cookieParser from 'cookie-parser'
import express from 'express'
import itemsRouter from './api/items'
import stateRouter from './api/state'
import sessionMiddleware from './middleware/session'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cookieParser())
app.use(express.json())
app.use(sessionMiddleware)

app.use('/api/items', itemsRouter)
app.use('/api/state', stateRouter)

app.listen(PORT, () => {
	console.log(`Сервер запущен: http://localhost:${PORT}`)
})
