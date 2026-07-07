import MainLayout from '../layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'

export function ProtectedAppLayout() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  )
}
