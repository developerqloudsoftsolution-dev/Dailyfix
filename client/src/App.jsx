import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext.jsx'
import { useEffect } from 'react'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import StoreLocator from './pages/StoreLocator'
import BeardOil from './pages/BeardOil'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderSummaryPage from './pages/OrderSummaryPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import Debug from './pages/Debug'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminCustomers from './pages/admin/Customer'
import AdminManagement from './pages/admin/AdminManagement'
import WhatsAppConnect from './pages/admin/WhatsAppConnect'
import AuthorizeApp from './pages/admin/AuthorizeApp'
import AdminCoupons from './pages/admin/Coupons'

import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/beard-oil" element={<BeardOil />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:id" element={<OrderSuccessPage />} />
              <Route path="/order-summary/:id" element={<OrderSummaryPage />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/debug" element={<Debug />} />
            </Route>
            
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/authorize-app" element={<AuthorizeApp />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/admins" element={<AdminManagement />} />
              <Route path="/admin/whatsapp" element={<WhatsAppConnect />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}



export default App
