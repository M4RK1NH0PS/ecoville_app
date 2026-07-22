import { supabase } from '../lib/supabaseClient'
import type { Profile, UserLocationFields } from '../types/auth'

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data as Profile
}

export type UpdateProfileLocationPayload = Pick<
  UserLocationFields,
  'cep' | 'estado' | 'cidade' | 'bairro' | 'endereco' | 'numero' | 'complemento' | 'latitude' | 'longitude'
>

export async function updateProfileLocation(
  userId: string,
  location: UpdateProfileLocationPayload,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      cep: location.cep.trim(),
      estado: location.estado.trim(),
      cidade: location.cidade.trim(),
      bairro: location.bairro.trim(),
      endereco: location.endereco.trim(),
      numero: location.numero.trim(),
      complemento: location.complemento?.trim() || null,
      latitude: location.latitude ?? null,
      longitude: location.longitude ?? null,
    })
    .eq('id', userId)

  if (error) {
    throw error
  }
}

export function profileToLocationFields(profile: Profile): UserLocationFields {
  return {
    estado: profile.estado ?? '',
    cidade: profile.cidade ?? '',
    bairro: profile.bairro ?? '',
    cep: profile.cep ?? '',
    endereco: profile.endereco ?? '',
    numero: profile.numero ?? '',
    complemento: profile.complemento ?? '',
    latitude: profile.latitude,
    longitude: profile.longitude,
  }
}
