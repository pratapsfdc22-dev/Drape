import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useDrape } from '../context/DrapeContext.jsx'

export default function Nav() {
  const navigate = useNavigate()
  const { user } = useDrape()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav
      className="fixed top-0 inset-x-0 z-40 flex items-center justify-between
                 px-6 h-14 border-b border-cream/5"
      style={{ background: 'rgba(26,26,26,0.82)', backdropFilter: 'blur(12px)' }}
    >
      <Link
        to="/"
        className="font-heading text-lg text-cream hover:text-gold transition-colors duration-200"
      >
        Drape
      </Link>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            <span className="hidden sm:block font-body text-xs text-cream/35 max-w-[200px] truncate">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="font-body text-xs text-cream/40 hover:text-cream/70
                         transition-colors duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="font-body text-xs text-cream/35 hover:text-cream/60
                       transition-colors duration-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
