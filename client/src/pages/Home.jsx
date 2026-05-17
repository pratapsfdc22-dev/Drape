import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UploadZone from '../components/UploadZone.jsx'
import GenderPicker from '../components/GenderPicker.jsx'
import OccasionPicker from '../components/OccasionPicker.jsx'
import LoadingARIA from '../components/LoadingARIA.jsx'
import { useDrape } from '../context/DrapeContext.jsx'
import { useAnalyze, TIMEOUT_ERROR_MSG } from '../hooks/useAnalyze.js'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Your Photo',
    desc: 'Share a full-body photo, head to toe. ARIA reads your silhouette, proportions, and natural coloring.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    ),
  },
  {
    step: '02',
    title: 'Choose Your Occasion',
    desc: "Dinner date, board meeting, weekend escape — tell ARIA where you're headed.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z" />
    ),
  },
  {
    step: '03',
    title: 'Get Styled by ARIA',
    desc: '3 complete outfit recommendations with real brands, real prices, and direct links to shop.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    ),
  },
]

export default function Home() {
  const { uploadedFile, gender, selectedOccasion, setError } = useDrape()
  const { submitForAnalysis, isLoading, error } = useAnalyze()
  const [consent, setConsent] = useState(false)
  const formRef = useRef(null)

  const canSubmit = !!uploadedFile && !!gender && !!selectedOccasion && consent && !isLoading
  const isTimeoutError = error === TIMEOUT_ERROR_MSG

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSubmit() {
    if (!uploadedFile) { setError('Please upload a photo first.'); return }
    if (!gender) { setError('Please select a style preference.'); return }
    if (!selectedOccasion) { setError('Please select an occasion.'); return }
    if (!consent) { setError('Please check the consent box.'); return }
    submitForAnalysis()
  }

  return (
    <main className="bg-charcoal min-h-screen">

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #0d1520 60%, #1a1a2e 100%)' }}
      >
        {/* Subtle noise grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── FASHION FLOATERS ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

          {/* Ambient orb — gold, drifts top-left */}
          <motion.div
            className="absolute rounded-full"
            style={{ top: '-160px', left: '-160px', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)' }}
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Ambient orb — indigo, drifts bottom-right */}
          <motion.div
            className="absolute rounded-full"
            style={{ bottom: '-200px', right: '-80px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(80,90,200,0.07) 0%, transparent 65%)' }}
            animate={{ x: [0, -50, 0], y: [0, -55, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── LEFT COLUMN ── */}

          {/* Crown */}
          <motion.div className="absolute hidden md:block text-gold" style={{ top: '10%', left: '5%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.32, y: [0, -18, 0], rotate: [-4, 4, -4] }}
            transition={{ opacity: { delay: 0.5, duration: 1.5 }, y: { delay: 0.5, duration: 6.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 0.5, duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="44" height="34" viewBox="0 0 44 34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 30 L4 14 L13 22 L22 4 L31 22 L40 14 L40 30 Z" />
              <line x1="4" y1="30" x2="40" y2="30" />
              <circle cx="22" cy="4" r="2" fill="currentColor" stroke="none" />
              <circle cx="4" cy="13" r="2" fill="currentColor" stroke="none" />
              <circle cx="40" cy="13" r="2" fill="currentColor" stroke="none" />
            </svg>
          </motion.div>

          {/* Sparkle — upper left */}
          <motion.div className="absolute hidden sm:block text-cream" style={{ top: '27%', left: '9%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.24, y: [0, -12, 0], scale: [1, 1.22, 1] }}
            transition={{ opacity: { delay: 0.9, duration: 1.2 }, y: { delay: 0.9, duration: 5, repeat: Infinity, ease: 'easeInOut' }, scale: { delay: 0.9, duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>

          {/* Dress */}
          <motion.div className="absolute hidden md:block text-gold" style={{ top: '40%', left: '3.5%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.28, y: [0, -20, 0], rotate: [-5, 5, -5] }}
            transition={{ opacity: { delay: 0.7, duration: 1.5 }, y: { delay: 0.7, duration: 7.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 0.7, duration: 9.5, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="36" height="52" viewBox="0 0 40 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 2 Q20 8 24 2" />
              <path d="M16 2 L8 10 L2 10 L2 20 L10 17 L7 54 L33 54 L30 17 L38 20 L38 10 L32 10 L24 2" />
            </svg>
          </motion.div>

          {/* Lightning bolt */}
          <motion.div className="absolute hidden md:block text-cream" style={{ top: '64%', left: '7%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.20, y: [0, -15, 0], rotate: [-3, 3, -3] }}
            transition={{ opacity: { delay: 1.4, duration: 1.5 }, y: { delay: 1.4, duration: 6, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 1.4, duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="26" height="42" viewBox="0 0 28 46" fill="currentColor">
              <path d="M18 2 L6 24 L14 24 L10 44 L22 20 L14 20 Z" />
            </svg>
          </motion.div>

          {/* Tiny sparkle — bottom left */}
          <motion.div className="absolute hidden sm:block text-gold" style={{ top: '82%', left: '13%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.40, y: [0, -10, 0], scale: [1, 1.35, 1] }}
            transition={{ opacity: { delay: 1.8, duration: 1 }, y: { delay: 1.8, duration: 4.5, repeat: Infinity, ease: 'easeInOut' }, scale: { delay: 1.8, duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}

          {/* Clothes hanger */}
          <motion.div className="absolute hidden md:block text-gold" style={{ top: '8%', right: '5%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.30, y: [0, -16, 0], rotate: [4, -4, 4] }}
            transition={{ opacity: { delay: 0.4, duration: 1.5 }, y: { delay: 0.4, duration: 7, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 0.4, duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="46" height="36" viewBox="0 0 52 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M26 3 C26 3 23 3 23 6 C23 7.8 24.5 8.5 26 8.5" />
              <path d="M26 8.5 L6 28" />
              <path d="M26 8.5 L46 28" />
              <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28" />
            </svg>
          </motion.div>

          {/* Sunglasses */}
          <motion.div className="absolute hidden md:block text-gold" style={{ top: '28%', right: '4%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.30, y: [0, -18, 0], rotate: [3, -3, 3] }}
            transition={{ opacity: { delay: 0.6, duration: 1.5 }, y: { delay: 0.6, duration: 7, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 0.6, duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="56" height="26" viewBox="0 0 62 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="16" cy="15" r="12" />
              <circle cx="46" cy="15" r="12" />
              <path d="M28 15 L34 15" />
              <path d="M4 10 L0 8" />
              <path d="M58 10 L62 8" />
            </svg>
          </motion.div>

          {/* Sparkle — right middle */}
          <motion.div className="absolute hidden sm:block text-cream" style={{ top: '44%', right: '8%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22, y: [0, -14, 0], scale: [1, 1.25, 1] }}
            transition={{ opacity: { delay: 1.1, duration: 1.2 }, y: { delay: 1.1, duration: 5.5, repeat: Infinity, ease: 'easeInOut' }, scale: { delay: 1.1, duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>

          {/* Handbag */}
          <motion.div className="absolute hidden md:block text-gold" style={{ top: '58%', right: '4%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.28, y: [0, -20, 0], rotate: [-5, 5, -5] }}
            transition={{ opacity: { delay: 1.6, duration: 1.5 }, y: { delay: 1.6, duration: 8, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 1.6, duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="40" height="46" viewBox="0 0 44 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="18" width="36" height="30" rx="5" />
              <path d="M14 18 Q14 6 22 6 Q30 6 30 18" />
              <line x1="4" y1="32" x2="40" y2="32" strokeOpacity="0.4" />
              <line x1="19" y1="40" x2="25" y2="40" />
            </svg>
          </motion.div>

          {/* Diamond gem */}
          <motion.div className="absolute hidden md:block text-cream" style={{ top: '76%', right: '6%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22, y: [0, -16, 0], rotate: [4, -4, 4] }}
            transition={{ opacity: { delay: 2, duration: 1.5 }, y: { delay: 2, duration: 6, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 2, duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="36" height="32" viewBox="0 0 40 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="20,34 2,14 8,2 32,2 38,14" />
              <path d="M2 14 L20 34 L38 14" />
              <path d="M8 2 L14 14 L26 14 L32 2" />
            </svg>
          </motion.div>

          {/* Tiny sparkle — bottom right */}
          <motion.div className="absolute hidden sm:block text-gold" style={{ top: '86%', right: '14%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.42, y: [0, -9, 0], scale: [1, 1.3, 1] }}
            transition={{ opacity: { delay: 2.3, duration: 1 }, y: { delay: 2.3, duration: 4, repeat: Infinity, ease: 'easeInOut' }, scale: { delay: 2.3, duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>

          {/* ── TOP CENTER EXTRAS ── */}
          <motion.div className="absolute hidden sm:block text-gold" style={{ top: '4%', left: '28%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.30, y: [0, -10, 0], scale: [1, 1.18, 1] }}
            transition={{ opacity: { delay: 0.2, duration: 1.2 }, y: { delay: 0.2, duration: 5, repeat: Infinity, ease: 'easeInOut' }, scale: { delay: 0.2, duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>
          <motion.div className="absolute hidden sm:block text-cream" style={{ top: '6%', right: '26%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.20, y: [0, -10, 0], scale: [1, 1.18, 1] }}
            transition={{ opacity: { delay: 0.8, duration: 1.2 }, y: { delay: 0.8, duration: 4.5, repeat: Infinity, ease: 'easeInOut' }, scale: { delay: 0.8, duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
            </svg>
          </motion.div>

        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body font-semibold text-gold tracking-[0.3em] text-xs uppercase mb-6"
        >
          Meet ARIA
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl text-cream leading-[1.1] text-balance"
        >
          Dress for<br />the moment.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="mt-6 font-body text-cream/80 text-lg max-w-sm leading-relaxed"
        >
          Upload your photo. Tell ARIA your occasion.
          <br />Get a wardrobe built for you.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={scrollToForm}
          className="mt-10 px-8 py-3.5 rounded-full border border-gold/40 text-gold font-body font-medium
                     hover:bg-gold hover:text-charcoal transition-all duration-300 cursor-pointer"
        >
          Get Styled
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToForm}
        >
          <span className="font-body text-cream/50 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-4 h-4 text-cream/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── UPLOAD + OCCASION + SUBMIT ── */}
      <section ref={formRef} className="py-20 px-4">
        <div className="max-w-xl mx-auto">

          <div className="bg-cream rounded-3xl p-8 sm:p-12">

            {/* Upload */}
            <div>
              <p className="font-body font-semibold text-gold tracking-[0.25em] text-xs uppercase mb-2">
                Step 1
              </p>
              <h2 className="font-heading text-2xl text-charcoal mb-6">Start with a full-body photo</h2>
              <UploadZone />

              {/* Privacy notice */}
              <div className="flex items-start gap-2 mt-4">
                <svg
                  className="w-3.5 h-3.5 text-charcoal/35 mt-0.5 shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="font-body text-xs text-charcoal/60 leading-relaxed">
                  Your photo is analyzed instantly and never stored. Privacy by design.
                </p>
              </div>
            </div>

            {/* Gender — slides in when photo is ready */}
            <AnimatePresence>
              {uploadedFile && (
                <motion.div
                  key="gender"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-8 pt-8 border-t border-charcoal/10"
                >
                  <p className="font-body font-semibold text-gold tracking-[0.25em] text-xs uppercase mb-2">
                    Step 2
                  </p>
                  <h2 className="font-heading text-2xl text-charcoal mb-6">Style recommendations for…</h2>
                  <GenderPicker />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Occasion — slides in when gender is chosen */}
            <AnimatePresence>
              {uploadedFile && gender && (
                <motion.div
                  key="occasion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-8 pt-8 border-t border-charcoal/10"
                >
                  <p className="font-body font-semibold text-gold tracking-[0.25em] text-xs uppercase mb-2">
                    Step 3
                  </p>
                  <h2 className="font-heading text-2xl text-charcoal mb-6">What's the occasion?</h2>
                  <OccasionPicker />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Consent + CTA — slides in when occasion is chosen */}
            <AnimatePresence>
              {uploadedFile && gender && selectedOccasion && (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="mt-8 pt-8 border-t border-charcoal/10 space-y-5"
                >
                  {/* Consent checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                          ${consent
                            ? 'bg-charcoal border-charcoal'
                            : 'border-charcoal/25 group-hover:border-charcoal/50'
                          }`}
                      >
                        {consent && (
                          <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="font-body text-sm text-charcoal/75 leading-relaxed">
                      I understand my photo will be analyzed by AI and immediately discarded
                    </span>
                  </label>

                  {/* Inline error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <p className="flex items-start gap-1.5 font-body text-sm text-red-600">
                          <svg
                            className="w-4 h-4 mt-0.5 shrink-0"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          {error}
                        </p>
                        {isTimeoutError && (
                          <button
                            type="button"
                            onClick={submitForAnalysis}
                            className="ml-5 font-body text-sm font-medium text-charcoal/55
                                       underline underline-offset-2 hover:text-charcoal
                                       transition-colors duration-150 cursor-pointer"
                          >
                            Try again
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileTap={canSubmit ? { scale: 0.98 } : undefined}
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className={`w-full py-4 rounded-full font-body font-semibold text-base transition-all duration-300
                      ${canSubmit
                        ? 'bg-charcoal text-cream hover:bg-gold hover:text-charcoal cursor-pointer'
                        : 'bg-charcoal/8 text-charcoal/25 cursor-not-allowed'
                      }`}
                  >
                    Style Me with ARIA →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 border-t border-cream/8">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <p className="font-body font-semibold text-gold tracking-[0.3em] text-xs uppercase mb-3">
              The Process
            </p>
            <h2 className="font-heading text-4xl text-cream">How ARIA works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
              <div
                key={step}
                className="flex flex-col gap-5 p-6 rounded-2xl border border-cream/8
                           hover:border-gold/30 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/20
                                  flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {icon}
                    </svg>
                  </div>
                  <span className="font-heading text-5xl text-cream/8">{step}</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg text-cream mb-2">{title}</h3>
                  <p className="font-body text-sm text-cream/75 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── LOADING OVERLAY — fixed, covers entire viewport ── */}
      <AnimatePresence>
        {isLoading && <LoadingARIA />}
      </AnimatePresence>

    </main>
  )
}
