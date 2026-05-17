import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-body font-semibold text-gold tracking-[0.3em] text-xs uppercase mb-4"
      >
        404
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="font-heading text-3xl md:text-4xl text-cream mb-3"
      >
        This page doesn't exist.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-body text-cream/75 mb-10"
      >
        Let's style you instead.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <Link
          to="/"
          className="px-10 py-4 rounded-full border border-gold/40 text-gold font-body font-medium
                     hover:bg-gold hover:text-charcoal transition-all duration-300"
        >
          Back to Get Draped
        </Link>
      </motion.div>
    </main>
  )
}
