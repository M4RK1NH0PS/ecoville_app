import { useNavigate } from 'react-router-dom'
import { Star, Clock, AlertTriangle } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../data/mockData'
import ProductImage from './ProductImage'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import Badge from './Badge'

interface RecommendationCardProps {
  product: Product
  label: string
  highlight?: boolean
  onAdd?: () => void
}

export default function RecommendationCard({
  product,
  label,
  highlight,
  onAdd,
}: RecommendationCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        highlight
          ? 'border-royal bg-gradient-to-br from-royal/5 to-white shadow-lg shadow-royal/10'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {highlight && <Star size={16} className="text-yellow fill-yellow" />}
        <span className={`text-xs font-bold uppercase tracking-wide ${highlight ? 'text-royal' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      <div className="flex gap-3">
        <div className="w-20 shrink-0">
          <ProductImage nome={product.nome} cor={product.cor} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <Badge tag={product.tag} small />
          <h4 className="mt-1 font-bold text-dark text-sm leading-snug">{product.nome}</h4>
          <p className="text-lg font-bold text-royal">{formatPrice(product.preco)}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <SecondaryButton size="sm" className="flex-1 !py-2" onClick={() => navigate(`/product/${product.id}`)}>
          Ver produto
        </SecondaryButton>
        {onAdd && (
          <PrimaryButton size="sm" className="flex-1 !py-2" onClick={onAdd}>
            Adicionar
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}

interface RecommendationResultProps {
  comoUsar: string
  tempoAcao: string
  cuidados: string[]
}

export function RecommendationInfo({ comoUsar, tempoAcao, cuidados }: RecommendationResultProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h4 className="mb-2 font-bold text-dark">Como usar</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{comoUsar}</p>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-sky/10 p-3">
          <Clock size={18} className="text-sky shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Tempo de ação</p>
            <p className="text-sm font-bold text-dark">{tempoAcao}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-yellow/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow" />
          <h4 className="font-bold text-dark text-sm">Cuidados</h4>
        </div>
        <ul className="space-y-1">
          {cuidados.map((c) => (
            <li key={c} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-yellow mt-0.5">•</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
