import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ShieldCheck, MessageSquare, Ticket } from 'lucide-react'



import api from '../services/api'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

function AdminLayout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      await api.get('/admin/dashboard')
      setLoading(false)
    } catch {
      navigate('/admin/login')
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout')
      logout()
      navigate('/', { replace: true })
      toast.success('Logged out successfully')
    } catch {
      logout()
      navigate('/', { replace: true })
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="fixed top-0 left-0 z-30 flex flex-col w-64 h-screen bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
          <h1 className="text-xl font-bold text-primary">DailyFixCare Admin</h1>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <Package size={20} />
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <ShoppingCart size={20} />
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/customers" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <Users size={20} />
                Customers
              </Link>
            </li>
            <li>
              <Link to="/admin/whatsapp" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <MessageSquare size={20} />
                WhatsApp Bot
              </Link>
            </li>
            <li>
              <Link to="/admin/coupons" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 text-purple-300 font-medium">
                <Ticket size={20} className="text-purple-400" />
                Add Coupon
              </Link>
            </li>

            <li className="hidden" style={{ display: 'none' }}>
              <Link to="/admin/admins" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <ShieldCheck size={20} />
                Manage Admins
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout