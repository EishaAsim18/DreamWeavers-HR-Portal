import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { config } from './config.js'
import { ensureSeedData } from './lib/bootstrap.js'
import { errorHandler } from './middleware/error-handler.js'
import { authRouter } from './routes/auth.routes.js'
import { attendanceRouter } from './routes/attendance.routes.js'
import { stateRouter } from './routes/state.routes.js'
import { aiRouter } from './routes/ai.routes.js'

const app = express()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: config.corsOrigins, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(apiLimiter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dreamweavers-api', contact: config.adminEmail })
})

app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth', authRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/state', stateRouter)
app.use('/api/ai', aiRouter)

app.use(errorHandler)

async function start() {
  await ensureSeedData()
  app.listen(config.port, () => {
    console.log(`🚀 DreamWeavers API running on http://localhost:${config.port}`)
  })
}

void start()
