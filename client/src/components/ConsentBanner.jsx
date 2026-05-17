import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'drape_consent_acknowledged'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(!localStorage.getItem(STORAGE_KEY))

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-charcoal border-t border-cream/8 px-4 py-5 md:px-8"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="flex-1 font-body text-sm text-cream/65 leading-relaxed">
              Drape processes your photos in real-time using AI. No images are stored.{' '}
              <Link
                to="/about"
                className="text-gold hover:text-gold/75 transition-colors duration-150 underline underline-offset-2"
              >
                See our Privacy Policy
              </Link>
            </p>
            <button
              onClick={dismiss}
              className="shrink-0 px-6 py-2 bg-gold text-charcoal font-body font-semibold text-sm
                         rounded-full hover:bg-gold/85 transition-colors duration-200 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
