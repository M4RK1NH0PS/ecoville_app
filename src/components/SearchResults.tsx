import { useNavigate } from 'react-router-dom'
import { Eye, Plus, SearchX } from 'lucide-react'
import type { SearchResult } from '../types'
import { formatPrice } from '../data/mockData'
import { SEARCH_SUGGESTION_CHIPS } from '../data/productSearchMeta'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'
import HighlightText from './HighlightText'
import Badge from './Badge'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import CategoryChip from './CategoryChip'

interface SearchResultsProps {
  query: string
  results: SearchResult[]
  onChipClick: (chip: string) => void
}

export default function SearchResults({ query, results, onChipClick }: SearchResultsProps) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  if (!query.trim()) return null

  if (results.length === 0) {
    return (
      <section className="animate-fade-in space-y-4 px-4 pt-4">
        <div className="rounded-[18px] bg-card p-6 text-center shadow-card">
          <SearchX size={40} className="mx-auto text-muted/40 mb-3" />
          <p className="font-bold text-dark">Não encontramos um produto exato para sua busca.</p>
          <p className="mt-2 text-[13px] text-muted leading-relaxed">
            Você pode tentar buscar por ambiente, sujeira ou superfície.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEARCH_SUGGESTION_CHIPS.map((chip) => (
            <CategoryChip key={chip} label={chip} onClick={() => onChipClick(chip)} />
          ))}
        </div>
      </section>
    )
  }

  const highlightTerms = [
    query,
    ...results.flatMap((r) => r.termosCorrespondentes),
  ]

  return (
    <section className="animate-fade-in space-y-3 px-4 pt-4">
      <p className="text-[13px] font-semibold text-muted">
        Encontramos produtos para sua limpeza
      </p>
      {results.map((product) => (
        <div
          key={product.id}
          className="rounded-[18px] bg-card p-4 shadow-card"
        >
          <div className="flex gap-3">
            <ProductImage nome={product.nome} cor={product.cor} size="sm" />
            <div className="min-w-0 flex-1">
              <Badge tag={product.tag} small />
              <h3 className="mt-1 text-[15px] font-bold leading-snug text-dark">
                <HighlightText text={product.nome} terms={highlightTerms} />
              </h3>
              <p className="text-xs text-muted">{product.categoria}</p>
              <p className="mt-1 text-base font-bold text-royal">
                {formatPrice(product.preco)}
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-bg px-3 py-2 text-[12px] leading-relaxed text-muted">
            <span className="font-semibold text-dark">Motivo: </span>
            {product.motivo}
          </p>
          <div className="mt-3 flex gap-2">
            <SecondaryButton
              size="sm"
              className="flex-1 !py-2"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Eye size={14} />
              Ver produto
            </SecondaryButton>
            <PrimaryButton
              size="sm"
              className="flex-1 !py-2"
              onClick={() => addToCart(product)}
            >
              <Plus size={14} />
              Adicionar
            </PrimaryButton>
          </div>
        </div>
      ))}
    </section>
  )
}
