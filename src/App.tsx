import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { AuthGate } from './routes/AuthGate'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import { ProtectedAppLayout } from './routes/ProtectedAppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import ResolveStain from './pages/ResolveStain'
import AIAssistant from './pages/AIAssistant'
import MyHome from './pages/MyHome'
import MyBusiness from './pages/MyBusiness'
import CartPage from './pages/Cart'
import Reorder from './pages/Reorder'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import Splash from './pages/Splash'

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <BrowserRouter>
          <AuthGate>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />

              <Route element={<ProtectedAppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/welcome" element={<Splash />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/resolve" element={<ResolveStain />} />
                <Route path="/assistant" element={<AIAssistant />} />
                <Route path="/my-home" element={<MyHome />} />
                <Route path="/my-business" element={<MyBusiness />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/reorder" element={<Reorder />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthGate>
        </BrowserRouter>
      </CartProvider>
    </CatalogProvider>
  )
}
