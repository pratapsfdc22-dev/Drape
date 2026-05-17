import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import analyzeRouter from './routes/analyze.js'
import authRouter from './routes/auth.js'
import { globalRateLimiter } from './middleware/rateLimiter.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.options('*', cors())
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(globalRateLimiter)

app.use('/api/analyze', analyzeRouter)
app.use('/api/auth', authRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Drape API' })
})

app.get('/debug/env', (_req, res) => {
  res.json({
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
    claudeModel: process.env.CLAUDE_MODEL ?? '(not set)',
    nodeEnv: process.env.NODE_ENV ?? '(not set)',
  })
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
