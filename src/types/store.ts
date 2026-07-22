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
  nome: string
  endereco: string
  cidade?: string | null
  estado?: string | null
  telefone?: string | null
  whatsapp: string
  mapsQuery: string
  horario_funcionamento?: string | null
  distanceKm?: number
  source: 'coverage' | 'database'
}
