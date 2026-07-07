import { Hammer } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-white shadow-amber">
        <Hammer className="h-5 w-5" />
      </span>
      <span className="text-2xl font-extrabold text-teal-700">حِرفة</span>
    </Link>
  )
}
