import { Outlet } from 'react-router-dom'
import BottomNavigation from '../components/BottomNavigation'

export default function MainLayout() {
  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-bg pb-20">
      <Outlet />
      <BottomNavigation />
    </div>
  )
}
