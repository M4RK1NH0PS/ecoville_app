export type CepData = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  latitude?: number | null
  longitude?: number | null
  erro?: boolean
}

type BrasilApiCepResponse = {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  location?: {
    coordinates?: {
      longitude?: string | number
      latitude?: string | number
    }
  }
}

async function fetchCepFromBrasilApi(digits: string): Promise<CepData | null> {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`)
  if (!response.ok) return null

  const data = (await response.json()) as BrasilApiCepResponse
  const rawLat = data.location?.coordinates?.latitude
  const rawLng = data.location?.coordinates?.longitude
  const latitude = rawLat !== undefined && rawLat !== '' ? Number(rawLat) : null
  const longitude = rawLng !== undefined && rawLng !== '' ? Number(rawLng) : null

  return {
    cep: data.cep,
    logradouro: data.street || '',
    complemento: '',
    bairro: data.neighborhood || '',
    localidade: data.city || '',
    uf: data.state || '',
    latitude: latitude != null && !Number.isNaN(latitude) ? latitude : null,
    longitude: longitude != null && !Number.isNaN(longitude) ? longitude : null,
  }
}

async function fetchCepFromViaCep(digits: string): Promise<CepData | null> {
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)

  if (!response.ok) {
    throw new Error('CEP lookup failed')
  }

  const data = (await response.json()) as CepData

  if (data.erro) {
    return null
  }

  return { ...data, latitude: null, longitude: null }
}

export async function fetchCep(cep: string): Promise<CepData | null> {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) return null

  try {
    const brasilApiResult = await fetchCepFromBrasilApi(digits)
    if (brasilApiResult) return brasilApiResult
  } catch {
    // BrasilAPI indisponível, tenta o fallback abaixo
  }

  return fetchCepFromViaCep(digits)
}

export type GeocodedAddress = {
  latitude: number
  longitude: number
}

export async function geocodeAddressFree(query: string): Promise<GeocodedAddress | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(trimmed)}`

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'pt-BR' },
  })

  if (!response.ok) return null

  const results = (await response.json()) as Array<{ lat: string; lon: string }>
  const first = results[0]
  if (!first) return null

  const latitude = Number(first.lat)
  const longitude = Number(first.lon)

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null

  return { latitude, longitude }
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}
