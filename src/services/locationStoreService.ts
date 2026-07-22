import { supabase } from '../lib/supabaseClient'

export type PlacesStoreResult = {
  placeId: string
  name: string
  address: string
  latitude: number
  longitude: number
  phone: string | null
  rating: number | null
  mapsUrl: string | null
  distanceKm: number
}

export type FindNearestEcovilleParams = {
  latitude?: number | null
  longitude?: number | null
  city?: string | null
  state?: string | null
  neighborhood?: string | null
  address?: string | null
}

export type FindNearestEcovilleResponse = {
  store: PlacesStoreResult | null
  message?: string
}

export async function findNearestEcovilleByCoordinates(
  params: FindNearestEcovilleParams,
): Promise<FindNearestEcovilleResponse> {
  const { data, error } = await supabase.functions.invoke('find-nearest-ecoville', {
    body: {
      latitude: params.latitude ?? null,
      longitude: params.longitude ?? null,
      city: params.city ?? null,
      state: params.state ?? null,
      neighborhood: params.neighborhood ?? null,
      address: params.address ?? null,
    },
  })

  if (error) {
    throw error
  }

  return (data ?? { store: null }) as FindNearestEcovilleResponse
}
