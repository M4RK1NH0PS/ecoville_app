import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import LocationFormSection from '../components/LocationFormSection'
import PrimaryButton from '../components/PrimaryButton'
import { useAuth } from '../context/AuthContext'
import {
  notifyLocationUpdated,
  useLocationForm,
  validateLocationFields,
} from '../hooks/useLocationForm'
import {
  getProfile,
  profileToLocationFields,
  updateProfileLocation,
} from '../services/profileService'
import { getAuthErrorMessage } from '../utils/authErrors'

export default function UpdateLocationPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
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
  } = useLocationForm()

  useEffect(() => {
    if (!user?.id) {
      setLoadingProfile(false)
      return
    }

    let mounted = true

    const userId = user.id

    async function loadProfile() {
      setLoadingProfile(true)
      setError('')

      try {
        const profile = await getProfile(userId)
        if (mounted) {
          setLocationValues(profileToLocationFields(profile))
        }
      } catch (err) {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : 'Não foi possível carregar sua localização.'
          setError(getAuthErrorMessage(message))
        }
      } finally {
        if (mounted) {
          setLoadingProfile(false)
        }
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [user?.id, setLocationValues])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!user?.id) return

    const validationError = validateLocationFields(values)
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)

    try {
      await updateProfileLocation(user.id, {
        cep: values.cep.trim(),
        estado: values.estado.trim(),
        cidade: values.cidade.trim(),
        bairro: values.bairro.trim(),
        endereco: values.endereco.trim(),
        numero: values.numero.trim(),
        complemento: values.complemento?.trim() || undefined,
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
      })

      notifyLocationUpdated()
      setSuccess(true)

      setTimeout(() => {
        navigate(-1)
      }, 1200)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível salvar.'
      setError(getAuthErrorMessage(message))
    } finally {
      setSaving(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="animate-fade-in pb-6">
        <Header title="Atualizar localização" showBack />
        <div className="flex items-center justify-center gap-2 px-4 py-16">
          <Loader2 size={22} className="animate-spin text-royal" />
          <span className="text-sm font-medium text-muted">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in pb-8">
      <Header title="Atualizar localização" showBack />

      <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4 px-4 pt-2">
        <div className="rounded-[20px] bg-card p-5 shadow-search">
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-3 text-sm text-green-700">
              <CheckCircle2 size={18} />
              Localização atualizada com sucesso!
            </div>
          )}

          <LocationFormSection
            values={values}
            geoMessage={geoMessage}
            cepMessage={cepMessage}
            capturingGeo={capturingGeo}
            loadingCep={loadingCep}
            hasCoordinates={hasCoordinates}
            onUseCurrentLocation={handleUseCurrentLocation}
            onCepChange={handleCepChange}
            onFieldChange={updateField}
            description="Atualize sua localização para encontrarmos a loja Ecoville mais próxima de você."
          />

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <PrimaryButton type="submit" fullWidth disabled={saving || success} className="mt-4">
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar localização'
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}
