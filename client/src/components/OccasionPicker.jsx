import { motion, AnimatePresence } from 'framer-motion'
import { useDrape } from '../context/DrapeContext.jsx'

const OCCASIONS = [
  { id: 'wedding',    emoji: '💍', label: 'Wedding / Formal'  },
  { id: 'office',     emoji: '🏢', label: 'Office / Business' },
  { id: 'party',      emoji: '🎉', label: 'Party / Cocktail'  },
  { id: 'casual',     emoji: '🌿', label: 'Casual / Everyday' },
  { id: 'date',       emoji: '🎭', label: 'Date Night'        },
  { id: 'beach',      emoji: '🏖️', label: 'Beach / Vacation'  },
  { id: 'graduation', emoji: '🎓', label: 'Graduation'        },
  { id: 'activewear', emoji: '🏋️', label: 'Activewear'        },
]

const MAX_CHARS = 200

export default function OccasionPicker({ onOccasionChange }) {
  const { selectedOccasion, setSelectedOccasion, customPrompt, setCustomPrompt } = useDrape()

  function selectOccasion(id) {
    const next = selectedOccasion === id ? null : id
    setSelectedOccasion(next)
    onOccasionChange?.(next, customPrompt)
  }

  function handleCustomPrompt(e) {
    const value = e.target.value.slice(0, MAX_CHARS)
    setCustomPrompt(value)
    onOccasionChange?.(selectedOccasion, value)
  }

  const remaining = MAX_CHARS - customPrompt.length

  return (
    <div>
      {/* ── Occasion grid ── */}
      <div
        role="radiogroup"
        aria-label="Select an occasion"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      >
        {OCCASIONS.map((o) => {
          const selected = selectedOccasion === o.id
          return (
            <motion.button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={o.label}
              onClick={() => selectOccasion(o.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className={[
                'relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4',
                'min-h-[90px] transition-colors duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
                selected
                  ? 'bg-charcoal border-gold'
                  : 'bg-charcoal border-white/8 hover:border-gold/50',
              ].join(' ')}
            >
              {/* Gold background tint */}
              <AnimatePresence>
                {selected && (
                  <motion.span
                    key="tint"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 rounded-xl bg-gold/10 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Checkmark badge */}
              <AnimatePresence>
                {selected && (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg className="w-2.5 h-2.5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="text-[2rem] leading-none" aria-hidden="true">
                {o.emoji}
              </span>
              <span
                className={[
                  'font-body text-xs font-medium text-center leading-tight transition-colors duration-150',
                  selected ? 'text-cream' : 'text-cream/60',
                ].join(' ')}
              >
                {o.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* ── Custom description ── */}
      <div className="mt-5">
        <label
          htmlFor="custom-occasion"
          className="block font-body text-xs font-medium text-charcoal/50 mb-2 tracking-wide uppercase"
        >
          Or describe your event&hellip;
        </label>

        <div className="relative">
          <textarea
            id="custom-occasion"
            value={customPrompt}
            onChange={handleCustomPrompt}
            placeholder="e.g. My sister's engagement dinner in NYC..."
            rows={3}
            maxLength={MAX_CHARS}
            aria-label="Describe your event in your own words"
            aria-describedby="char-counter"
            className={[
              'w-full rounded-xl bg-charcoal border px-4 py-3 pb-7',
              'font-body text-sm text-cream placeholder:text-cream/25',
              'resize-none transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-0 focus:border-gold/60',
              customPrompt.length > 0 ? 'border-white/15' : 'border-white/8',
            ].join(' ')}
          />

          <span
            id="char-counter"
            aria-live="polite"
            aria-label={`${remaining} characters remaining`}
            className={[
              'absolute bottom-2.5 right-3 font-body text-[10px] tabular-nums transition-colors duration-150',
              remaining < 20 ? 'text-gold' : 'text-cream/25',
            ].join(' ')}
          >
            {customPrompt.length}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </div>
  )
}
