import { motion } from 'framer-motion'

export default function BodyAnalysis({ bodyAnalysis }) {
  if (!bodyAnalysis) return null

  const { bodyType, skinTone, colorPalette, styleNotes } = bodyAnalysis

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/5 border border-cream/15 rounded-2xl px-6 py-5"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

        {/* Body type badge */}
        {bodyType && (
          <div className="flex items-center gap-2.5">
            <span className="font-body text-[10px] text-cream/65 uppercase tracking-widest">
              Body type
            </span>
            <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/30
                             font-body text-xs font-semibold text-gold">
              {bodyType}
            </span>
          </div>
        )}

        {/* Skin tone chip */}
        {skinTone && (
          <>
            <div className="hidden sm:block w-px h-4 bg-cream/15" />
            <div className="flex items-center gap-2.5">
              <span className="font-body text-[10px] text-cream/65 uppercase tracking-widest">
                Skin tone
              </span>
              <span className="px-3 py-1 rounded-full bg-cream/10
                               font-body text-xs text-cream/80">
                {skinTone}
              </span>
            </div>
          </>
        )}

        {/* Color palette circles */}
        {colorPalette?.length > 0 && (
          <>
            <div className="hidden sm:block w-px h-4 bg-cream/15" />
            <div className="flex items-center gap-2.5">
              <span className="font-body text-[10px] text-cream/65 uppercase tracking-widest">
                Your palette
              </span>
              <div className="flex gap-1.5">
                {colorPalette.slice(0, 3).map((hex, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-cream/25 shadow-sm"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      {/* Style notes */}
      {styleNotes && (
        <p className="font-heading text-sm italic text-cream/80 leading-relaxed
                       border-t border-cream/10 mt-5 pt-5">
          &ldquo;{styleNotes}&rdquo;
        </p>
      )}
    </motion.div>
  )
}
