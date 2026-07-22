export type UserLocationFields = {
  pais: string
  estado: string
  cidade: string
  bairro: string
  cep: string
  endereco: string
  numero: string
  complemento?: string
}

export type RegisterFormValues = {
  nome: string
  email: string
  telefone: string
  password: string
  confirmPassword: string
} & UserLocationFields

export type UserAuthMetadata = {
  nome: string
  telefone?: string
  tipo_cliente: 'pessoa_fisica'
} & UserLocationFields

export const EMPTY_LOCATION: UserLocationFields = {
  pais: 'Brasil',
  estado: '',
  cidade: '',
  bairro: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
}

export type Profile = {
  id: string
  nome: string | null
  telefone: string | null
  tipo_cliente: string | null
  pais: string | null
  estado: string | null
  cidade: string | null
  bairro: string | null
  cep: string | null
  endereco: string | null
  numero: string | null
  complemento: string | null
  created_at?: string
  updated_at?: string
}

export function formatProfileLocation(profile: Profile | null): string {
  if (!profile) return 'Localização não informada'

  const cidade = profile.cidade?.trim()
  const estado = profile.estado?.trim()
  const bairro = profile.bairro?.trim()

  if (cidade && estado && bairro) {
    return `${bairro} - ${cidade}, ${estado}`
  }

  if (cidade && estado) {
    return `${cidade}, ${estado}`
  }

  return 'Localização não informada'
}

export function getNearestStoreLabel(profile: Profile | null): string {
  const hasLocation = Boolean(profile?.cidade?.trim() && profile?.estado?.trim())

  if (!hasLocation) {
    return 'Cadastre sua localização para encontrar a loja mais próxima'
  }

  return 'Loja ainda não definida'
}

export function getStoreWhatsAppLabel(): string {
  return 'WhatsApp não disponível'
}

