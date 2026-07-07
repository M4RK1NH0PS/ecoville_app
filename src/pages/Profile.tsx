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
  Building2,
} from 'lucide-react'
import Header from '../components/Header'
import SecondaryButton from '../components/SecondaryButton'
import { userProfile, openWhatsApp } from '../data/mockData'

export default function Profile() {
  const navigate = useNavigate()

  const menuItems = [
    { icon: Edit, label: 'Editar perfil', action: () => alert('Edição de perfil (simulação)') },
    { icon: Package, label: 'Meus pedidos', action: () => navigate('/cart') },
    { icon: Heart, label: 'Favoritos', action: () => alert('Favoritos (simulação)') },
    { icon: LogOut, label: 'Sair', action: () => navigate('/'), danger: true },
  ]

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Perfil" />

      <div className="px-4 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-royal to-sky p-6 text-white text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <User size={32} />
          </div>
          <h2 className="text-xl font-extrabold">{userProfile.nome}</h2>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {userProfile.tipoCliente === 'Empresa' ? (
              <Building2 size={12} />
            ) : (
              <User size={12} />
            )}
            {userProfile.tipoCliente}
          </div>
        </div>

        <div className="space-y-3">
          <InfoRow icon={MapPin} label="Cidade" value={userProfile.cidade} />
          <InfoRow icon={Store} label="Loja mais próxima" value={userProfile.lojaMaisProxima} />
          <InfoRow icon={MessageCircle} label="WhatsApp da loja" value={userProfile.whatsappLoja} />
        </div>

        <SecondaryButton
          fullWidth
          onClick={() => openWhatsApp('Olá! Preciso de ajuda com produtos Ecoville.')}
        >
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
              <item.icon size={20} className={item.danger ? 'text-red-400' : 'text-royal'} />
              <span className={`text-sm font-semibold ${item.danger ? 'text-red-400' : 'text-dark'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
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
