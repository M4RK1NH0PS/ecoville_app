export type Store = {
  id: string
  nome: string
  estado: string | null
  cidade: string | null
  bairro: string | null
  endereco: string | null
  numero: string | null
  complemento: string | null
  cep: string | null
  telefone: string | null
  whatsapp: string | null
  latitude: number | null
  longitude: number | null
  horario_funcionamento: string | null
  ativo: boolean
}

export type StoreWithDistance = Store & {
  distanceKm?: number
}

export type DisplayStore = {
  id?: string
  placeId?: string
  nome: string
  endereco: string
  cidade?: string | null
  estado?: string | null
  telefone?: string | null
  whatsapp: string
  mapsQuery: string
  mapsUrl?: string | null
  rating?: number | null
  horario_funcionamento?: string | null
  distanceKm?: number
  source: 'coverage' | 'database' | 'places'
}

export const NO_STORE_MESSAGE =
  'Não encontramos uma unidade Ecoville próxima. Você pode falar com o atendimento para direcionarmos seu pedido.'
