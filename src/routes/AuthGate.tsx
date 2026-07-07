import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { AuthLoading } from '../components/AuthLoading'

export function AuthGate({ children }: { children: ReactNode }) {
  const { loadingAuth } = useAuth()

  if (loadingAuth) {
    return <AuthLoading />
  }

  return <>{children}</>
}
