import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'Analyzing your silhouette...',
  'Reading your color story...',
  'Curating your wardrobe...',
  'Matching brands to your style...',
  'Almost ready...',
]

export default function LoadingARIA() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center
                 bg-charcoal/92 backdrop-blur-sm"
    >
      {/* Pulsing ARIA logo */}
      <div className="relative w-20 h-20 mb-10">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-gold/50"
            animate={{ scale: [1, 1.85, 1], opacity: [0.65, 0, 0.65] }}
            transition={{ duration: 2.2, delay: i * 0.65, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30
                       flex items-center justify-center"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="font-heading text-2xl text-gold font-semibold select-none">A</span>
          </motion.div>
        </div>
      </div>

      {/* Rotating message */}
      <div className="h-8 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="font-heading text-xl text-cream text-center"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Time estimate */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 font-body text-xs text-cream/60 tracking-wide"
      >
        This takes about 15–20 seconds
      </motion.p>
    </motion.div>
  )
}
