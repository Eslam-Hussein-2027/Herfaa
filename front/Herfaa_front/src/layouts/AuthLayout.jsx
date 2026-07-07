import { Link, Outlet } from 'react-router-dom'
import { Hammer, ShieldCheck, Star, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/Logo'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (teal) — hidden on small screens */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-teal-700 p-12 text-white lg:flex">
        <div className="absolute -top-24 -start-24 h-80 w-80 rounded-full bg-teal-600/40 blur-3xl" />
        <div className="absolute -bottom-24 -end-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-white">
            <Hammer className="h-5 w-5" />
          </span>
          <span className="text-2xl font-extrabold">حِرفة</span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight">
            أنجز عملك بثقة مع حِرفيّ ماهر قريب منك
          </h2>
          <p className="mt-3 max-w-sm text-teal-100">
            منصّة تربطك بحِرفيّين موثوقين في ليبيا، بأسعار واضحة وتقييمات حقيقية.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-teal-50">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gold-300" /> حِرفيّون موثّقون ومعتمدون
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-300" /> تقييمات حقيقية من العملاء
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gold-300" /> حجز سهل ودفع نقدي
            </li>
          </ul>
        </div>

        <p className="relative text-sm text-teal-200">© ٢٠٢٦ حِرفة</p>
      </aside>

      {/* Form area */}
      <main className="flex items-center justify-center bg-cream p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
