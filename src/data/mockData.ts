import type {
  Product,
  ReorderItem,
  Offer,
  Recommendation,
  UserProfile,
  ChatMessage,
} from '../types'
import { defaultProducts } from './defaultProducts'
import { getCatalogProductsFromJson } from './catalogLoader'

export const products = defaultProducts

export const categories = [
  'Todos',
  'Cozinha',
  'Banheiro',
  'Lavanderia',
  'Pisos',
  'Vidros',
  'Multiuso',
  'Pet',
  'Aromas',
  'Piscina',
  'Profissional',
] as const

export const ambientes = [
  'Banheiro',
  'Cozinha',
  'Lavanderia',
  'Piscina',
  'Sala',
  'Quintal',
  'Empresa',
  'Restaurante',
  'Hotel',
  'Clínica',
] as const

export const superficies = [
  'Porcelanato',
  'Cerâmica',
  'Vidro',
  'Inox',
  'Tecido',
  'Alumínio',
  'Plástico',
  'Pedra',
  'Piso antiderrapante',
] as const

export const tiposSujeira = [
  'Gordura',
  'Mofo',
  'Limo',
  'Crosta',
  'Odor',
  'Urina de pet',
  'Encardido',
  'Calcificação',
  'Poeira',
  'Graxa',
] as const

export const niveisLimpeza = ['Leve', 'Média', 'Pesada'] as const

const recommendationMap: Record<string, { principal: string; alternativo: string; economico: string }> = {
  Gordura: { principal: '2', alternativo: '13', economico: '1' },
  Mofo: { principal: '15', alternativo: '9', economico: '10' },
  Limo: { principal: '9', alternativo: '4', economico: '10' },
  Crosta: { principal: '13', alternativo: '2', economico: '1' },
  Odor: { principal: '8', alternativo: '6', economico: '4' },
  'Urina de pet': { principal: '6', alternativo: '4', economico: '10' },
  Encardido: { principal: '1', alternativo: '7', economico: '4' },
  Calcificação: { principal: '9', alternativo: '15', economico: '10' },
  Poeira: { principal: '1', alternativo: '7', economico: '5' },
  Graxa: { principal: '13', alternativo: '2', economico: '1' },
}

export function getRecommendation(
  sujeira: string,
  nivel: string,
  ambiente: string,
): Recommendation {
  const mapping = recommendationMap[sujeira] ?? { principal: '1', alternativo: '2', economico: '4' }
  const principal = products.find((p) => p.id === mapping.principal)!
  const alternativo = products.find((p) => p.id === mapping.alternativo)!
  const economico = products.find((p) => p.id === mapping.economico)!

  const tempoMap: Record<string, string> = {
    Leve: '2 a 5 minutos',
    Média: '5 a 10 minutos',
    Pesada: '10 a 20 minutos',
  }

  return {
    principal,
    alternativo,
    economico,
    comoUsar: `Para ${sujeira.toLowerCase()} em ${ambiente.toLowerCase()} com nível ${nivel.toLowerCase()}, aplique ${principal.nome} conforme instruções do rótulo. Deixe agir e enxágue se necessário.`,
    tempoAcao: tempoMap[nivel] ?? '5 a 10 minutos',
    cuidados: principal.cuidados,
  }
}

export const reorderItems: ReorderItem[] = [
  {
    product: products[3],
    ultimaCompra: '15/06/2026',
    previsaoTermino: '18/08/2026',
    quantidadeComprada: '5L',
  },
  {
    product: products[0],
    ultimaCompra: '01/07/2026',
    previsaoTermino: '25/07/2026',
    quantidadeComprada: '500ml',
  },
  {
    product: products[2],
    ultimaCompra: '20/06/2026',
    previsaoTermino: '05/08/2026',
    quantidadeComprada: '2L',
  },
  {
    product: products[10],
    ultimaCompra: '10/06/2026',
    previsaoTermino: '12/08/2026',
    quantidadeComprada: '2L',
  },
]

export const offers: Offer[] = [
  { id: 'o1', product: products[7], desconto: 20 },
  { id: 'o2', product: products[14], desconto: 21 },
  { id: 'o3', product: products[1], desconto: 15 },
  { id: 'o4', product: products[11], desconto: 10 },
]

export const userProfile: UserProfile = {
  nome: 'Marcos Silva',
  tipoCliente: 'Pessoa física',
  cidade: 'São Paulo, SP',
  lojaMaisProxima: 'Ecoville Lapa',
  whatsappLoja: '(11) 99999-8888',
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Tenho um restaurante e preciso remover gordura pesada da cozinha.',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Entendi. Para gordura pesada em cozinha, recomendo um desengordurante alcalino profissional. Antes de aplicar, confirme se a superfície é inox, piso ou alumínio.',
  },
]

export const homeKitProducts = [
  products[2],
  products[10],
  products[3],
  products[0],
  products[8],
  products[4],
  products[7],
]

export const businessKits = [
  {
    nome: 'Kit Restaurante',
    produtos: [products[12], products[13], products[4], products[3], products[7]],
    custoMensal: 890.0,
  },
  {
    nome: 'Kit Escritório',
    produtos: [products[0], products[4], products[3], products[7], products[6]],
    custoMensal: 420.0,
  },
  {
    nome: 'Kit Hotel',
    produtos: [products[13], products[14], products[4], products[3], products[7], products[8]],
    custoMensal: 1450.0,
  },
  {
    nome: 'Kit Clínica',
    produtos: [products[13], products[14], products[4], products[3], products[10]],
    custoMensal: 980.0,
  },
]

export const runningLowProducts = [products[0], products[3], products[10]]

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function getProductById(id: string): Product | undefined {
  return getCatalogProductsFromJson().find((p) => p.id === id)
}

export function getComplementaryProducts(productId: string): Product[] {
  const catalog = getCatalogProductsFromJson()
  const product = catalog.find((p) => p.id === productId)
  if (!product) return []
  return catalog
    .filter((p) => p.id !== productId && p.categoria === product.categoria)
    .slice(0, 3)
}

export const WHATSAPP_MOCK_URL = 'https://wa.me/5511999998888?text=Olá! Gostaria de fazer um pedido Ecoville SmartClean'

export function openWhatsApp(message?: string) {
  const url = message
    ? `https://wa.me/5511999998888?text=${encodeURIComponent(message)}`
    : WHATSAPP_MOCK_URL
  window.open(url, '_blank')
}
