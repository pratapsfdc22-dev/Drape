import { createClient } from '@supabase/supabase-js'

function createAnonClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return null
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

function createServiceClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export { createAnonClient, createServiceClient }

/**
 * Verify a Supabase JWT and return the user, or null if invalid.
 */
export async function verifyToken(token) {
  const client = createAnonClient()
  if (!client) return null
  const { data, error } = await client.auth.getUser(token)
  if (error) return null
  return data.user
}

/**
 * Log a style session. Only called when userId is known (user is authenticated).
 * No image data is ever passed here — metadata only.
 */
export async function logSession(userId, occasion, bodyType, outfitCount) {
  const { error } = await createServiceClient()
    .from('style_sessions')
    .insert([{ user_id: userId, occasion, body_type: bodyType, outfit_count: outfitCount }])
  if (error) throw error
}

/**
 * Return all past sessions for a user, newest first.
 */
export async function getUserSessions(userId) {
  const { data, error } = await createServiceClient()
    .from('style_sessions')
    .select('id, occasion, body_type, outfit_count, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/**
 * GDPR right to erasure — delete all data associated with a user.
 * The ON DELETE CASCADE on style_sessions handles row deletion automatically
 * when the auth user is deleted, but this allows explicit erasure on request.
 */
export async function deleteUserData(userId) {
  const { error } = await createServiceClient()
    .from('style_sessions')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}
