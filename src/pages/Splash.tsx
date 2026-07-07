import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'
import Logo from '../components/Logo'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-royal via-royal to-sky px-6">
      <div className="animate-fade-in flex flex-col items-center text-center">
        <div className="mb-8 overflow-hidden rounded-3xl shadow-2xl">
          <Logo size="lg" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Ecoville
        </h1>
        <h2 className="text-xl font-bold text-yellow mt-1">SmartClean</h2>
        <p className="mt-4 text-white/80 text-sm font-medium max-w-xs leading-relaxed">
          A solução certa para cada limpeza.
        </p>
        <div className="mt-12 w-full max-w-xs">
          <PrimaryButton
            fullWidth
            size="lg"
            className="!bg-yellow !text-dark !shadow-yellow/30 hover:!bg-yellow/90"
            onClick={() => navigate('/')}
          >
            Começar
          </PrimaryButton>
        </div>
        <p className="mt-8 text-xs text-white/50">Protótipo MVP · v1.0</p>
      </div>
    </div>
  )
}
