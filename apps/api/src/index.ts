import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import { errorHandler } from './middleware/error-handler.js'
import { authRouter } from './routes/auth.routes.js'
import { attendanceRouter } from './routes/attendance.routes.js'
import { stateRouter } from './routes/state.routes.js'
import { aiRouter } from './routes/ai.routes.js'

const app = express()

app.use(cors({ origin: config.corsOrigins, credentials: true }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dreamweavers-api', contact: config.adminEmail })
})

app.use('/api/auth', authRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/state', stateRouter)
app.use('/api/ai', aiRouter)

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`🚀 DreamWeavers API running on http://localhost:${config.port}`)
})
