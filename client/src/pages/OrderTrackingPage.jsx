import { useState } from 'react'
import api, { orderAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Search, MapPin, Package, Truck, CheckCircle } from 'lucide-react'

function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)

  const trackOrder = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID or AWB number')
      return
    }
    setLoading(true)
    try {
      const result = await orderAPI.trackOrder(orderId.trim())
      if (result.ok) {
        setOrder(result.data.order)
        setTrackingData(result.data.trackingData || result.data.tracking)
      } else {
        toast.error(result.data.message || 'Order not found')
      }
    } catch {
      toast.error('Order not found')
      setOrder(null)
      setTrackingData(null)
    } finally {
      setLoading(false)
    }
  }

  const statusSteps = [
    { status: 'Pending', label: 'Order Placed', icon: Package },
    { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'Processing', label: 'Processing', icon: Package },
    { status: 'Shipped', label: 'Shipped', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: CheckCircle }
  ]

  const currentStepIndex = statusSteps.findIndex(s => s.status === order?.status)

  return (
    <div className="max-w-9xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
      
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter your Order ID (e.g., DFX2024...) or AWB Number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
        />
        <button
          onClick={trackOrder}
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          <Search size={20} />
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {order && (() => {
        const isEkart = order.carrier === 'Ekart' || (!order.delhivery?.waybill && (order.ekart?.waybill || order.ekart?.trackingId));
        const waybill = isEkart ? (order.ekart?.waybill || order.ekart?.trackingId) : order.delhivery?.waybill;
        const courierName = isEkart ? 'Ekart Logistics' : 'Delhivery Express';

        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold">Order #{order.orderId}</h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
                {waybill && (
                  <p className="text-sm text-emerald-600 mt-1 font-medium">
                    {courierName} AWB: <span className="font-mono">{waybill}</span>
                  </p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index <= currentStepIndex
                  return (
                    <div key={step.status} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-sm mt-2 text-center ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Live Tracking Details */}
            {trackingData?.ShipmentData?.length > 0 && (
              <div className="mb-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  Live Tracking Updates ({courierName})
                </h3>
                <div className="space-y-3">
                  {trackingData.ShipmentData[0].Shipment?.Scan?.map((scan, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="w-3 h-3 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-800">{scan.status}</p>
                        <p className="text-sm text-gray-500">
                          {scan.location} {scan.date ? `• ${new Date(scan.date).toLocaleString('en-IN')}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items & Total */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {item.product?.name || 'Product'} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.total || 0}</span>
              </div>
            </div>

            {/* Return / Replace CTA */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Issue with your order?</h4>
                <p className="text-xs text-emerald-800">
                  Received a damaged product or wrong shade? Easily initiate a return or free replacement.
                </p>
              </div>
              <a
                href={`/return-order`}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow whitespace-nowrap"
              >
                Initiate Return / Replacement
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  )
}

export default OrderTrackingPage