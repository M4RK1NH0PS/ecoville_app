import { useState } from 'react'
import Header from '../components/Header'
import CategoryChip from '../components/CategoryChip'
import ProductCard from '../components/ProductCard'
import { useCatalog } from '../context/CatalogContext'
import { catalogProducts } from '../data/catalogLoader'

export default function Catalog() {
  const { products, categories } = useCatalog()
  const [activeCategory, setActiveCategory] = useState('Todos')
  const fromPdf = catalogProducts.length > 0

  const filtered =
    activeCategory === 'Todos'
      ? products
      : products.filter((p) => p.categoria === activeCategory)

  return (
    <div className="animate-fade-in">
      <Header title="Catálogo de Produtos" />
      <div className="px-4 pb-4">
        {!fromPdf && (
          <p className="mb-3 rounded-xl bg-yellow/10 px-3 py-2 text-[11px] text-dark leading-relaxed">
            Catálogo padrão ativo. Rode <code className="font-semibold">npm run generate:catalog</code> após
            colocar PDFs com texto selecionável em <code className="font-semibold">public/catalogos/</code>.
          </p>
        )}
        {fromPdf && (
          <p className="mb-3 text-[11px] font-semibold text-green">
            {catalogProducts.length} produtos carregados dos PDFs do catálogo
          </p>
        )}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
        <p className="mb-3 text-sm text-muted">{filtered.length} produtos encontrados</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
