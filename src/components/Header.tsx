import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
  transparent?: boolean
}

export default function Header({ title, showBack, onBack, rightAction, transparent }: HeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  return (
    <header
      className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3 ${
        transparent ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg text-dark hover:bg-gray-200 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-bold text-dark truncate">{title}</h1>
        )}
      </div>
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </header>
  )
}
