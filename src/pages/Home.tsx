import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Sparkles, ShoppingCart, Package } from 'lucide-react'
import Logo from '../components/Logo'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import HomeActionCard from '../components/HomeActionCard'
import PromoBanner from '../components/PromoBanner'
import NearestStoreCard from '../components/NearestStoreCard'
import { buscarProdutos } from '../utils/searchProducts'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useCatalog } from '../context/CatalogContext'
import { useUserStore } from '../hooks/useUserStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { products: catalogProducts } = useCatalog()
  const { store, loadingStore } = useUserStore()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  const results = useMemo(
    () => buscarProdutos(debouncedQuery, catalogProducts),
    [debouncedQuery, catalogProducts],
  )

  const isSearching = debouncedQuery.trim().length > 0

  const actionCards = [
    {
      title: 'Buscar produto',
      description: 'Encontre o produto ideal para cada necessidade.',
      icon: <Search size={22} className="text-white" strokeWidth={2.5} />,
      iconBg: '#0057D9',
      onClick: () => {
        setQuery('')
        document.getElementById('home-search')?.focus()
      },
    },
    {
      title: 'Resolver sujeira',
      description: 'Descubra como resolver cada tipo de sujeira.',
      icon: <Sparkles size={22} className="text-white" strokeWidth={2.5} />,
      iconBg: '#22C55E',
      onClick: () => navigate('/resolve'),
    },
    {
      title: 'Fazer pedido',
      description: 'Monte seu carrinho e faça seu pedido agora.',
      icon: <ShoppingCart size={22} className="text-blue-dark" strokeWidth={2.5} />,
      iconBg: '#FFD400',
      onClick: () => navigate('/cart'),
    },
    {
      title: 'Recomprar',
      description: 'Compre novamente seus produtos favoritos.',
      icon: <Package size={22} className="text-white" strokeWidth={2.5} />,
      iconBg: '#0057D9',
      onClick: () => navigate('/reorder'),
    },
  ]

  return (
    <div className="animate-fade-in min-h-full bg-bg pb-2">
      <header className="relative bg-gradient-to-b from-royal to-blue-dark px-5 pt-12 pb-10 rounded-b-[28px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Logo size="xs" className="rounded-2xl shadow-md" />
            <div>
              <h1 className="text-2xl font-bold leading-none tracking-tight text-white">
                Ecoville
              </h1>
              <p className="mt-1 text-[13px] font-semibold text-white/80">
                Smart Clean
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Notificações"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
          >
            <Bell size={20} className="text-white" strokeWidth={2} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow ring-2 ring-royal" />
          </button>
        </div>
      </header>

      <div className="relative z-10 -mt-6 px-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => buscarProdutos(query, catalogProducts)}
        />
      </div>

      {isSearching ? (
        <SearchResults
          query={debouncedQuery}
          results={results}
          onChipClick={(chip) => setQuery(chip)}
        />
      ) : (
        <>
          <section className="px-4 pt-5">
            <NearestStoreCard store={store} loading={loadingStore} compact />
          </section>

          <section className="space-y-3 px-4 pt-5">
            {actionCards.map((card) => (
              <HomeActionCard key={card.title} {...card} />
            ))}
          </section>

          <section className="px-4 pt-5 pb-4">
            <PromoBanner onClick={() => navigate('/catalog')} />
          </section>
        </>
      )}
    </div>
  )
}
