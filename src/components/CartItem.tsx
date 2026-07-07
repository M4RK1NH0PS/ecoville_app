import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'
import { formatPrice } from '../data/mockData'
import ProductImage from './ProductImage'

interface CartItemProps {
  item: CartItemType
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

export default function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  const subtotal = item.product.preco * item.quantidade

  return (
    <div className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <ProductImage nome={item.product.nome} cor={item.product.cor} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-dark text-sm truncate">{item.product.nome}</h4>
            <p className="text-xs text-gray-500">{formatPrice(item.product.preco)} / un.</p>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
            aria-label="Remover"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-bg px-1 py-0.5">
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantidade - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-bold">{item.quantidade}</span>
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantidade + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-bold text-royal">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  )
}
