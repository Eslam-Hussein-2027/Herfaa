import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search, MapPin, Star, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { providersApi } from '@/api/providers'
import { categoryIcon } from '@/lib/icons'
import { CITIES } from '@/lib/constants'

function HeroSearch() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (city) params.set('city', city)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-ink-200 bg-white p-2 text-start shadow-lg sm:flex-row">
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="h-5 w-5 text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink-400"
          placeholder={t('hero.searchPlaceholder')}
        />
      </div>
      <div className="flex items-center gap-2 border-ink-100 px-3 sm:border-s">
        <MapPin className="h-5 w-5 text-ink-400" />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent py-3 text-sm text-ink-600 outline-none">
          <option value="">{t('hero.allCities')}</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button type="submit" className="flex items-center justify-center gap-1.5 rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-white shadow-amber transition hover:bg-gold-600">
        {t('hero.search')}
      </button>
    </form>
  )
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold text-teal-700">{value}</div>
      <div className="mt-1 text-sm text-ink-500">{label}</div>
    </div>
  )
}

function CategoriesSection() {
  const { t, i18n } = useTranslation()
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await providersApi.categories()).data.data,
  })
  const cats = (data || []).slice(0, 8)
  const catName = (c) => (i18n.language === 'ar' ? c.name_ar : c.name_en)

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-2xl font-extrabold text-ink-900">{t('categories.title')}</h2>
      <p className="mt-1 text-ink-500">{t('categories.subtitle')}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cats.map((c) => {
          const Icon = categoryIcon(c.icon)
          return (
            <Link
              key={c.id}
              to={`/search?category_id=${c.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-deep text-gold-600 transition group-hover:bg-gold-500 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-ink-800">{catName(c)}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const steps = [
    { Icon: Search, title: t('steps.s1t'), text: t('steps.s1d') },
    { Icon: CheckCircle2, title: t('steps.s2t'), text: t('steps.s2d') },
    { Icon: Star, title: t('steps.s3t'), text: t('steps.s3d') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -start-24 -top-24 h-72 w-72 rounded-full bg-gold-100/60 blur-3xl" />
        <div className="absolute -end-24 top-32 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
            <ShieldCheck className="h-4 w-4" /> {t('hero.badge')}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink-900 md:text-5xl">
            {t('hero.titleBefore')} <span className="text-gold-600">{t('hero.highlight')}</span> {t('hero.titleAfter')}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
            {t('hero.subtitle')}
          </p>
          <HeroSearch />
        </div>

        <div className="border-y border-ink-200/70 bg-white">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-5 py-8">
            <Stat value={isAr ? '٢٬٤٠٠' : '2,400'} label={t('stats.providers')} />
            <Stat value={isAr ? '١٨٬٠٠٠' : '18,000'} label={t('stats.jobs')} />
            <Stat value={isAr ? '٤٫٨' : '4.8'} label={t('stats.rating')} />
          </div>
        </div>
      </section>

      <CategoriesSection />

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
        <h2 className="text-center text-2xl font-extrabold text-ink-900">{t('steps.title')}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-3xl border border-ink-200 bg-white p-7 text-center shadow-sm">
              <span className="absolute -top-4 start-7 grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-50 text-gold-600">
                <s.Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
