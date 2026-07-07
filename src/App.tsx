import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import MainLayout from './layouts/MainLayout'
import Splash from './pages/Splash'
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

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </CatalogProvider>
  )
}
