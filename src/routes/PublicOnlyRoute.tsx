import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthLoading } from '../components/AuthLoading'

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loadingAuth } = useAuth()

  if (loadingAuth) {
    return <AuthLoading />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
