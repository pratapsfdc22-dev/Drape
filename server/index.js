import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import analyzeRouter from './routes/analyze.js'
import authRouter from './routes/auth.js'
import { globalRateLimiter } from './middleware/rateLimiter.js'

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = (process.env.CLIENT_URL ?? '')
  .split(',')
  .map(u => u.trim())
  .filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
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
