export type UserLocationFields = {
  estado: string
  cidade: string
  bairro: string
  cep: string
  endereco: string
  numero: string
  complemento?: string
  latitude?: number | null
  longitude?: number | null
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
  estado: '',
  cidade: '',
  bairro: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  latitude: null,
  longitude: null,
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
  latitude: number | null
  longitude: number | null
  loja_preferida_id: string | null
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
