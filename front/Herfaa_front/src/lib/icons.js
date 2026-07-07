import {
  Hammer, Droplets, Zap, Paintbrush, Wind, Scissors, Flame,
  LayoutGrid, Sparkles, Wrench, Briefcase,
} from 'lucide-react'

const MAP = { Hammer, Droplets, Zap, Paintbrush, Wind, Scissors, Flame, LayoutGrid, Sparkles, Wrench }

/** Resolve a category's stored icon name to a lucide component. */
export function categoryIcon(name) {
  return MAP[name] || Briefcase
}
