import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { AuthGate } from './routes/AuthGate'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ProtectedPageLayout } from './routes/ProtectedPageLayout'
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

              <Route
                path="/"
                element={
                  <ProtectedPageLayout>
                    <HomePage />
                  </ProtectedPageLayout>
                }
              />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route
                path="/welcome"
                element={
                  <ProtectedRoute>
                    <Splash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/catalog"
                element={
                  <ProtectedPageLayout>
                    <Catalog />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedPageLayout>
                    <ProductDetail />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/resolve"
                element={
                  <ProtectedPageLayout>
                    <ResolveStain />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/assistant"
                element={
                  <ProtectedPageLayout>
                    <AIAssistant />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/my-home"
                element={
                  <ProtectedPageLayout>
                    <MyHome />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/my-business"
                element={
                  <ProtectedPageLayout>
                    <MyBusiness />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedPageLayout>
                    <CartPage />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/reorder"
                element={
                  <ProtectedPageLayout>
                    <Reorder />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/offers"
                element={
                  <ProtectedPageLayout>
                    <Offers />
                  </ProtectedPageLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedPageLayout>
                    <Profile />
                  </ProtectedPageLayout>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthGate>
        </BrowserRouter>
      </CartProvider>
    </CatalogProvider>
  )
}
