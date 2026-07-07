import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import ProviderCard from '@/components/provider/ProviderCard'

export default function Wishlist() {
  const { favorites } = useWishlist()

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-extrabold text-ink-900">المفضّلة</h1>
      <p className="mt-1 text-ink-500">الحِرفيّون الذين حفظتهم للرجوع إليهم لاحقاً.</p>

      {favorites.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p) => <ProviderCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-ink-400">
          <Heart className="h-8 w-8" />
          <p className="text-sm font-semibold">لا توجد عناصر في المفضّلة بعد.</p>
        </div>
      )}
    </div>
  )
}
