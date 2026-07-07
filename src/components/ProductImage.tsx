import { Package } from 'lucide-react'

interface ProductImageProps {
  nome: string
  cor: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ProductImage({ nome, cor, size = 'md' }: ProductImageProps) {
  const sizes = {
    sm: 'h-16 w-16 text-lg',
    md: 'h-28 w-full text-3xl',
    lg: 'h-48 w-full text-5xl',
  }

  const initials = nome
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={`flex items-center justify-center rounded-2xl font-bold text-white ${sizes[size]}`}
      style={{ background: `linear-gradient(135deg, ${cor}, ${cor}99)` }}
    >
      {size === 'sm' ? (
        <Package size={24} className="text-white/80" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Package size={size === 'lg' ? 48 : 32} className="text-white/60" />
          <span className="text-xs font-semibold text-white/80">{initials}</span>
        </div>
      )}
    </div>
  )
}
