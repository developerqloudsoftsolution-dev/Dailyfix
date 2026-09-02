import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Admin API functions
export const adminAPI = {
  login: async (email, password) => {
    try {
      const res = await api.post('/admin/login', { email, password })
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        return {
          ok: false,
          data: {
            message: 'API server not reachable. Ensure the Node.js backend is running and handling /api routes.'
          }
        }
      }
      if (res.data && (res.data.token || res.data.success)) {
        return { ok: true, data: res.data }
      }
      return { ok: false, data: res.data || { message: 'Invalid response from server' } }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (msg) {
        return { ok: false, data: { message: msg } }
      }
      if (err.response?.status === 404) {
        return { ok: false, data: { message: 'API endpoint not found. Verify backend server is running.' } }
      }
      if (err.response?.status >= 500) {
        return { ok: false, data: { message: 'Server error during login. Verify MongoDB connection.' } }
      }
      return { ok: false, data: { message: err.message || 'Login failed' } }
    }
  },
  sendOtp: async (email) => {
    try {
      const res = await api.post('/admin/send-otp', { email })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to send OTP' } }
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      const res = await api.post('/admin/verify-otp', { email, otp })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'OTP verification failed' } }
    }
  },
  resetPassword: async (email, otp, newPassword) => {
    try {
      const res = await api.post('/admin/reset-password', { email, otp, newPassword })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Password reset failed' } }
    }
  },
  getAllAdmins: async () => {
    try {
      const res = await api.get('/admin/admins')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to fetch admins' } }
    }
  },
  createAdmin: async (data) => {
    try {
      const res = await api.post('/admin/admins', data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.message || 'Failed to create admin' } }
    }
  },
  updateAdmin: async (id, data) => {
    try {
      const res = await api.put(`/admin/admins/${id}`, data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.message || 'Failed to update admin' } }
    }
  },
  updateAdminPassword: async (id, newPassword) => {
    try {
      const res = await api.put(`/admin/admins/${id}/password`, { newPassword })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.message || 'Failed to update password' } }
    }
  },
  deleteAdmin: async (id) => {
    try {
      const res = await api.delete(`/admin/admins/${id}`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.message || 'Failed to delete admin' } }
    }
  }
}

// Order & Delhivery API functions
export const orderAPI = {
  createOrder: async (data) => {
    try {
      const res = await api.post('/orders', data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Order failed' } }
    }
  },
  
  getOrderById: async (id) => {
    try {
      const res = await api.get(`/orders/${id}`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to get order' } }
    }
  },
  
  createRazorpayOrder: async (amount) => {
    try {
      const res = await api.post('/orders/create-razorpay-order', { amount })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to create Razorpay order' } }
    }
  },
  
  verifyPayment: async (data) => {
    try {
      const res = await api.post('/orders/verify-payment', data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Payment verification failed' } }
    }
  },
  
  // Courier & Shipping functions
  createDelhiveryShipment: async (orderId) => {
    try {
      const res = await api.post(`/orders/${orderId}/create-shipment`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to create Delhivery shipment' } }
    }
  },

  createEkartShipment: async (orderId) => {
    try {
      const res = await api.post(`/orders/${orderId}/create-ekart-shipment`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to create Ekart shipment' } }
    }
  },

  cancelEkartShipment: async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/ekart-cancel`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to cancel Ekart shipment' } }
    }
  },

  revertShipment: async (orderId, options = {}) => {
    try {
      const res = await api.post(`/orders/${orderId}/revert-shipment`, options)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to revert shipment' } }
    }
  },

  updateOrderWaybill: async (orderId, waybill, carrier = 'Delhivery') => {
    try {
      const res = await api.put(`/orders/${orderId}/waybill`, { waybill, carrier })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to update waybill' } }
    }
  },
  
  trackOrder: async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/track`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to track order' } }
    }
  },
  
  getShippingRate: async (pincode, weight = 0.5) => {
    try {
      const res = await api.get('/orders/shipping/rate', { params: { pincode, weight } })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to get shipping rate' } }
    }
  },

  initiateReturn: async (data) => {
    try {
      const res = await api.post('/orders/return-request', data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.response?.data?.message || err.message || 'Failed to submit return request' } }
    }
  },

  getReturnRequests: async () => {
    try {
      const res = await api.get('/orders/returns/list')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to fetch return requests' } }
    }
  },

  approveReturn: async (orderId, options = {}) => {
    try {
      const res = await api.post(`/orders/${orderId}/approve-return`, options)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to approve return request' } }
    }
  },

  rejectReturn: async (orderId, options = {}) => {
    try {
      const res = await api.post(`/orders/${orderId}/reject-return`, options)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to reject return request' } }
    }
  },

  notifyCustomer: async (orderId, channel = 'both') => {
    try {
      const res = await api.post(`/orders/${orderId}/notify-customer`, { channel })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to send notification to customer' } }
    }
  }
}

// Contact API functions
export const contactAPI = {
  sendContactForm: async (data) => {
    try {
      const res = await api.post('/contact', data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to send message' } }
    }
  }
}

// WhatsApp API functions
export const whatsappAPI = {
  getStatus: async () => {
    try {
      const res = await api.get('/admin/whatsapp/status')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to get WhatsApp status' } }
    }
  },
  getQr: async () => {
    try {
      const res = await api.get('/admin/whatsapp/qr')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'QR code not available' } }
    }
  },
  connect: async () => {
    try {
      const res = await api.post('/admin/whatsapp/connect')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to initiate connection' } }
    }
  },
  logout: async () => {
    try {
      const res = await api.post('/admin/whatsapp/logout')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to logout WhatsApp' } }
    }
  },
  getSettings: async () => {
    try {
      const res = await api.get('/admin/whatsapp/settings')
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to fetch WhatsApp settings' } }
    }
  },
  updateSettings: async (settings) => {
    try {
      const res = await api.put('/admin/whatsapp/settings', settings)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to save settings' } }
    }
  },
  sendTestMessage: async (phone, message) => {
    try {
      const res = await api.post('/admin/whatsapp/test-message', { phone, message })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to send test message' } }
    }
  }
}

// Product Management API functions
export const productAPI = {
  getAllProducts: async (params = {}) => {
    try {
      const res = await api.get('/products', { params })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to fetch products' } }
    }
  },
  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to fetch product' } }
    }
  },
  createProduct: async (productData) => {
    try {
      const res = await api.post('/products', productData)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.response?.data?.message || 'Failed to create product' } }
    }
  },
  updateProduct: async (id, productData) => {
    try {
      const res = await api.put(`/products/${id}`, productData)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.response?.data?.message || 'Failed to update product' } }
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`/products/${id}`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: err.response?.data?.message || 'Failed to delete product' } }
    }
  },
  uploadProductImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        data: err.response?.data || { message: err.message || 'Failed to upload image' },
      };
    }
  },
}

export default api