import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, RefreshCw, ShoppingCart } from 'lucide-react'
import Header from '../components/Header'
import Badge from '../components/Badge'
import ProductImage from '../components/ProductImage'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import ProductCard from '../components/ProductCard'
import { formatPrice, openWhatsApp } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { getProductById, products } = useCatalog()
  const product = getProductById(id ?? '')
  const complementares = products
    .filter((p) => p.id !== id && p.categoria === product?.categoria)
    .slice(0, 3)

  if (!product) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <p className="text-gray-500">Produto não encontrado.</p>
      </div>
    )
  }

  const handleWhatsApp = () => {
    openWhatsApp(`Olá! Tenho interesse no produto: ${product.nome}`)
  }

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Detalhe do Produto" showBack />
      <div className="px-4 space-y-5">
        <div className="relative">
          <ProductImage nome={product.nome} cor={product.cor} size="lg" />
          <div className="absolute left-3 top-3">
            <Badge tag={product.tag} />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-sky">{product.categoria}</p>
          <h1 className="text-xl font-extrabold text-dark mt-1">{product.nome}</h1>
          <p className="text-2xl font-bold text-royal mt-2">{formatPrice(product.preco)}</p>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{product.descricao}</p>
        </div>

        <InfoSection title="Aplicações" items={product.aplicacoes} />
        <DetailRow label="Modo de uso" value={product.modoUso} />
        <DetailRow label="Diluição recomendada" value={product.diluicao} />
        <DetailRow label="Rendimento estimado" value={product.rendimento} />
        <InfoSection title="Cuidados" items={product.cuidados} warning />

        {complementares.length > 0 && (
          <section>
            <h3 className="mb-3 font-bold text-dark">Produtos complementares</h3>
            <div className="space-y-3">
              {complementares.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </section>
        )}

        <div className="sticky bottom-20 space-y-2 bg-bg pt-2">
          <PrimaryButton fullWidth onClick={() => addToCart(product)}>
            <ShoppingCart size={18} />
            Adicionar ao carrinho
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={handleWhatsApp}>
            <MessageCircle size={18} />
            Comprar pelo WhatsApp
          </SecondaryButton>
          <button
            onClick={() => navigate('/reorder')}
            className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-500 hover:text-royal transition-colors"
          >
            <RefreshCw size={16} />
            Adicionar à recompra
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-dark leading-relaxed">{value}</p>
    </div>
  )
}

function InfoSection({
  title,
  items,
  warning,
}: {
  title: string
  items: string[]
  warning?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 ${warning ? 'bg-yellow/10' : 'bg-white shadow-sm'}`}>
      <p className="text-sm font-bold text-dark mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
            <span className={warning ? 'text-yellow' : 'text-royal'}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
