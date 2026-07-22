import { useCallback, useState } from 'react'
import { fetchCep, formatCep } from '../services/cepService'
import { EMPTY_LOCATION, type UserLocationFields } from '../types/auth'

const GEO_DENIED_MESSAGE =
  'Sem problemas. Você pode informar seu CEP manualmente.'
const GEO_UNAVAILABLE_MESSAGE =
  'Sem problemas. Você pode informar seu CEP manualmente.'
const GEO_SUCCESS_MESSAGE = 'Localização capturada com sucesso'

export function useLocationForm(initialValues: UserLocationFields = EMPTY_LOCATION) {
  const [values, setValues] = useState<UserLocationFields>(initialValues)
  const [geoMessage, setGeoMessage] = useState('')
  const [cepMessage, setCepMessage] = useState('')
  const [capturingGeo, setCapturingGeo] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)

  const updateField = useCallback(
    <K extends keyof UserLocationFields>(field: K, value: UserLocationFields[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const setLocationValues = useCallback((next: UserLocationFields) => {
    setValues(next)
  }, [])

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoMessage(GEO_UNAVAILABLE_MESSAGE)
      return
    }

    setCapturingGeo(true)
    setGeoMessage('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValues((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        setGeoMessage(GEO_SUCCESS_MESSAGE)
        setCapturingGeo(false)
      },
      () => {
        setGeoMessage(GEO_DENIED_MESSAGE)
        setCapturingGeo(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [])

  const handleCepChange = useCallback(async (rawCep: string) => {
    const formatted = formatCep(rawCep)
    setValues((prev) => ({ ...prev, cep: formatted }))
    setCepMessage('')

    const digits = formatted.replace(/\D/g, '')
    if (digits.length !== 8) return

    setLoadingCep(true)

    try {
      const data = await fetchCep(digits)

      if (!data) {
        setCepMessage('CEP não encontrado. Verifique e tente novamente.')
        return
      }

      setValues((prev) => ({
        ...prev,
        cep: formatted,
        estado: data.uf || prev.estado,
        cidade: data.localidade || prev.cidade,
        bairro: data.bairro || prev.bairro,
        endereco: data.logradouro || prev.endereco,
      }))
      setCepMessage('Endereço preenchido automaticamente')
    } catch {
      setCepMessage('Não foi possível buscar o CEP agora. Tente novamente em instantes.')
    } finally {
      setLoadingCep(false)
    }
  }, [])

  const hasCoordinates = values.latitude != null && values.longitude != null

  return {
    values,
    updateField,
    setLocationValues,
    geoMessage,
    cepMessage,
    capturingGeo,
    loadingCep,
    hasCoordinates,
    handleUseCurrentLocation,
    handleCepChange,
  }
}

export function validateLocationFields(values: UserLocationFields): string | null {
  if (!values.cep.trim()) return 'CEP é obrigatório.'
  if (values.cep.replace(/\D/g, '').length !== 8) return 'Informe um CEP válido.'
  if (!values.estado.trim()) return 'Estado é obrigatório.'
  if (!values.cidade.trim()) return 'Cidade é obrigatória.'
  if (!values.bairro.trim()) return 'Bairro é obrigatório.'
  if (!values.endereco.trim()) return 'Endereço é obrigatório.'
  if (!values.numero.trim()) return 'Número é obrigatório.'
  return null
}

export const LOCATION_EMPTY_MESSAGE =
  'Informe sua localização para encontrarmos a loja Ecoville mais próxima.'

export function notifyLocationUpdated() {
  window.dispatchEvent(new CustomEvent('ecoville:location-updated'))
}
