import { Star } from 'lucide-react'

export default function StarRating({ value = 0, onChange, size = 'h-5 w-5', readonly = true }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={readonly ? 'cursor-default' : 'cursor-pointer transition hover:scale-110'}
          aria-label={`${n} نجوم`}
        >
          <Star className={`${size} ${n <= value ? 'fill-gold-500 text-gold-500' : 'text-ink-300'}`} />
        </button>
      ))}
    </div>
  )
}
