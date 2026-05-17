import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase.js'
import Logo from '../components/Logo.jsx'

export default function Auth() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  function switchTab(t) {
    setTab(t)
    setError(null)
    setSuccessMsg(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      if (tab === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        navigate('/')
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        setSuccessMsg('Check your email to confirm your account.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (err) { setError(err.message); setLoading(false) }
  }

  const inputClass = [
    'w-full rounded-xl bg-charcoal/5 border border-charcoal/12 px-4 py-3',
    'font-body text-sm text-charcoal placeholder:text-charcoal/30',
    'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold/50',
    'transition-colors duration-150',
  ].join(' ')

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10"
      style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #0d1520 60%, #1a1a2e 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        {/* Wordmark */}
        <div className="flex justify-center mb-8">
          <Logo textSize="text-3xl" taglineSize="text-[10px]" showTagline={true} />
        </div>

        {/* Card */}
        <div className="bg-cream rounded-3xl p-8">

          {/* Tabs */}
          <div className="flex rounded-full bg-charcoal/8 p-1 mb-7">
            {[
              { id: 'signin', label: 'Sign In' },
              { id: 'signup', label: 'Create Account' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className={[
                  'flex-1 py-2 rounded-full font-body text-sm font-medium transition-all duration-200',
                  tab === id
                    ? 'bg-charcoal text-cream shadow-sm'
                    : 'text-charcoal/45 hover:text-charcoal/65',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full
                       border border-charcoal/15 font-body text-sm font-medium text-charcoal
                       hover:border-charcoal/30 hover:bg-charcoal/4
                       transition-all duration-200 cursor-pointer disabled:opacity-50 mb-5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-cream font-body text-xs text-charcoal/30">or</span>
            </div>
          </div>

          {/* Email + password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-body text-[10px] font-semibold text-charcoal/45 mb-1.5 tracking-widest uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-body text-[10px] font-semibold text-charcoal/45 mb-1.5 tracking-widest uppercase"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {/* Feedback messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-1.5 font-body text-sm text-red-600"
                >
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {error}
                </motion.p>
              )}
              {successMsg && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-body text-sm text-emerald-700 leading-relaxed"
                >
                  {successMsg}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-charcoal text-cream font-body font-semibold text-sm
                         hover:bg-gold hover:text-charcoal transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Guest bypass */}
          <p className="mt-6 text-center font-body text-xs text-charcoal/60">
            Just browsing?{' '}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-charcoal/70 underline underline-offset-2 hover:text-charcoal
                         transition-colors cursor-pointer"
            >
              Continue as guest
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
