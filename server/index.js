import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import analyzeRouter from './routes/analyze.js'
import authRouter from './routes/auth.js'
import { globalRateLimiter } from './middleware/rateLimiter.js'

const app = express()
const PORT = process.env.PORT || 3001

// Trust Railway's load balancer so the rate limiter uses the real client IP
// from X-Forwarded-For instead of Railway's internal proxy IP.
app.set('trust proxy', 1)

// CORS before helmet and rate limiter so every response (including 429s)
// carries Access-Control-Allow-Origin.  app.options short-circuits OPTIONS
// preflight before it ever reaches the rate limiter.
app.options('*', cors())
app.use(cors())

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(express.json({ limit: '50mb' }))

// Health checks before the rate limiter — Railway's hikari pings /health
// every ~30 s; counting those against the rate limit exhausted the bucket
// and caused hikari to mark the service unhealthy, blocking all traffic.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Drape API' })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Drape API', timestamp: new Date().toISOString() })
})

app.use(globalRateLimiter)

app.use('/api/analyze', analyzeRouter)
app.use('/api/auth', authRouter)

app.use((err, req, res, _next) => {
  console.error(err.stack)
  if (req.file) req.file.buffer = null
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => {
  console.log(`Drape API running on port ${PORT}`)
})
