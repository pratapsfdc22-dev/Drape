import { motion } from 'framer-motion'

export default function OutfitCard({ outfit, index }) {
  const { name, vibe, description, pieces, stylingTip, accentColor } = outfit

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.45)' }}
      className="flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-cream/15"
    >
      {/* Accent color bar */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{ backgroundColor: accentColor ?? '#c9a84c' }}
      />

      <div className="flex flex-col flex-1 p-6 gap-5">

        {/* Name + vibe badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg text-cream leading-tight">{name}</h3>
          {vibe && (
            <span className="shrink-0 mt-0.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/25
                             font-body text-[10px] font-semibold text-gold tracking-wide uppercase">
              {vibe}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="font-body text-sm text-cream/80 leading-relaxed">{description}</p>
        )}

        {/* Pieces */}
        {pieces?.length > 0 && (
          <div>
            <p className="font-body text-[10px] font-semibold text-cream/55 tracking-[0.2em] uppercase mb-3">
              Pieces
            </p>
            <ul className="space-y-3.5">
              {pieces.map((piece, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-body text-sm text-cream leading-snug">{piece.item}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-cream/10 text-cream/65">
                        {piece.brand}
                      </span>
                      <span className="font-body text-xs text-cream/60">{piece.price}</span>
                    </div>
                  </div>
                  {piece.url && (
                    <a
                      href={piece.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 self-center font-body text-xs text-cream/60
                                 hover:text-gold transition-colors duration-150"
                    >
                      Shop →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Styling tip */}
        {stylingTip && (
          <div className="mt-auto pt-4 border-t border-cream/10">
            <p className="font-heading text-xs italic text-cream/65 leading-relaxed">
              {stylingTip}
            </p>
          </div>
        )}

      </div>
    </motion.div>
  )
}
