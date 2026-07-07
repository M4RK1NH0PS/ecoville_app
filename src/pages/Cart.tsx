import { MessageCircle, Trash2, Save, ShoppingBag } from 'lucide-react'
import Header from '../components/Header'
import CartItem from '../components/CartItem'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { formatPrice, openWhatsApp } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, total, addToCart } = useCart()
  const { products } = useCatalog()

  const handleWhatsApp = () => {
    const list = items.map((i) => `${i.quantidade}x ${i.product.nome}`).join(', ')
    openWhatsApp(`Olá! Gostaria de finalizar meu pedido: ${list}. Total: ${formatPrice(total)}`)
  }

  const handleSaveList = () => {
    alert('Lista recorrente salva com sucesso! (Simulação)')
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <Header title="Meu Pedido" />
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <ShoppingBag size={64} className="text-gray-200 mb-4" />
          <h2 className="text-lg font-bold text-dark">Carrinho vazio</h2>
          <p className="mt-2 text-sm text-gray-500">
            Adicione produtos pelo catálogo ou use "Resolva minha sujeira"
          </p>
          <div className="mt-6 w-full space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase">Sugestões rápidas</p>
            {products.slice(0, 2).map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-royal hover:bg-royal/5 transition-colors"
              >
                + {p.nome}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Meu Pedido" />

      <div className="px-4 space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onUpdateQty={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}

        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Entrega</span>
            <span className="text-green font-semibold">Retirada na loja</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="font-bold text-dark">Total</span>
            <span className="text-xl font-extrabold text-royal">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <PrimaryButton fullWidth onClick={handleWhatsApp}>
            <MessageCircle size={18} />
            Finalizar pelo WhatsApp
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={handleSaveList}>
            <Save size={18} />
            Salvar como lista recorrente
          </SecondaryButton>
          <button
            onClick={clearCart}
            className="flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-red-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
            Limpar carrinho
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 pb-2">
          Pagamento não disponível nesta versão. O pedido será enviado via WhatsApp (simulação).
        </p>
      </div>
    </div>
  )
}
