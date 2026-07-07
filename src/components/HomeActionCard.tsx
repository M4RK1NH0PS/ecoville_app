import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface HomeActionCardProps {
  title: string
  description: string
  icon: ReactNode
  iconBg: string
  onClick?: () => void
}

export default function HomeActionCard({
  title,
  description,
  icon,
  iconBg,
  onClick,
}: HomeActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[18px] bg-card px-4 py-4 shadow-card transition-all active:scale-[0.98] hover:shadow-md min-h-[80px]"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="text-[15px] font-bold leading-tight text-dark">{title}</h3>
        <p className="mt-0.5 text-[12px] leading-snug text-muted">{description}</p>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg">
        <ChevronRight size={18} className="text-muted" strokeWidth={2.5} />
      </div>
    </button>
  )
}
