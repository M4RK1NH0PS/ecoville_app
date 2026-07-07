import type { ReactNode } from 'react'
import BottomNavigation from '../components/BottomNavigation'
import { ProtectedRoute } from './ProtectedRoute'

export function ProtectedPageLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="mx-auto min-h-dvh max-w-lg bg-bg pb-20">
        {children}
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
