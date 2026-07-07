import type { ReactNode } from 'react'

interface SelectOptionCardProps {
  label: string
  icon?: ReactNode
  selected?: boolean
  onClick?: () => void
}

export default function SelectOptionCard({ label, icon, selected, onClick }: SelectOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all active:scale-[0.97] ${
        selected
          ? 'border-royal bg-royal/5 shadow-md shadow-royal/10'
          : 'border-gray-200 bg-white hover:border-royal/30'
      }`}
    >
      {icon && (
        <div className={`text-2xl ${selected ? 'text-royal' : 'text-gray-500'}`}>
          {icon}
        </div>
      )}
      <span className={`text-xs font-semibold text-center leading-tight ${selected ? 'text-royal' : 'text-dark'}`}>
        {label}
      </span>
    </button>
  )
}
