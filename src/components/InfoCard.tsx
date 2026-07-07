import type { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  description?: string
  icon?: ReactNode
  onClick?: () => void
  accent?: 'royal' | 'yellow' | 'green' | 'sky'
}

const accentStyles = {
  royal: 'from-royal/10 to-royal/5 border-royal/20',
  yellow: 'from-yellow/20 to-yellow/5 border-yellow/30',
  green: 'from-green/10 to-green/5 border-green/20',
  sky: 'from-sky/10 to-sky/5 border-sky/20',
}

const iconStyles = {
  royal: 'bg-royal text-white',
  yellow: 'bg-yellow text-dark',
  green: 'bg-green text-white',
  sky: 'bg-sky text-white',
}

export default function InfoCard({
  title,
  description,
  icon,
  onClick,
  accent = 'royal',
}: InfoCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-2xl border bg-gradient-to-br p-4 text-left transition-all hover:shadow-md active:scale-[0.98] ${accentStyles[accent]}`}
    >
      {icon && (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyles[accent]}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-dark">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 leading-snug">{description}</p>
        )}
      </div>
    </button>
  )
}
