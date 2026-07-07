import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'

/** Heart toggle — renders only for authenticated customers. */
export default function FavoriteButton({ providerId, className = '' }) {
  const { enabled, isFavorite, toggle } = useWishlist()
  if (!enabled) return null

  const fav = isFavorite(providerId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(providerId)
      }}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow ring-1 ring-black/5 transition hover:scale-105 ${className}`}
      aria-label={fav ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة'}
    >
      <Heart className={`h-4 w-4 ${fav ? 'fill-red-500 text-red-500' : 'text-ink-400'}`} />
    </button>
  )
}
