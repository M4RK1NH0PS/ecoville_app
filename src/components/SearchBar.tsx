import type { FormEvent } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar produto',
  autoFocus,
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-12 w-full items-center gap-3 rounded-[20px] bg-card px-4 shadow-search transition-shadow focus-within:shadow-md"
    >
      <Search size={20} className="shrink-0 text-muted" strokeWidth={2.5} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-sm text-dark placeholder:text-muted outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bg text-muted"
        >
          <X size={16} />
        </button>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bg">
          <SlidersHorizontal size={16} className="text-royal" strokeWidth={2.5} />
        </div>
      )}
    </form>
  )
}
