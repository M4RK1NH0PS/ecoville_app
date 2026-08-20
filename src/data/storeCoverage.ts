import type { Profile } from '../types/auth'

export type CoverageStore = {
  storeName: string
  cities?: string[]
  neighborhoods?: string[]
  state: string
  whatsapp: string
  phone: string
  address: string
  mapsQuery: string
}

export const DEFAULT_ECOVILLE_WHATSAPP = '5511965862948'

export const NO_COVERAGE_MESSAGE =
  'Ainda não encontramos uma unidade definida para sua região. Fale com a Ecoville pelo WhatsApp para direcionarmos seu atendimento.'

// Este fallback só deve ser usado com dados reais e confirmados de cada loja.
// Cadastre as lojas de verdade na tabela `stores` do Supabase (com latitude/longitude)
// para que a busca por CEP calcule a distância real — veja findNearestStore em
// src/services/storeService.ts. Enquanto não houver lojas cadastradas no banco,
// deixe esta lista vazia: mostrar um endereço ou WhatsApp inventado para o cliente
// é pior do que dizer "não encontramos, fale com o atendimento".
export const storeCoverage: CoverageStore[] = []

export function normalizeLocationText(text: string | null | undefined): string {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchesState(store: CoverageStore, profileState: string): boolean {
  return normalizeLocationText(store.state) === profileState
}

function matchesCity(store: CoverageStore, profileCity: string): boolean {
  if (!profileCity || !store.cities?.length) return false
  return store.cities.some((city) => normalizeLocationText(city) === profileCity)
}

function matchesNeighborhood(store: CoverageStore, profileNeighborhood: string): boolean {
  if (!profileNeighborhood || !store.neighborhoods?.length) return false
  return store.neighborhoods.some(
    (neighborhood) => normalizeLocationText(neighborhood) === profileNeighborhood,
  )
}

export function findStoreByProfileLocation(profile: Profile | null): CoverageStore | null {
  if (!profile) return null

  const profileState = normalizeLocationText(profile.estado)
  const profileCity = normalizeLocationText(profile.cidade)
  const profileNeighborhood = normalizeLocationText(profile.bairro)

  if (!profileState) return null

  for (const store of storeCoverage) {
    if (!matchesState(store, profileState)) continue
    if (!profileNeighborhood || !matchesNeighborhood(store, profileNeighborhood)) continue

    const hasCityConstraint = Boolean(store.cities?.length)
    if (hasCityConstraint && profileCity && !matchesCity(store, profileCity)) continue

    return store
  }

  if (profileCity) {
    for (const store of storeCoverage) {
      if (!matchesState(store, profileState)) continue
      if (matchesCity(store, profileCity)) return store
    }
  }

  for (const store of storeCoverage) {
    if (!matchesState(store, profileState)) continue
    if (!store.cities?.length && !store.neighborhoods?.length) return store
  }

  return null
}
