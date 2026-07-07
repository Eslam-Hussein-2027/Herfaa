import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        disabled={meta.current_page <= 1}
        onClick={() => onPage(meta.current_page - 1)}
        className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold text-ink-600">{meta.current_page} / {meta.last_page}</span>
      <button
        disabled={meta.current_page >= meta.last_page}
        onClick={() => onPage(meta.current_page + 1)}
        className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  )
}
