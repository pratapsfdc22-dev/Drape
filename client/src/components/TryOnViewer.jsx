import { motion } from 'framer-motion'

export default function TryOnViewer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border-2 border-dashed border-gold/30 bg-gold/5 p-10 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
      </div>
      <p className="font-heading text-lg text-charcoal mb-2">Virtual Try-On</p>
      <p className="text-sm text-charcoal/50">
        AI-powered try-on is coming soon. ARIA will let you visualize outfits before you buy.
      </p>
    </motion.div>
  )
}
