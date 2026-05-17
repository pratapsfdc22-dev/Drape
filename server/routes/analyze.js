import { Router } from 'express'
import { uploadMiddleware } from '../middleware/upload.js'
import { analyzeRateLimiter } from '../middleware/rateLimiter.js'
import { analyzeWithClaude } from '../services/claudeService.js'
import { verifyToken, logSession } from '../services/supabaseService.js'

const router = Router()

const MAX_FILE_BYTES = 10 * 1024 * 1024

router.post('/', analyzeRateLimiter, uploadMiddleware.single('photo'), async (req, res) => {
  const file = req.file
  const { occasion, customPrompt = '' } = req.body

  if (!file) {
    return res.status(400).json({ message: 'Please upload a photo.' })
  }
  if (!occasion) {
    return res.status(400).json({ message: 'Please select an occasion.' })
  }
  if (file.size >= MAX_FILE_BYTES) {
    return res.status(400).json({ message: 'Image too large. Please upload an image under 10 MB.' })
  }

  try {
    const result = await analyzeWithClaude(file.buffer, file.mimetype, occasion, customPrompt)

    // Log session for authenticated users; guests pass through silently.
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const user = await verifyToken(authHeader.replace('Bearer ', ''))
      if (user) {
        const bodyType = result.bodyAnalysis?.bodyType ?? null
        logSession(user.id, occasion, bodyType, 3).catch(() => {})
      }
    }

    req.file.buffer = null
    res.json(result)
  } catch (err) {
    console.error('Analyze error:', err.message, err.stack)
    if (req.file) req.file.buffer = null
    res.status(500).json({
      message: 'Something went wrong. Please try again.',
      debug: err.message,
    })
  }
})

export default router
