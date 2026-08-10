import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Login failed' } }
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
  
  // Delhivery functions
  createDelhiveryShipment: async (orderId) => {
    try {
      const res = await api.post(`/orders/${orderId}/create-shipment`)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to create shipment' } }
    }
  },

  updateOrderWaybill: async (orderId, waybill) => {
    try {
      const res = await api.put(`/orders/${orderId}/waybill`, { waybill })
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

export default api