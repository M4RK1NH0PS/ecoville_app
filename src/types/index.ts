export type ProductTag =
  | 'Mais vendido'
  | 'Novo'
  | 'Promoção'
  | 'Essencial'
  | 'Pet'
  | 'Baby'
  | 'Importado'

export type ProductCategory =
  | 'Cozinha'
  | 'Banheiro'
  | 'Lavanderia'
  | 'Pisos'
  | 'Aromas'
  | 'Piscina'
  | 'Profissional'
  | 'Vidros'
  | 'Multiuso'
  | 'Pet'
  | 'Desinfetantes'
  | 'Detergentes'
  | 'Importado'
  | 'Outros'

export interface Product {
  id: string
  nome: string
  categoria: ProductCategory
  preco: number
  precoAntigo?: number
  descricao: string
  aplicacoes: string[]
  superficies?: string[]
  sujeiras?: string[]
  palavrasChave?: string[]
  modoUso: string
  diluicao: string
  rendimento: string
  cuidados: string[]
  tag: ProductTag
  imagem: string
  cor: string
  origem?: string
}

export interface SearchResult extends Product {
  score: number
  motivo: string
  termosCorrespondentes: string[]
}

export interface CartItem {
  product: Product
  quantidade: number
}

export interface ReorderItem {
  product: Product
  ultimaCompra: string
  previsaoTermino: string
  quantidadeComprada: string
}

export interface Offer {
  id: string
  product: Product
  desconto: number
}

export interface Recommendation {
  principal: Product
  alternativo: Product
  economico: Product
  comoUsar: string
  tempoAcao: string
  cuidados: string[]
}

export interface UserProfile {
  nome: string
  tipoCliente: 'Pessoa física' | 'Empresa'
  cidade: string
  lojaMaisProxima: string
  whatsappLoja: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}
