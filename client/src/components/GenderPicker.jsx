import { useDrape } from '../context/DrapeContext.jsx'

const OPTIONS = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'nonbinary', label: 'Non-binary / Other' },
]

export default function GenderPicker() {
  const { gender, setGender } = useDrape()

  return (
    <div className="flex flex-wrap gap-3">
      {OPTIONS.map(({ id, label }) => {
        const selected = gender === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setGender(id)}
            className={[
              'px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-200 cursor-pointer',
              selected
                ? 'bg-charcoal text-cream border-2 border-charcoal'
                : 'bg-transparent text-charcoal border-2 border-charcoal/20 hover:border-charcoal/40',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
