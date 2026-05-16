import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'drape_consent'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(!localStorage.getItem(STORAGE_KEY))

  function accept() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-charcoal text-cream px-4 py-5 md:px-8"
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            <p className="flex-1 text-sm leading-relaxed">
              <span className="font-semibold text-gold">Your privacy matters.</span>{' '}
              Photos you upload are processed entirely in memory and never stored on our servers.
              Once ARIA analyzes your style, the image is permanently discarded.
            </p>
            <button
              onClick={accept}
              className="shrink-0 px-6 py-2 bg-gold text-charcoal font-semibold text-sm rounded-full hover:bg-opacity-90 transition"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
