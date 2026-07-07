import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navItems = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/catalog', label: 'Categorias', icon: LayoutGrid },
  { to: '/cart', label: 'Pedidos', icon: ShoppingBag },
  { to: '/profile', label: 'Conta', icon: User },
]

export default function BottomNavigation() {
  const { itemCount } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-nav">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex min-w-[64px] flex-col items-center gap-1 px-2 py-1 transition-colors ${
                isActive ? 'text-royal' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={23} strokeWidth={isActive ? 2.5 : 2} />
                  {label === 'Pedidos' && itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-yellow px-1 text-[10px] font-bold text-dark">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
