import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import { registerUser } from '../services/authService'
import { getAuthErrorMessage } from '../utils/authErrors'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function validate(): string | null {
    if (!nome.trim()) return 'Nome é obrigatório.'
    if (!email.trim()) return 'E-mail é obrigatório.'
    if (!password) return 'Senha é obrigatória.'
    if (password.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.'
    if (password !== confirmPassword) return 'As senhas não coincidem.'
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
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
        password,
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            autoComplete="tel"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
