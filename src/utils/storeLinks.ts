import { DEFAULT_ECOVILLE_WHATSAPP } from '../data/storeCoverage'
import type { DisplayStore } from '../types/store'

const DEFAULT_WHATSAPP_MESSAGE =
  'Olá, vim pelo app Ecoville SmartClean e gostaria de atendimento.'

export function formatDisplayStoreCityState(store: DisplayStore): string {
  return [store.cidade, store.estado].filter((part) => part?.trim()).join(', ')
}

export function formatDistanceKm(distanceKm: number): string {
  return `aprox. ${distanceKm.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km de você`
}

export function buildWhatsAppUrl(
  whatsapp: string,
  message = DEFAULT_WHATSAPP_MESSAGE,
): string {
  const digits = whatsapp.replace(/\D/g, '') || DEFAULT_ECOVILLE_WHATSAPP
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function buildMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function openStoreWhatsApp(whatsapp: string): void {
  window.open(buildWhatsAppUrl(whatsapp), '_blank', 'noopener,noreferrer')
}

export function openSupportWhatsApp(): void {
  openStoreWhatsApp(DEFAULT_ECOVILLE_WHATSAPP)
}

export function openStoreDirections(store: DisplayStore): void {
  const url = store.mapsUrl?.trim() || buildMapsUrl(store.mapsQuery || store.endereco)
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openStoreContact(store: DisplayStore): void {
  const whatsapp = store.whatsapp?.trim() || store.telefone?.replace(/\D/g, '') || DEFAULT_ECOVILLE_WHATSAPP
  openStoreWhatsApp(whatsapp)
}
