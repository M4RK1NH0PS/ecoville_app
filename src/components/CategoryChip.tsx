interface CategoryChipProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export default function CategoryChip({ label, active, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? 'bg-royal text-white shadow-md shadow-royal/20'
          : 'bg-white text-dark border border-gray-200 hover:border-royal/30'
      }`}
    >
      {label}
    </button>
  )
}
