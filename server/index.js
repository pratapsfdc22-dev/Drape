import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import analyzeRouter from './routes/analyze.js'
import authRouter from './routes/auth.js'
import { globalRateLimiter } from './middleware/rateLimiter.js'

const app = express()
const PORT = process.env.PORT || 3001

// Railway (and most PaaS) sit behind a load balancer — trust the first proxy
// so express-rate-limit reads the real client IP from X-Forwarded-For
app.set('trust proxy', 1)

const ALLOWED_ORIGINS = [
  'https://get-drape.com',
  'https://www.get-drape.com',
  'http://localhost:5173',
]

// Raw CORS handler — runs before helmet, rate limiter, and everything else.
// Sets the header on every response (including 429s) and short-circuits OPTIONS
// preflight immediately so the rate limiter never sees it.
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(express.json({ limit: '50mb' }))
app.use(globalRateLimiter)

app.use('/api/analyze', analyzeRouter)
app.use('/api/auth', authRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Drape API' })
})


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Drape API', timestamp: new Date().toISOString() })
})

app.use((err, req, res, _next) => {
  console.error(err.stack)
  // Clear any image buffer from memory immediately
  if (req.file) req.file.buffer = null
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => {
  console.log(`Drape API running on port ${PORT}`)
})
