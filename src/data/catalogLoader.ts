import type { Product, ProductCategory, ProductTag } from '../types'
import catalogProductsJson from './catalogProducts.json'
import { defaultProducts } from './defaultProducts'

export interface CatalogJsonProduct {
  id: string
  nome: string
  categoria: string
  preco: number
  descricao: string
  aplicacoes: string[]
  superficies: string[]
  sujeiras: string[]
  palavrasChave: string[]
  tag: string
  origem: string
  imagem: string | null
}

const IMPORT_COLORS = ['#0057D9', '#22C55E', '#FFD400', '#0EA5E9', '#8B5CF6', '#F97316']

const CATEGORY_MAP: Record<string, ProductCategory> = {
  Vidros: 'Vidros',
  Cozinha: 'Cozinha',
  Lavanderia: 'Lavanderia',
  Banheiro: 'Banheiro',
  Pisos: 'Pisos',
  Pet: 'Pet',
  Aromas: 'Aromas',
  Piscina: 'Piscina',
  Multiuso: 'Multiuso',
  Outros: 'Importado',
  Importado: 'Importado',
  Desinfetantes: 'Desinfetantes',
  Detergentes: 'Detergentes',
}

function normalizeCategory(categoria: string): ProductCategory {
  return CATEGORY_MAP[categoria] ?? 'Importado'
}

export function normalizeCatalogProduct(raw: CatalogJsonProduct, index: number): Product {
  return {
    id: raw.id,
    nome: raw.nome,
    categoria: normalizeCategory(raw.categoria),
    preco: raw.preco,
    descricao: raw.descricao,
    aplicacoes: raw.aplicacoes ?? [],
    superficies: raw.superficies ?? [],
    sujeiras: raw.sujeiras ?? [],
    palavrasChave: raw.palavrasChave ?? [],
    tag: (raw.tag as ProductTag) || 'Importado',
    origem: raw.origem,
    imagem: raw.imagem ?? 'importado',
    cor: IMPORT_COLORS[index % IMPORT_COLORS.length],
    modoUso: 'Consulte o rótulo do produto.',
    diluicao: 'Conforme instruções do fabricante.',
    rendimento: 'A consultar.',
    cuidados: ['Use conforme orientação do fabricante.'],
  }
}

export function getCatalogProductsFromJson(): Product[] {
  const raw = catalogProductsJson as CatalogJsonProduct[]

  if (!raw || raw.length === 0) {
    return defaultProducts
  }

  return raw.map(normalizeCatalogProduct)
}

export { catalogProductsJson as catalogProducts }
