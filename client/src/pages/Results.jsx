import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BodyAnalysis from '../components/BodyAnalysis.jsx'
import OutfitCard from '../components/OutfitCard.jsx'
import { useDrape } from '../context/DrapeContext.jsx'

export default function Results() {
  const navigate = useNavigate()
  const { analysisResult, resetAll, user } = useDrape()

  useEffect(() => {
    if (!analysisResult) navigate('/')
  }, [analysisResult, navigate])

  if (!analysisResult) return null

  const { bodyAnalysis, outfits, overallAdvice } = analysisResult

  function handleReset() {
    resetAll()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-charcoal">

      {/* ── Header ── */}
      <header className="text-center pt-24 pb-10 px-4">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-body font-semibold text-gold tracking-[0.3em] text-xs uppercase mb-3"
        >
          ARIA's Recommendations
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="font-heading text-3xl md:text-4xl text-cream"
        >
          Your Style Profile
        </motion.h1>
      </header>

      <div className="max-w-5xl mx-auto px-4 pb-24 space-y-14">

        {/* ── Guest banner ── */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between gap-4
                       bg-gold/8 border border-gold/15 rounded-xl px-4 py-3"
          >
            <p className="font-body text-xs text-cream/80 leading-relaxed">
              Sign in to save your style history
            </p>
            <Link
              to="/auth"
              className="shrink-0 font-body text-xs font-medium text-gold
                         hover:text-gold/75 transition-colors duration-150"
            >
              Sign In →
            </Link>
          </motion.div>
        )}

        {/* ── Body Analysis strip ── */}
        {bodyAnalysis && <BodyAnalysis bodyAnalysis={bodyAnalysis} />}

        {/* ── Outfit cards ── */}
        {outfits?.length > 0 && (
          <section>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="font-body font-semibold text-gold tracking-[0.3em] text-xs uppercase mb-6"
            >
              Curated for You
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {outfits.map((outfit, i) => (
                <OutfitCard key={outfit.id ?? i} outfit={outfit} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── Overall advice callout ── */}
        {overallAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="border-l-2 border-gold pl-6 py-1"
          >
            <p className="font-body font-semibold text-gold tracking-[0.2em] text-xs uppercase mb-3">
              ARIA's Advice
            </p>
            <p className="font-body text-cream/85 leading-relaxed">{overallAdvice}</p>
          </motion.div>
        )}

        {/* ── Style Another Look CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="text-center pt-2"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            className="px-10 py-4 rounded-full border border-gold/40 text-gold font-body font-medium
                       hover:bg-gold hover:text-charcoal transition-all duration-300 cursor-pointer"
          >
            Style Another Look
          </motion.button>
        </motion.div>

      </div>
    </main>
  )
}
