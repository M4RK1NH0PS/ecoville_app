import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import { loginUser } from '../services/authService'
import { getAuthErrorMessage } from '../utils/authErrors'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.')
      return
    }

    setLoading(true)
    try {
      await loginUser({ email: email.trim(), password })
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao entrar.'
      setError(getAuthErrorMessage(message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="bg-gradient-to-b from-royal to-blue-dark px-6 pb-12 pt-14 rounded-b-[28px]">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <Logo size="sm" className="mb-4 rounded-2xl shadow-md" />
          <h1 className="text-2xl font-bold text-white">Entrar</h1>
          <p className="mt-2 text-sm text-white/80">
            Acesse sua conta Ecoville SmartClean.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-sm flex-1 space-y-4 px-4 -mt-6"
      >
        <div className="rounded-[20px] bg-card p-5 shadow-search space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <PrimaryButton type="submit" fullWidth disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </PrimaryButton>
        </div>

        <p className="text-center text-sm text-muted">
          Não tem conta?{' '}
          <Link to="/register" className="font-semibold text-royal hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  )
}
