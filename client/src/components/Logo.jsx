export default function Logo({ textSize = 'text-xl', taglineSize = 'text-[9px]', showTagline = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Clothes hanger icon */}
      <svg
        width="28" height="22"
        viewBox="0 0 40 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold shrink-0"
        aria-hidden="true"
      >
        {/* Hook at top */}
        <path d="M20 2 C20 2 17 2 17 5 C17 6.8 18.5 7.5 20 7.5" />
        {/* Left arm */}
        <path d="M20 7.5 L4 22" />
        {/* Right arm */}
        <path d="M20 7.5 L36 22" />
        {/* Bottom bar */}
        <path d="M2 22 Q2 25 5 25 L35 25 Q38 25 38 22" />
      </svg>

      <div>
        <span className={`font-heading ${textSize} text-cream leading-none block`}>
          Get Draped
        </span>
        {showTagline && (
          <span className={`font-body ${taglineSize} text-gold/70 tracking-[0.18em] uppercase leading-none block mt-0.5`}>
            Powered by WestSideAI
          </span>
        )}
      </div>
    </div>
  )
}
