import { Loader2, MapPin, Navigation } from 'lucide-react'
import Input from './Input'
import SecondaryButton from './SecondaryButton'
import type { UserLocationFields } from '../types/auth'

type LocationFormSectionProps = {
  values: UserLocationFields
  geoMessage: string
  cepMessage: string
  capturingGeo: boolean
  loadingCep: boolean
  hasCoordinates: boolean
  onUseCurrentLocation: () => void
  onCepChange: (cep: string) => void
  onFieldChange: <K extends keyof UserLocationFields>(
    field: K,
    value: UserLocationFields[K],
  ) => void
  title?: string
  description?: string
}

export default function LocationFormSection({
  values,
  geoMessage,
  cepMessage,
  capturingGeo,
  loadingCep,
  hasCoordinates,
  onUseCurrentLocation,
  onCepChange,
  onFieldChange,
  title = 'Localização para atendimento',
  description = 'Usamos sua localização para encontrar a loja Ecoville mais próxima de você.',
}: LocationFormSectionProps) {
  const addressAutoFilled = Boolean(
    values.estado.trim() && values.cidade.trim() && values.endereco.trim(),
  )

  return (
    <section className="space-y-4 border-t border-gray-100 pt-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal/10">
          <MapPin size={18} className="text-royal" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-dark">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        </div>
      </div>

      <SecondaryButton
        type="button"
        fullWidth
        disabled={capturingGeo}
        onClick={onUseCurrentLocation}
      >
        {capturingGeo ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Obtendo localização...
          </>
        ) : (
          <>
            <Navigation size={18} />
            Usar minha localização atual
          </>
        )}
      </SecondaryButton>

      {geoMessage && (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            hasCoordinates ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {geoMessage}
        </p>
      )}

      <Input
        label="CEP"
        placeholder="00000-000"
        inputMode="numeric"
        value={values.cep}
        onChange={(e) => onCepChange(e.target.value)}
        autoComplete="postal-code"
      />

      {loadingCep && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 size={16} className="animate-spin text-royal" />
          Buscando endereço pelo CEP...
        </div>
      )}

      {cepMessage && !loadingCep && (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            addressAutoFilled ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {cepMessage}
        </p>
      )}

      {(addressAutoFilled || values.estado || values.cidade) && (
        <div className="space-y-4 rounded-xl bg-bg p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Endereço encontrado
          </p>
          <Input
            label="Estado"
            value={values.estado}
            readOnly
            className="bg-white"
          />
          <Input
            label="Cidade"
            value={values.cidade}
            readOnly
            className="bg-white"
          />
          <Input
            label="Bairro"
            value={values.bairro}
            onChange={(e) => onFieldChange('bairro', e.target.value)}
          />
          <Input
            label="Endereço"
            value={values.endereco}
            onChange={(e) => onFieldChange('endereco', e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Número"
              placeholder="123"
              value={values.numero}
              onChange={(e) => onFieldChange('numero', e.target.value)}
            />
            <Input
              label="Complemento"
              placeholder="Apto, bloco... (opcional)"
              value={values.complemento ?? ''}
              onChange={(e) => onFieldChange('complemento', e.target.value)}
            />
          </div>
        </div>
      )}
    </section>
  )
}
