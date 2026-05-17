export default function Footer() {
  return (
    <footer className="border-t border-cream/8 py-6 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-body text-xs text-cream/50">
          © {new Date().getFullYear()} Get Draped. All rights reserved.
        </p>
        <p className="font-body text-xs text-cream/50">
          Powered by{' '}
          <a
            href="https://www.westsideai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 hover:text-gold transition-colors duration-150 underline underline-offset-2"
          >
            WestSide AI
          </a>
        </p>
      </div>
    </footer>
  )
}
