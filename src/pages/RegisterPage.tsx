import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, MapPin, Navigation } from 'lucide-react'
import Logo from '../components/Logo'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { registerUser } from '../services/authService'
import { getAuthErrorMessage } from '../utils/authErrors'
import { EMPTY_LOCATION, type RegisterFormValues } from '../types/auth'

function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterFormValues>({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    ...EMPTY_LOCATION,
  })
  const [loading, setLoading] = useState(false)
  const [capturingGeo, setCapturingGeo] = useState(false)
  const [geoMessage, setGeoMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function updateField<K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoMessage(
        'Não foi possível acessar sua localização. Você pode continuar preenchendo o endereço manualmente.',
      )
      return
    }

    setCapturingGeo(true)
    setGeoMessage('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField('latitude', position.coords.latitude)
        updateField('longitude', position.coords.longitude)
        setGeoMessage('Localização capturada com sucesso')
        setCapturingGeo(false)
      },
      () => {
        setGeoMessage(
          'Não foi possível acessar sua localização. Você pode continuar preenchendo o endereço manualmente.',
        )
        setCapturingGeo(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  function validate(): string | null {
    if (!form.nome.trim()) return 'Nome é obrigatório.'
    if (!form.email.trim()) return 'E-mail é obrigatório.'
    if (!form.pais.trim()) return 'País é obrigatório.'
    if (!form.estado.trim()) return 'Estado é obrigatório.'
    if (!form.cidade.trim()) return 'Cidade é obrigatória.'
    if (!form.bairro.trim()) return 'Bairro é obrigatório.'
    if (!form.cep.trim()) return 'CEP é obrigatório.'
    if (form.cep.replace(/\D/g, '').length !== 8) return 'Informe um CEP válido.'
    if (!form.endereco.trim()) return 'Endereço é obrigatório.'
    if (!form.numero.trim()) return 'Número é obrigatório.'
    if (!form.password) return 'Senha é obrigatória.'
    if (form.password.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.'
    if (form.password !== form.confirmPassword) return 'As senhas não coincidem.'
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await registerUser({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim() || undefined,
        password: form.password,
        pais: form.pais.trim(),
        estado: form.estado.trim(),
        cidade: form.cidade.trim(),
        bairro: form.bairro.trim(),
        cep: form.cep.trim(),
        endereco: form.endereco.trim(),
        numero: form.numero.trim(),
        complemento: form.complemento?.trim() || undefined,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
      })
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cadastrar.'
      setError(getAuthErrorMessage(message))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm rounded-[20px] bg-card p-6 text-center shadow-card">
          <CheckCircle2 size={48} className="mx-auto text-green mb-4" />
          <h2 className="text-xl font-bold text-dark">Conta criada!</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Seu cadastro foi realizado. Verifique seu e-mail se necessário e faça login.
          </p>
          <PrimaryButton
            fullWidth
            className="mt-6"
            onClick={() => navigate('/login', { replace: true })}
          >
            Ir para o login
          </PrimaryButton>
        </div>
      </div>
    )
  }

  const hasCoordinates = form.latitude != null && form.longitude != null

  return (
    <div className="flex min-h-dvh flex-col bg-bg pb-8">
      <div className="bg-gradient-to-b from-royal to-blue-dark px-6 pb-12 pt-14 rounded-b-[28px]">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <Logo size="sm" className="mb-4 rounded-2xl shadow-md" />
          <h1 className="text-2xl font-bold text-white">Criar conta</h1>
          <p className="mt-2 text-sm text-white/80">
            Cadastre-se para acessar o Ecoville SmartClean.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-sm flex-1 space-y-4 px-4 -mt-6"
      >
        <div className="rounded-[20px] bg-card p-5 shadow-search space-y-4">
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={form.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            autoComplete="name"
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={form.telefone}
            onChange={(e) => updateField('telefone', e.target.value)}
            autoComplete="tel"
          />

          <section className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal/10">
                <MapPin size={18} className="text-royal" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-dark">
                  Localização para atendimento
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Usamos sua localização para indicar a loja Ecoville mais próxima e
                  melhorar seu atendimento.
                </p>
              </div>
            </div>

            <SecondaryButton
              type="button"
              fullWidth
              disabled={capturingGeo}
              onClick={handleUseCurrentLocation}
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
                  hasCoordinates
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {geoMessage}
              </p>
            )}

            {hasCoordinates && (
              <p className="text-xs text-muted">
                Coordenadas: {form.latitude?.toFixed(5)}, {form.longitude?.toFixed(5)}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="País"
                placeholder="Brasil"
                value={form.pais}
                onChange={(e) => updateField('pais', e.target.value)}
                autoComplete="country-name"
              />
              <Input
                label="Estado"
                placeholder="Ex: SP"
                value={form.estado}
                onChange={(e) => updateField('estado', e.target.value)}
                autoComplete="address-level1"
              />
              <Input
                label="Cidade"
                placeholder="Sua cidade"
                value={form.cidade}
                onChange={(e) => updateField('cidade', e.target.value)}
                autoComplete="address-level2"
              />
              <Input
                label="Bairro"
                placeholder="Seu bairro"
                value={form.bairro}
                onChange={(e) => updateField('bairro', e.target.value)}
              />
              <Input
                label="CEP"
                placeholder="00000-000"
                inputMode="numeric"
                value={form.cep}
                onChange={(e) => updateField('cep', formatCep(e.target.value))}
                autoComplete="postal-code"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Endereço"
                  placeholder="Rua, avenida..."
                  value={form.endereco}
                  onChange={(e) => updateField('endereco', e.target.value)}
                  autoComplete="street-address"
                />
              </div>
              <Input
                label="Número"
                placeholder="123"
                value={form.numero}
                onChange={(e) => updateField('numero', e.target.value)}
              />
              <Input
                label="Complemento"
                placeholder="Apto, bloco... (opcional)"
                value={form.complemento ?? ''}
                onChange={(e) => updateField('complemento', e.target.value)}
              />
            </div>
          </section>

          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Repita a senha"
            value={form.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <PrimaryButton type="submit" fullWidth disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </PrimaryButton>
        </div>

        <p className="text-center text-sm text-muted">
          Já tenho conta?{' '}
          <Link to="/login" className="font-semibold text-royal hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
