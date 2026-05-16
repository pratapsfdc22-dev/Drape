import { Router } from 'express'
import { verifyToken } from '../services/supabaseService.js'

const router = Router()

/**
 * Middleware: read Bearer token, verify with Supabase, attach user to req.
 * Non-blocking — if no token is present req.user stays null.
 * Returns 401 only if a token is present but invalid.
 */
export async function extractUser(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  const token = header.replace('Bearer ', '')
  const user = await verifyToken(token)
  if (!user) return res.status(401).json({ message: 'Invalid or expired token.' })

  req.user = user
  next()
}

/**
 * POST /api/auth/session
 * Validate a Supabase JWT and return the authenticated user object.
 */
router.post('/session', async (req, res) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header required.' })
  }

  const token = header.replace('Bearer ', '')
  const user = await verifyToken(token)
  if (!user) return res.status(401).json({ message: 'Invalid or expired token.' })

  res.json({ user })
})

export default router
