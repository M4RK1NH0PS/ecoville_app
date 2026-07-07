import { useNavigate } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../data/mockData'
import { useCart } from '../context/CartContext'
import Badge from './Badge'
import ProductImage from './ProductImage'
import SecondaryButton from './SecondaryButton'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  if (compact) {
    return (
      <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <ProductImage nome={product.nome} cor={product.cor} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-dark truncate">{product.nome}</p>
            <p className="text-xs text-gray-500">{product.categoria}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-royal">{formatPrice(product.preco)}</span>
            <button
              onClick={() => addToCart(product)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-royal text-white"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative p-3 pb-0">
        <div className="absolute left-5 top-5 z-10">
          <Badge tag={product.tag} small />
        </div>
        <ProductImage nome={product.nome} cor={product.cor} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-xs font-medium text-gray-400">{product.categoria}</p>
          <h3 className="font-bold text-dark leading-snug">{product.nome}</h3>
        </div>
        <p className="text-lg font-bold text-royal">{formatPrice(product.preco)}</p>
        <div className="mt-auto flex gap-2">
          <SecondaryButton
            size="sm"
            className="flex-1 !py-2"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <Eye size={14} />
            Ver detalhes
          </SecondaryButton>
          <button
            onClick={() => addToCart(product)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow text-dark shadow-sm transition-transform active:scale-95"
            aria-label="Adicionar ao carrinho"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
