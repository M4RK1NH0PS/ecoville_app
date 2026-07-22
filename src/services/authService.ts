import { supabase } from '../lib/supabaseClient'
import type { UserLocationFields } from '../types/auth'

export type RegisterPayload = {
  nome: string
  email: string
  telefone?: string
  password: string
} & UserLocationFields

export type LoginPayload = {
  email: string
  password: string
}

export async function registerUser({
  nome,
  email,
  telefone,
  password,
  cep,
  estado,
  cidade,
  bairro,
  endereco,
  numero,
  complemento,
  latitude,
  longitude,
}: RegisterPayload) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome,
        telefone,
        tipo_cliente: 'pessoa_fisica',
        cep,
        estado,
        cidade,
        bairro,
        endereco,
        numero,
        complemento: complemento || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
    },
  })

  if (error) throw error
  return data
}

export async function loginUser({ email, password }: LoginPayload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) throw error
}

export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) throw error
  return session
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  return user
}
