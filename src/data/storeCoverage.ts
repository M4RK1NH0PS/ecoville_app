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

export const storeCoverage: CoverageStore[] = [
  {
    storeName: 'Ecoville Barueri',
    cities: ['Barueri', 'Jandira', 'Itapevi', 'Santana de Parnaíba', 'Alphaville'],
    state: 'SP',
    whatsapp: '5511965862948',
    phone: '(11) 96586-2948',
    address: 'Endereço da Ecoville Barueri aqui',
    mapsQuery: 'Ecoville Barueri',
  },
  {
    storeName: 'Ecoville Lapa',
    cities: ['São Paulo'],
    neighborhoods: ['Lapa', 'Vila Leopoldina', 'Perdizes', 'Pompéia'],
    state: 'SP',
    whatsapp: '5511999998888',
    phone: '(11) 99999-8888',
    address: 'Endereço da Ecoville Lapa aqui',
    mapsQuery: 'Ecoville Lapa',
  },
]

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
