import { Loader2, MapPin, MessageCircle, Navigation, Store } from 'lucide-react'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import {
  DEFAULT_ECOVILLE_WHATSAPP,
  NO_COVERAGE_MESSAGE,
} from '../data/storeCoverage'
import type { DisplayStore } from '../types/store'
import {
  formatDistanceKm,
  formatDisplayStoreCityState,
  openStoreDirections,
  openStoreWhatsApp,
} from '../utils/storeLinks'

type NearestStoreCardProps = {
  store: DisplayStore | null
  loading?: boolean
  compact?: boolean
  emptyMessage?: string
  onUpdateLocation?: () => void
}

export default function NearestStoreCard({
  store,
  loading = false,
  compact = false,
  emptyMessage,
  onUpdateLocation,
}: NearestStoreCardProps) {
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-2xl bg-white shadow-sm ${
          compact ? 'px-4 py-5' : 'py-8'
        }`}
      >
        <Loader2 size={20} className="animate-spin text-royal" />
        <span className="text-sm font-medium text-muted">Buscando loja mais próxima...</span>
      </div>
    )
  }

  if (!store) {
    const message = emptyMessage ?? NO_COVERAGE_MESSAGE

    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
            <Store size={18} className="text-royal" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-dark">
              {compact ? 'Sua loja Ecoville' : 'Loja mais próxima'}
            </p>
            <p className="mt-1 text-sm text-muted">{message}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <PrimaryButton
            fullWidth
            size="sm"
            onClick={() => openStoreWhatsApp(DEFAULT_ECOVILLE_WHATSAPP)}
          >
            <MessageCircle size={16} />
            Falar no WhatsApp
          </PrimaryButton>

          {onUpdateLocation && (
            <SecondaryButton fullWidth size="sm" onClick={onUpdateLocation}>
              <Navigation size={16} />
              Atualizar localização
            </SecondaryButton>
          )}
        </div>
      </div>
    )
  }

  const cityState = formatDisplayStoreCityState(store)
  const whatsapp = store.whatsapp?.trim()
  const phone = store.telefone?.trim()

  if (compact) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
            <Store size={18} className="text-royal" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-royal">
              Sua loja Ecoville
            </p>
            <p className="mt-1 text-base font-bold text-dark">{store.nome}</p>
            {cityState && <p className="mt-1 text-sm text-muted">{cityState}</p>}
            {store.distanceKm != null && (
              <p className="mt-1 text-xs font-medium text-royal">
                {formatDistanceKm(store.distanceKm)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <PrimaryButton
            fullWidth
            size="sm"
            disabled={!whatsapp}
            onClick={() => whatsapp && openStoreWhatsApp(whatsapp)}
          >
            <MessageCircle size={16} />
            WhatsApp
          </PrimaryButton>
          <SecondaryButton fullWidth size="sm" onClick={() => openStoreDirections(store)}>
            <Navigation size={16} />
            Como chegar
          </SecondaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
          <Store size={18} className="text-royal" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Loja mais próxima</p>
          <p className="text-base font-bold text-dark">{store.nome}</p>
          {store.distanceKm != null && (
            <p className="mt-1 text-xs font-semibold text-royal">
              {formatDistanceKm(store.distanceKm)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-bg px-3 py-3">
        <InfoLine icon={MapPin} label="Endereço" value={store.endereco || 'Endereço não informado'} />
        {cityState && <InfoLine label="Cidade/Estado" value={cityState} />}
        {phone && <InfoLine label="Telefone" value={phone} />}
        {store.horario_funcionamento && (
          <InfoLine label="Horário" value={store.horario_funcionamento} />
        )}
        {whatsapp && <InfoLine label="WhatsApp" value={whatsapp} />}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <PrimaryButton
          fullWidth
          disabled={!whatsapp}
          onClick={() => whatsapp && openStoreWhatsApp(whatsapp)}
        >
          <MessageCircle size={18} />
          Falar no WhatsApp
        </PrimaryButton>
        <SecondaryButton fullWidth onClick={() => openStoreDirections(store)}>
          <Navigation size={18} />
          Como chegar
        </SecondaryButton>
      </div>
    </div>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon size={16} className="mt-0.5 shrink-0 text-royal" />}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-sm font-medium text-dark">{value}</p>
      </div>
    </div>
  )
}
