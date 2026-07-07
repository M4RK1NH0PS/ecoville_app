import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import { getCatalogProductsFromJson } from '../data/catalogLoader'

interface CatalogContextType {
  products: Product[]
  categories: string[]
  getProductById: (id: string) => Product | undefined
}

const CatalogContext = createContext<CatalogContextType | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const products = useMemo(() => getCatalogProductsFromJson(), [])

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.categoria))
    return ['Todos', ...Array.from(cats).sort()]
  }, [products])

  const value = useMemo(
    () => ({ products, categories, getProductById }),
    [products, categories, getProductById],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
