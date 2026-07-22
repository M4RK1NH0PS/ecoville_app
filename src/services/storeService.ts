import {
  DEFAULT_ECOVILLE_WHATSAPP,
  findStoreByProfileLocation,
  type CoverageStore,
} from '../data/storeCoverage'
import { supabase } from '../lib/supabaseClient'
import {
  findNearestEcovilleByCoordinates,
  type PlacesStoreResult,
} from './locationStoreService'
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

function phoneToWhatsAppDigits(phone: string | null | undefined): string {
  const digits = String(phone ?? '').replace(/\D/g, '')
  return digits || DEFAULT_ECOVILLE_WHATSAPP
}

function placesToDisplayStore(store: PlacesStoreResult): DisplayStore {
  return {
    placeId: store.placeId,
    nome: store.name,
    endereco: store.address,
    telefone: store.phone,
    whatsapp: phoneToWhatsAppDigits(store.phone),
    mapsQuery: store.address,
    mapsUrl: store.mapsUrl,
    rating: store.rating,
    distanceKm: store.distanceKm,
    source: 'places',
  }
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
    whatsapp: phoneToWhatsAppDigits(store.whatsapp ?? store.telefone),
    mapsQuery: endereco || store.nome,
    horario_funcionamento: store.horario_funcionamento,
    distanceKm,
    source: 'database',
  }
}

function buildProfileAddress(profile: Profile): string {
  return [profile.endereco, profile.numero, profile.complemento, profile.bairro]
    .filter((part) => part?.trim())
    .join(', ')
}

async function findStoreFromPlaces(profile: Profile): Promise<DisplayStore | null> {
  const latitude = profile.latitude != null ? Number(profile.latitude) : null
  const longitude = profile.longitude != null ? Number(profile.longitude) : null

  const hasCoordinates =
    latitude != null &&
    longitude != null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)

  const hasAddressContext = Boolean(
    profile.cidade?.trim() ||
      profile.estado?.trim() ||
      profile.bairro?.trim() ||
      profile.endereco?.trim(),
  )

  if (!hasCoordinates && !hasAddressContext) {
    return null
  }

  const result = await findNearestEcovilleByCoordinates({
    latitude: hasCoordinates ? latitude : null,
    longitude: hasCoordinates ? longitude : null,
    city: profile.cidade,
    state: profile.estado,
    neighborhood: profile.bairro,
    address: buildProfileAddress(profile),
  })

  if (!result.store) {
    return null
  }

  return placesToDisplayStore(result.store)
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

async function findStoreFromCoverage(profile: Profile): Promise<DisplayStore | null> {
  const coverageStore = findStoreByProfileLocation(profile)
  return coverageStore ? coverageToDisplayStore(coverageStore) : null
}

export async function findNearestStore(
  profile: Profile | null,
): Promise<DisplayStore | null> {
  if (!profile) return null

  try {
    const placesStore = await findStoreFromPlaces(profile)
    if (placesStore) return placesStore
  } catch {
    // Fallback local abaixo
  }

  try {
    const coverageStore = await findStoreFromCoverage(profile)
    if (coverageStore) return coverageStore
  } catch {
    // Ignora falha do fallback local
  }

  try {
    const databaseStore = await findStoreFromDatabase(profile)
    if (databaseStore) return databaseStore
  } catch {
    // Ignora falha do fallback do banco
  }

  return null
}

export { findStoreByProfileLocation } from '../data/storeCoverage'
