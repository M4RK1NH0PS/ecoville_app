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
