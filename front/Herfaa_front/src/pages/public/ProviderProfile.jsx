import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, Star, MapPin, Wrench, ImageOff } from 'lucide-react'
import { providersApi } from '@/api/providers'
import { reviewsApi } from '@/api/reviews'
import { PRICE_UNIT_LABEL } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import BookingModal from '@/components/booking/BookingModal'
import FavoriteButton from '@/components/provider/FavoriteButton'
import StarRating from '@/components/review/StarRating'

export default function ProviderProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [bookingOpen, setBookingOpen] = useState(false)

  const { data: p, isLoading, isError } = useQuery({
    queryKey: ['provider', id],
    queryFn: async () => (await providersApi.get(id)).data.data,
  })

  const { data: reviews } = useQuery({
    queryKey: ['provider-reviews', id],
    queryFn: async () => (await reviewsApi.providerReviews(id)).data.data,
  })

  if (isLoading)
    return (
      <div className="grid min-h-[60vh] place-items-center text-gold-500">
        <Spinner />
      </div>
    )

  if (isError || !p)
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-ink-900">الحِرفي غير موجود</h1>
        <p className="mt-2 text-ink-500">قد يكون الحساب غير معتمد أو تم حذفه.</p>
        <Link to="/" className="mt-4 inline-block font-bold text-gold-600">العودة للرئيسية</Link>
      </div>
    )

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-l from-teal-700 to-teal-600" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-gold-500 text-3xl font-bold text-white shadow-md">
                {p.name?.charAt(0)}
              </span>
              <div className="pb-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-extrabold text-ink-900">{p.name}</h1>
                  <ShieldCheck className="h-5 w-5 text-teal-500" />
                </div>
                <p className="text-ink-500">{p.headline}</p>
              </div>
            </div>
            {!isAuthenticated ? (
              <Link to="/login">
                <Button>سجّل دخولك للحجز</Button>
              </Link>
            ) : user?.role === 'customer' ? (
              <div className="flex items-center gap-2">
                <FavoriteButton providerId={p.id} className="border border-ink-200" />
                <Button onClick={() => setBookingOpen(true)}>احجز الآن</Button>
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-600">
            {p.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-1 font-semibold text-gold-700">
                <Wrench className="h-4 w-4" /> {p.category.name_ar}
              </span>
            )}
            {p.city && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ink-400" /> {p.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-semibold text-gold-700">
              <Star className="h-4 w-4 fill-gold-500 text-gold-500" /> {p.rating_avg}
              <span className="font-normal text-ink-400">({p.rating_count} تقييم)</span>
            </span>
            {p.base_price != null && (
              <span className="text-ink-500">
                يبدأ من <span className="font-bold text-ink-900">{p.base_price} د.ل</span> · {PRICE_UNIT_LABEL[p.price_unit]}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Bio */}
          {p.bio && (
            <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink-900">نبذة</h2>
              <p className="mt-2 leading-relaxed text-ink-600">{p.bio}</p>
            </section>
          )}

          {/* Services */}
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink-900">الخدمات</h2>
            {p.services?.length ? (
              <div className="mt-4 space-y-3">
                {p.services.map((s) => (
                  <div key={s.id} className="flex items-start justify-between gap-4 rounded-xl border border-ink-100 p-4">
                    <div>
                      <h3 className="font-semibold text-ink-900">{s.title}</h3>
                      {s.description && <p className="mt-1 text-sm text-ink-500">{s.description}</p>}
                    </div>
                    {s.price != null && (
                      <span className="whitespace-nowrap text-sm font-bold text-gold-700">
                        {s.price} د.ل
                        <span className="block text-xs font-normal text-ink-400">{PRICE_UNIT_LABEL[s.price_unit]}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-400">لا توجد خدمات مُضافة بعد.</p>
            )}
          </section>

          {/* Portfolio */}
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink-900">معرض الأعمال</h2>
            {p.portfolio?.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.portfolio.map((item) => (
                  <figure key={item.id} className="overflow-hidden rounded-xl border border-ink-100">
                    <img src={item.image_url} alt={item.caption || ''} className="aspect-square w-full object-cover" />
                    {item.caption && <figcaption className="px-2 py-1.5 text-xs text-ink-500">{item.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 py-10 text-ink-400">
                <ImageOff className="h-7 w-7" />
                <span className="text-sm">لا توجد صور أعمال بعد.</span>
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink-900">التقييمات ({p.rating_count})</h2>
            {reviews?.length ? (
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-ink-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink-900">{r.customer_name}</span>
                      <StarRating value={r.rating} size="h-4 w-4" />
                    </div>
                    {r.comment && <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{r.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-400">لا توجد تقييمات بعد.</p>
            )}
          </section>
        </div>

        {/* Skills */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink-900">المهارات</h2>
            {p.skills?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <span key={s.id} className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-400">لا توجد مهارات مُضافة.</p>
            )}
          </section>
        </aside>
      </div>

      {bookingOpen && (
        <BookingModal
          provider={p}
          onClose={() => setBookingOpen(false)}
          onCreated={() => { setBookingOpen(false); navigate('/bookings') }}
        />
      )}
    </div>
  )
}
