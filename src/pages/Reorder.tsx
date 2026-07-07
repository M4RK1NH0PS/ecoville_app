import { RefreshCw, Calendar } from 'lucide-react'
import Header from '../components/Header'
import ProductImage from '../components/ProductImage'
import PrimaryButton from '../components/PrimaryButton'
import { reorderItems } from '../data/mockData'
import { useCart } from '../context/CartContext'

export default function Reorder() {
  const { addToCart } = useCart()

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Recompra" showBack />

      <div className="px-4 space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-green/10 to-sky/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw size={18} className="text-green" />
            <h2 className="font-bold text-dark">Produtos recorrentes</h2>
          </div>
          <p className="text-sm text-gray-500">
            Acompanhe seus produtos e recompre com um toque
          </p>
        </div>

        {reorderItems.map((item) => (
          <div key={item.product.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <ProductImage nome={item.product.nome} cor={item.product.cor} size="sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-dark text-sm">{item.product.nome}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Você comprou {item.quantidadeComprada}. Última compra: {item.ultimaCompra}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <Calendar size={12} className="text-yellow" />
                  <span className="font-semibold text-dark">
                    Estimativa de término: {item.previsaoTermino}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <PrimaryButton
                size="sm"
                fullWidth
                onClick={() => addToCart(item.product)}
              >
                <RefreshCw size={14} />
                Comprar novamente
              </PrimaryButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
