import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useDrape } from '../context/DrapeContext.jsx'
import Logo from './Logo.jsx'

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
                 px-6 h-16 border-b border-cream/8"
      style={{ background: 'rgba(26,26,26,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <Link to="/">
        <Logo textSize="text-lg" taglineSize="text-[8px]" showTagline={true} />
      </Link>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            <span className="hidden sm:block font-body text-xs text-cream/60 max-w-[200px] truncate">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="font-body text-xs text-cream/65 hover:text-cream
                         transition-colors duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="font-body text-xs text-cream/65 hover:text-cream
                       transition-colors duration-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
