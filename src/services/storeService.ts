import {
  findStoreByProfileLocation,
  type CoverageStore,
} from '../data/storeCoverage'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/auth'
import type { DisplayStore, Store } from '../types/store'

function normalize(text: string | null | undefined): string {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

function coverageToDisplayStore(store: CoverageStore): DisplayStore {
  return {
    nome: store.storeName,
    endereco: store.address,
    telefone: store.phone,
    whatsapp: store.whatsapp,
    mapsQuery: store.mapsQuery,
    estado: store.state,
    source: 'coverage',
  }
}

function databaseToDisplayStore(store: Store, distanceKm?: number): DisplayStore {
  const endereco = [
    store.endereco,
    store.numero,
    store.complemento,
    store.bairro,
    store.cidade,
    store.estado,
    store.cep,
  ]
    .filter((part) => part?.trim())
    .join(', ')

  return {
    id: store.id,
    nome: store.nome,
    endereco,
    cidade: store.cidade,
    estado: store.estado,
    telefone: store.telefone,
    whatsapp: store.whatsapp ?? '',
    mapsQuery: endereco || store.nome,
    horario_funcionamento: store.horario_funcionamento,
    distanceKm,
    source: 'database',
  }
}

export async function getActiveStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('ativo', true)

  if (error) {
    throw error
  }

  return (data ?? []) as Store[]
}

async function findStoreFromDatabase(profile: Profile): Promise<DisplayStore | null> {
  const stores = await getActiveStores()
  if (!stores.length) return null

  const profileLat = profile.latitude != null ? Number(profile.latitude) : null
  const profileLng = profile.longitude != null ? Number(profile.longitude) : null

  if (
    profileLat != null &&
    profileLng != null &&
    !Number.isNaN(profileLat) &&
    !Number.isNaN(profileLng)
  ) {
    const storesWithDistance = stores
      .filter(
        (store) =>
          store.latitude != null &&
          store.longitude != null &&
          !Number.isNaN(Number(store.latitude)) &&
          !Number.isNaN(Number(store.longitude)),
      )
      .map((store) => ({
        store,
        distanceKm: calculateDistanceKm(
          profileLat,
          profileLng,
          Number(store.latitude),
          Number(store.longitude),
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)

    const nearest = storesWithDistance[0]
    if (nearest) {
      return databaseToDisplayStore(nearest.store, nearest.distanceKm)
    }
  }

  const fallbackStore = stores.find(
    (store) =>
      normalize(store.estado) === normalize(profile.estado) &&
      normalize(store.cidade) === normalize(profile.cidade),
  )

  return fallbackStore ? databaseToDisplayStore(fallbackStore) : null
}

export async function findNearestStore(
  profile: Profile | null,
): Promise<DisplayStore | null> {
  if (!profile) return null

  const coverageStore = findStoreByProfileLocation(profile)
  if (coverageStore) {
    return coverageToDisplayStore(coverageStore)
  }

  try {
    const databaseStore = await findStoreFromDatabase(profile)
    if (databaseStore) return databaseStore
  } catch {
    // MVP: ignora falhas da tabela stores e usa apenas cobertura regional
  }

  return null
}

export { findStoreByProfileLocation } from '../data/storeCoverage'
