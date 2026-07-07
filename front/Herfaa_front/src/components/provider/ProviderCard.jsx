import { Link } from 'react-router-dom'
import { ShieldCheck, Star, MapPin } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

/** Provider summary card — used on Home and Search. */
export default function ProviderCard({ p }) {
  return (
    <Link
      to={`/providers/${p.id}`}
      className="relative block overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <FavoriteButton providerId={p.id} className="absolute end-3 top-3 z-10" />
      <div className="flex items-center gap-3 p-5">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500 text-lg font-bold text-white">
          {p.name?.charAt(0)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-bold text-ink-900">{p.name}</h3>
            <ShieldCheck className="h-4 w-4 shrink-0 text-teal-500" />
          </div>
          <p className="truncate text-sm text-ink-500">{p.headline || p.category?.name_ar}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm">
        <span className="flex items-center gap-1 text-ink-600">
          <MapPin className="h-4 w-4 text-ink-400" /> {p.city || '—'}
        </span>
        <span className="flex items-center gap-1 font-semibold text-gold-700">
          <Star className="h-4 w-4 fill-gold-500 text-gold-500" /> {p.rating_avg}
        </span>
      </div>
      {p.base_price != null && (
        <div className="bg-cream px-5 py-3 text-sm text-ink-500">
          يبدأ من <span className="font-bold text-ink-900">{p.base_price} د.ل</span>
        </div>
      )}
    </Link>
  )
}
