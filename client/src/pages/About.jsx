import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <main className="min-h-screen bg-cream">
      <header className="text-center pt-14 pb-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl text-charcoal"
        >
          About Get Draped
        </motion.h1>
      </header>

      <section className="max-w-2xl mx-auto px-4 pb-24 space-y-10">
        <div>
          <h2 className="font-heading text-2xl mb-4">Meet ARIA</h2>
          <p className="text-charcoal/80 leading-relaxed">
            ARIA (AI Recommendation & Image Analyst) is Get Draped's styling engine, powered by Claude's
            advanced vision capabilities. She analyzes your photo to understand your body type, skin tone,
            and existing style — then curates outfit recommendations tailored specifically to you.
          </p>
        </div>

        <div className="bg-charcoal text-cream rounded-2xl p-6">
          <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-3">
            Privacy by Design
          </p>
          <p className="text-cream/85 leading-relaxed text-sm">
            Your photos are held in server memory only for the seconds it takes ARIA to analyze them.
            They are never written to disk, never stored in a database, and never shared with third parties.
            Once the analysis is complete, the image is permanently gone.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl mb-4">The Tech</h2>
          <ul className="space-y-2 text-charcoal/75">
            {[
              'React + Vite frontend, deployed on Vercel',
              'Node.js + Express backend, deployed on Railway',
              'Supabase for authentication and anonymous session logs',
              'Anthropic Claude for AI vision analysis',
              'In-memory image handling — zero cloud storage',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/"
          className="inline-block px-8 py-3 bg-charcoal text-cream rounded-full font-semibold hover:bg-gold hover:text-charcoal transition"
        >
          Try ARIA
        </Link>
      </section>
    </main>
  )
}
