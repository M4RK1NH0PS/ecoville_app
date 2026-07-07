import { Tag } from 'lucide-react'
import Header from '../components/Header'
import Badge from '../components/Badge'
import ProductImage from '../components/ProductImage'
import PrimaryButton from '../components/PrimaryButton'
import { offers, formatPrice } from '../data/mockData'
import { useCart } from '../context/CartContext'

export default function Offers() {
  const { addToCart } = useCart()

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Ofertas" showBack />

      <div className="px-4 space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-yellow/20 to-royal/10 p-4 flex items-center gap-3">
          <Tag size={24} className="text-royal" />
          <div>
            <h2 className="font-bold text-dark">Ofertas da Ecoville Lapa</h2>
            <p className="text-sm text-gray-500">Promoções válidas enquanto durarem os estoques</p>
          </div>
        </div>

        {offers.map((offer) => {
          const oldPrice = offer.product.precoAntigo ?? offer.product.preco * (1 + offer.desconto / 100)

          return (
            <div key={offer.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative p-4 pb-0">
                <div className="absolute left-6 top-6 z-10">
                  <Badge tag={`-${offer.desconto}%`} />
                </div>
                <ProductImage nome={offer.product.nome} cor={offer.product.cor} />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400">{offer.product.categoria}</p>
                  <h3 className="font-bold text-dark">{offer.product.nome}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 line-through">{formatPrice(oldPrice)}</span>
                  <span className="text-2xl font-extrabold text-royal">{formatPrice(offer.product.preco)}</span>
                </div>
                <PrimaryButton fullWidth size="sm" onClick={() => addToCart(offer.product)}>
                  Adicionar ao pedido
                </PrimaryButton>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
