import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrape } from '../context/DrapeContext.jsx'

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NZ', name: 'New Zealand' },
]

const inputClass = [
  'w-full rounded-xl bg-charcoal/5 border border-charcoal/12 px-4 py-3',
  'font-body text-sm text-charcoal placeholder:text-charcoal/30',
  'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold/50',
  'transition-colors duration-150',
].join(' ')

export default function LocationPicker() {
  const { location, setLocation } = useDrape()
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState(null)
  const [detected, setDetected] = useState(false)

  const country = location?.country || ''
  const postalCode = location?.postalCode || ''

  function handleCountryChange(e) {
    setLocation(prev => ({ ...prev, country: e.target.value }))
    setDetectError(null)
    setDetected(false)
  }

  function handlePostalChange(e) {
    setLocation(prev => ({ ...prev, postalCode: e.target.value }))
  }

  async function handleDetect() {
    if (!navigator.geolocation) {
      setDetectError('Geolocation is not supported by your browser.')
      return
    }
    setDetecting(true)
    setDetectError(null)
    setDetected(false)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()
          setLocation({
            country: data.countryName || '',
            postalCode: data.postcode || '',
          })
          setDetected(true)
        } catch {
          setDetectError('Could not read location data. Please enter manually.')
        } finally {
          setDetecting(false)
        }
      },
      (err) => {
        setDetecting(false)
        setDetectError(
          err.code === 1
            ? 'Location access denied. Please select your country below.'
            : 'Could not detect location. Please enter manually.'
        )
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="space-y-5">

      {/* Auto-detect button */}
      <button
        type="button"
        onClick={handleDetect}
        disabled={detecting}
        className={[
          'flex items-center gap-2.5 px-5 py-3 rounded-full border-2 font-body text-sm font-medium',
          'transition-all duration-200 cursor-pointer disabled:opacity-50',
          detected
            ? 'border-charcoal bg-charcoal text-cream'
            : 'border-charcoal/25 text-charcoal hover:border-charcoal/50 hover:bg-charcoal/4',
        ].join(' ')}
      >
        {detecting ? (
          <motion.span
            className="w-4 h-4 rounded-full border-2 border-charcoal/25 border-t-charcoal block shrink-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        )}
        {detecting
          ? 'Detecting…'
          : detected
            ? `Detected: ${country}`
            : 'Auto-detect my location'}
      </button>

      <AnimatePresence>
        {detectError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-body text-xs text-red-500"
          >
            {detectError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-charcoal/10" />
        <span className="font-body text-xs text-charcoal/35">or enter manually</span>
        <div className="flex-1 border-t border-charcoal/10" />
      </div>

      {/* Country select */}
      <div>
        <label className="block font-body text-[10px] font-semibold text-charcoal/45 mb-1.5 tracking-widest uppercase">
          Country
        </label>
        <select
          value={country}
          onChange={handleCountryChange}
          className={inputClass + ' cursor-pointer'}
        >
          <option value="">Select a country…</option>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Postal / Zip code */}
      <div>
        <label className="block font-body text-[10px] font-semibold text-charcoal/45 mb-1.5 tracking-widest uppercase">
          Zip / Postal Code
          <span className="ml-1.5 text-charcoal/30 normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={postalCode}
          onChange={handlePostalChange}
          placeholder="e.g. 10001 or SW1A 1AA"
          className={inputClass}
        />
      </div>

    </div>
  )
}
