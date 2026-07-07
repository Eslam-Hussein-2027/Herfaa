import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search as SearchIcon, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { providersApi } from '@/api/providers'
import { CITIES } from '@/lib/constants'
import ProviderCard from '@/components/provider/ProviderCard'
import Spinner from '@/components/ui/Spinner'

const SORTS = [
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'price_asc', label: 'السعر: من الأقل' },
  { value: 'price_desc', label: 'السعر: من الأعلى' },
  { value: 'newest', label: 'الأحدث' },
]

const RATINGS = [
  ['', 'الكل'],
  ['3', '+3'],
  ['4', '+4'],
  ['4.5', '+4.5'],
]

const fieldCls = 'w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-400'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await providersApi.categories()).data.data,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', searchParams.toString()],
    queryFn: async () => (await providersApi.list(params)).data.data,
  })

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value == null) next.delete(key)
    else next.set(key, value)
    next.delete('page')
    setSearchParams(next)
  }

  const goPage = (page) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', page)
    setSearchParams(next)
  }

  const meta = data?.meta
  const items = data?.items || []

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex items-center gap-2">
        <SearchIcon className="h-6 w-6 text-gold-500" />
        <h1 className="text-2xl font-extrabold text-ink-900">
          {params.q ? `نتائج البحث عن "${params.q}"` : 'تصفّح الحِرفيّين'}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="space-y-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-2 font-bold text-ink-900">
            <SlidersHorizontal className="h-4 w-4 text-gold-500" /> التصفية
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">المهنة</span>
            <select className={fieldCls} value={params.category_id || ''} onChange={(e) => setParam('category_id', e.target.value)}>
              <option value="">كل المهن</option>
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">المدينة</span>
            <select className={fieldCls} value={params.city || ''} onChange={(e) => setParam('city', e.target.value)}>
              <option value="">كل المدن</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">التقييم</span>
            <div className="flex gap-1.5">
              {RATINGS.map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setParam('min_rating', v)}
                  className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition ${
                    (params.min_rating || '') === v ? 'bg-gold-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">السعر (د.ل)</span>
            <div className="flex gap-2">
              <input
                type="number" min="0" placeholder="من" defaultValue={params.min_price || ''}
                onBlur={(e) => setParam('min_price', e.target.value)}
                className={fieldCls}
              />
              <input
                type="number" min="0" placeholder="إلى" defaultValue={params.max_price || ''}
                onBlur={(e) => setParam('max_price', e.target.value)}
                className={fieldCls}
              />
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">الترتيب</span>
            <select className={fieldCls} value={params.sort || 'rating'} onChange={(e) => setParam('sort', e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </aside>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="grid h-64 place-items-center text-gold-500"><Spinner /></div>
          ) : items.length ? (
            <>
              <p className="mb-4 text-sm text-ink-500">
                {meta?.total} نتيجة {isFetching && <span className="text-gold-500">· تحديث…</span>}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => <ProviderCard key={p.id} p={p} />)}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={meta.current_page <= 1}
                    onClick={() => goPage(meta.current_page - 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-semibold text-ink-600">
                    {meta.current_page} / {meta.last_page}
                  </span>
                  <button
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => goPage(meta.current_page + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="grid h-64 place-content-center rounded-2xl border border-dashed border-ink-200 bg-white text-center text-ink-400">
              <p className="font-semibold">لا توجد نتائج مطابقة</p>
              <p className="mt-1 text-sm">جرّب تعديل عوامل التصفية.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
