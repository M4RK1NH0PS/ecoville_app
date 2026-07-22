import type { Store } from '../types/store'

const DEFAULT_WHATSAPP_MESSAGE =
  'Olá, vim pelo app Ecoville SmartClean e gostaria de atendimento.'

export function formatStoreFullAddress(store: Store): string {
  return [
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
}

export function formatStoreCityState(store: Store): string {
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
  const digits = whatsapp.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function buildMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export function openStoreWhatsApp(whatsapp: string): void {
  window.open(buildWhatsAppUrl(whatsapp), '_blank', 'noopener,noreferrer')
}

export function openStoreDirections(store: Store): void {
  const address = formatStoreFullAddress(store)
  window.open(buildMapsUrl(address), '_blank', 'noopener,noreferrer')
}
