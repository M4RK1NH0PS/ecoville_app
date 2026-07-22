import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  MapPin,
  Store,
  MessageCircle,
  Edit,
  Package,
  Heart,
  LogOut,
  Loader2,
} from 'lucide-react'
import Header from '../components/Header'
import SecondaryButton from '../components/SecondaryButton'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import { getProfile } from '../services/profileService'
import { getAuthErrorMessage } from '../utils/authErrors'
import {
  formatProfileLocation,
  getNearestStoreLabel,
  getStoreWhatsAppLabel,
  type Profile,
} from '../types/auth'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!user?.id) {
      setProfile(null)
      setProfileError('')
      setLoadingProfile(false)
      return
    }

    let mounted = true

    const userId = user.id

    async function loadProfile() {
      setLoadingProfile(true)
      setProfileError('')

      try {
        const data = await getProfile(userId)
        if (mounted) {
          setProfile(data)
        }
      } catch (err) {
        if (mounted) {
          setProfile(null)
          const message =
            err instanceof Error ? err.message : 'Não foi possível carregar o perfil.'
          setProfileError(getAuthErrorMessage(message))
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
  }, [user?.id])

  const nome =
    profile?.nome?.trim() ||
    (user?.user_metadata?.nome as string | undefined)?.trim() ||
    user?.email?.split('@')[0] ||
    '—'

  const email = user?.email ?? '—'
  const telefone =
    profile?.telefone?.trim() ||
    (user?.user_metadata?.telefone as string | undefined)?.trim() ||
    '—'

  const cidadeLabel = formatProfileLocation(profile)
  const lojaLabel = getNearestStoreLabel(profile)
  const whatsappLabel = getStoreWhatsAppLabel()
  const hasStoreWhatsApp = false

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logoutUser()
      navigate('/login', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sair.'
      alert(getAuthErrorMessage(message))
    } finally {
      setLoggingOut(false)
    }
  }

  const menuItems = [
    { icon: Edit, label: 'Editar perfil', action: () => alert('Edição de perfil (simulação)') },
    { icon: Package, label: 'Meus pedidos', action: () => navigate('/cart') },
    { icon: Heart, label: 'Favoritos', action: () => alert('Favoritos (simulação)') },
  ]

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Perfil" />

      <div className="px-4 space-y-5">
        {loadingProfile && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-white py-8 shadow-sm">
            <Loader2 size={22} className="animate-spin text-royal" />
            <span className="text-sm font-medium text-muted">Carregando perfil...</span>
          </div>
        )}

        {profileError && !loadingProfile && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{profileError}</p>
        )}

        {!loadingProfile && (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-royal to-sky p-6 text-white text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <User size={32} />
              </div>
              <h2 className="text-xl font-extrabold">{nome}</h2>
              <p className="mt-1 text-sm text-white/80">{email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                <User size={12} />
                Pessoa física
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow icon={User} label="Telefone" value={telefone} />
              <InfoRow icon={MapPin} label="Cidade" value={cidadeLabel} />
              <InfoRow icon={Store} label="Loja mais próxima" value={lojaLabel} />
              <InfoRow icon={MessageCircle} label="WhatsApp da loja" value={whatsappLabel} />
            </div>

            <SecondaryButton fullWidth disabled={!hasStoreWhatsApp}>
              <MessageCircle size={18} />
              Falar com a loja
            </SecondaryButton>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              {menuItems.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-bg ${
                    i > 0 ? 'border-t border-gray-100' : ''
                  }`}
                >
                  <item.icon size={20} className="text-royal" />
                  <span className="text-sm font-semibold text-dark">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              Sair da conta
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
        <Icon size={18} className="text-royal" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-dark">{value}</p>
      </div>
    </div>
  )
}
