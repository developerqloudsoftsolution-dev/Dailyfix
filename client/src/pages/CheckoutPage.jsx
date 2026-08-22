import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api, { orderAPI } from '../services/api';
import { getProductImageSrc } from '../utils/productImages';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  ArrowLeft,
  CreditCard,
  Package,
  ShoppingBag,
  MapPin,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Truck,
  Lock,
  Ticket,
  Tag,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const statesOfIndia = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep',
  'Delhi', 'Puducherry'
];

const phonePattern = /^[6-9]\d{9}$/;
const pincodePattern = /^[1-9][0-9]{5}$/;

const paymentMethods = [
  { id: 'online', name: 'Online Payment', description: 'Pay using UPI, Credit/Debit Card, or Net Banking', icon: CreditCard },
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: Package }
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Step1AddressSummary({ register, errors, touchedFields, watchedPhone, watchedPincode, selectedPayment, setSelectedPayment, pincodeLoading }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-soft border border-stone-100 p-8"
      >
        <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <MapPin className="text-emerald-600" />
          Shipping Address
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">First Name</label>
            <input
              {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'First name must be at least 2 characters' } })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.firstName && touchedFields.firstName
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.firstName && !errors.firstName
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && touchedFields.firstName && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Last name must be at least 2 characters' } })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.lastName && touchedFields.lastName
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.lastName && !errors.lastName
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && touchedFields.lastName && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
              })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.email && touchedFields.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.email && !errors.email
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              placeholder="you@email.com"
            />
            {errors.email && touchedFields.email && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Phone Number</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600 font-semibold">+91</span>
              <input
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: phonePattern, message: 'Please enter a valid 10-digit mobile number starting with 6-9' }
                })}
                className={`w-full border-2 rounded-2xl pl-16 pr-5 py-4 outline-none transition-all duration-300 ${
                  errors.phone && touchedFields.phone
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : touchedFields.phone && !errors.phone
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                    : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                }`}
                placeholder="10-digit mobile number"
                maxLength={10}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ''))}
              />
              {touchedFields.phone && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  {!errors.phone && watchedPhone?.length === 10 && <CheckCircle size={20} className="text-emerald-500" />}
                </div>
              )}
            </div>
            {errors.phone && touchedFields.phone && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Complete Address</label>
            <textarea
              {...register('address', { required: 'Address is required', minLength: { value: 10, message: 'Address must be at least 10 characters' } })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.address && touchedFields.address
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.address && !errors.address
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              rows={3}
              placeholder="House number, street, landmark, etc."
            />
            {errors.address && touchedFields.address && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">City</label>
              <input
                {...register('city', { required: 'City is required', minLength: { value: 2, message: 'City name must be at least 2 characters' } })}
                className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                  errors.city && touchedFields.city
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : touchedFields.city && !errors.city
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                    : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                }`}
                placeholder="Your city"
              />
              {errors.city && touchedFields.city && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">State</label>
              <select
                {...register('state', { required: 'State is required' })}
                className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 bg-white ${
                  errors.state && touchedFields.state
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : touchedFields.state && !errors.state
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                    : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                }`}
              >
                <option value="">Select your state</option>
                {statesOfIndia.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && touchedFields.state && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.state.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">Pincode</label>
              <div className="relative">
                <input
                  type="text"
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: { value: pincodePattern, message: 'Please enter a valid 6-digit pincode' }
                  })}
                  className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                    errors.pincode && touchedFields.pincode
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                      : touchedFields.pincode && !errors.pincode
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                      : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  }`}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ''))}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {pincodeLoading && (
                    <div className="w-5 h-5 border-2 border-stone-300 border-t-emerald-500 rounded-full animate-spin" />
                  )}
                  {touchedFields.pincode && !pincodeLoading && (
                    <>
                      {!errors.pincode && watchedPincode?.length === 6 && <CheckCircle size={20} className="text-emerald-500" />}
                    </>
                  )}
                </div>
              </div>
              {errors.pincode && touchedFields.pincode && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.pincode.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
            <CreditCard className="text-emerald-600" />
            Payment Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedPayment === method.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-soft'
                      : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedPayment === method.id ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-stone-900">{method.name}</h3>
                      <p className="text-sm text-stone-600 mt-1">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id ? 'border-emerald-500' : 'border-stone-300'
                      }`}
                    >
                      {selectedPayment === method.id && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FixedOrderSummary({
  cart,
  subtotal,
  discount,
  finalTotal,
  appliedCoupon,
  couponInput,
  setCouponInput,
  couponLoading,
  onApplyCoupon,
  onRemoveCoupon,
  availableCoupons,
}) {
  const [showOffers, setShowOffers] = useState(false);
  const totalCartQty = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-6 sm:p-8 rounded-3xl shadow-soft border border-stone-100 lg:sticky lg:top-28 space-y-6"
    >
      <h2 className="text-2xl font-bold text-stone-900">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {cart.map((item, index) => {
          const price = item.product.price;
          return (
            <div key={index} className="flex items-center justify-between text-stone-700 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src={getProductImageSrc(item.product)}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-stone-900 line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-sm text-stone-900">₹{price * item.quantity}</p>
            </div>
          );
        })}
      </div>

      {/* =========================================
          COUPON / PROMO CODE SECTION
          ========================================= */}
      <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
            <Ticket className="text-emerald-600" size={16} /> Have a Promo Code?
          </div>
          {availableCoupons.length > 0 && (
            <button
              type="button"
              onClick={() => setShowOffers(!showOffers)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{showOffers ? 'Hide Offers' : `View Offers (${availableCoupons.length})`}</span>
              {showOffers ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {appliedCoupon ? (
          /* Applied Coupon Badge */
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check size={16} />
              </div>
              <div>
                <p className="font-mono text-sm font-black text-emerald-900 tracking-wider">
                  {appliedCoupon.code}
                </p>
                <p className="text-xs font-semibold text-emerald-700">
                  Savings of ₹{discount} applied!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-stone-400 hover:text-red-500 transition p-1 text-xs font-semibold flex items-center gap-1"
              title="Remove Coupon"
            >
              <X size={16} /> Remove
            </button>
          </div>
        ) : (
          /* Coupon Input Form */
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-stone-900 uppercase tracking-wider focus:outline-none focus:border-emerald-500 transition placeholder-stone-400"
            />
            <button
              type="button"
              onClick={() => onApplyCoupon(couponInput)}
              disabled={couponLoading || !couponInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 shadow-sm"
            >
              {couponLoading ? 'Checking...' : 'Apply'}
            </button>
          </div>
        )}

        {/* Available Offers Drawer */}
        <AnimatePresence>
          {showOffers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2 border-t border-stone-200/60 overflow-hidden"
            >
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Available Offers for You:
              </p>
              {availableCoupons.map((c) => {
                const isBundleLocked = c.minQuantity > 1 && totalCartQty < c.minQuantity;
                const itemsNeeded = c.minQuantity - totalCartQty;

                return (
                  <div
                    key={c._id}
                    className="bg-white border border-stone-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {c.discountType === 'percentage' ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} OFF`}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        {c.title || c.description || (c.minOrderAmount ? `Min order ₹${c.minOrderAmount}` : 'Limited time discount')}
                      </p>
                      {isBundleLocked && (
                        <p className="text-[10px] font-bold text-amber-700">
                          ⚡ Add {itemsNeeded} more item{itemsNeeded > 1 ? 's' : ''} to unlock!
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyCoupon(c.code)}
                      disabled={couponLoading || appliedCoupon?.code === c.code || isBundleLocked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                        appliedCoupon?.code === c.code
                          ? 'bg-emerald-100 text-emerald-800'
                          : isBundleLocked
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {appliedCoupon?.code === c.code ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pricing Calculation Breakdown */}
      <div className="space-y-3 text-stone-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="text-sm font-semibold text-stone-900">₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-sm font-semibold flex items-center gap-1">
              <Tag size={14} /> Coupon Discount ({appliedCoupon?.code})
            </span>
            <span className="text-sm font-bold">- ₹{discount}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Shipping</span>
          <span className="text-emerald-700 font-semibold text-sm">Free</span>
        </div>

        <div className="pt-4 border-t border-stone-200 flex items-center justify-between font-bold">
          <span className="text-lg text-stone-900">Total Amount</span>
          <div className="text-right">
            <span className="text-2xl text-emerald-700 font-black">₹{finalTotal}</span>
            {discount > 0 && (
              <p className="text-[11px] font-semibold text-emerald-600">
                You save ₹{discount} on this order!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-2.5 text-stone-600 text-xs">
          <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
          <span>100% Verified Secure Payment</span>
        </div>
        <div className="flex items-center gap-2.5 text-stone-600 text-xs">
          <Truck size={16} className="text-emerald-600 flex-shrink-0" />
          <span>Express Courier Delivery with Live Tracking</span>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const subtotal = getTotal();
  const discount = appliedCoupon ? Number(appliedCoupon.discountCalculated || 0) : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset,
    setValue
  } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: formData
  });

  const watchedPhone = watch('phone', '');
  const watchedPincode = watch('pincode', '');

  // Load available checkout coupons
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const res = await api.get('/coupons/available');
      if (res.data?.success && res.data.coupons) {
        setAvailableCoupons(res.data.coupons);
      }
    } catch (err) {
      // Quiet fail
    }
  };

  const handleApplyCoupon = async (codeToApply) => {
    if (!codeToApply || !codeToApply.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setCouponLoading(true);
      const res = await api.post('/coupons/apply', {
        code: codeToApply.trim().toUpperCase(),
        orderAmount: subtotal,
        items: cart.map((item) => ({
          productId: item.productId || item.product?._id,
          product: item.product,
          quantity: item.quantity,
          price: item.product?.price || 0,
        })),
      });

      if (res.data?.success && res.data.coupon) {
        setAppliedCoupon(res.data.coupon);
        setCouponInput(res.data.coupon.code);
        toast.success(res.data.message || 'Coupon applied successfully!');
      } else {
        toast.error(res.data?.message || 'Invalid coupon code');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    toast.success('Coupon removed');
  };

  useEffect(() => {
    const savedOrder = sessionStorage.getItem('pendingOrder');
    if (savedOrder) {
      const orderData = JSON.parse(savedOrder);
      const shippingData = orderData.shippingAddress || orderData.shipping_address;
      const initialVals = {
        firstName: orderData.customer?.firstName || '',
        lastName: orderData.customer?.lastName || '',
        email: orderData.customer?.email || '',
        phone: orderData.customer?.phone || '',
        address: shippingData?.address || '',
        city: shippingData?.city || '',
        state: shippingData?.state || '',
        pincode: shippingData?.pincode || ''
      };
      setFormData(initialVals);
      reset(initialVals);
    }
  }, [reset]);

  useEffect(() => {
    const lookupPincode = async () => {
      if (!watchedPincode || watchedPincode.length !== 6 || !/^[1-9][0-9]{5}$/.test(watchedPincode)) {
        return;
      }
      setPincodeLoading(true);
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${watchedPincode}`);
        if (res.data && res.data[0] && res.data[0].Status === 'Success') {
          const postOffice = res.data[0].PostOffice?.[0];
          if (postOffice) {
            const district = postOffice.District || postOffice.County || '';
            const state = postOffice.State || '';
            if (district) {
              setValue('city', district, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
            if (state) {
              setValue('state', state, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
          }
        }
      } catch (err) {
        console.warn('Pincode lookup failed:', err.message);
      } finally {
        setPincodeLoading(false);
      }
    };
    lookupPincode();
  }, [watchedPincode, setValue]);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const goBack = () => {
    navigate('/cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async (data) => {
    const currentData = data || formData;
    setFormData(currentData);

    if (selectedPayment === 'online') {
      await handleOnlinePayment(currentData);
    } else {
      await submitOrder(currentData);
    }
  };

  // Online Payment Flow (Razorpay)
  const handleOnlinePayment = async (data) => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const totalAmount = finalTotal;

      const gatewayRes = await orderAPI.createRazorpayOrder(totalAmount);

      if (!gatewayRes.ok || !gatewayRes.data?.success) {
        throw new Error(gatewayRes.data?.message || 'Failed to initialize payment');
      }

      const gatewayData = gatewayRes.data;

      const options = {
        key: gatewayData.keyId,
        amount: gatewayData.amount,
        currency: gatewayData.currency,
        name: 'Dailyfix Care',
        description: 'Order Payment',
        order_id: gatewayData.razorpayOrderId,
        handler: async function (response) {
          try {
            // Step 1: Verify payment signature first
            const verifyRes = await orderAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (!verifyRes.ok || !verifyRes.data?.verified) {
              throw new Error('Payment verification failed');
            }

            // Step 2: Payment verified, now create the order in DB
            const res = await api.post('/orders', {
              customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone
              },
              items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity
              })),
              shippingAddress: {
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode
              },
              discount,
              couponCode: appliedCoupon?.code || '',
              paymentMethod: 'online',
              paymentDetails: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                verified: true,
              }
            });

            clearCart();
            sessionStorage.removeItem('pendingOrder');
            toast.success('Payment successful!');
            navigate(`/order-success/${res.data.order.orderId}`);
          } catch (err) {
            console.error('Order creation after payment failed:', err);
            toast.error('Payment verified but order saving failed. Please contact support with Payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        notes: {
          customer_email: data.email,
          customer_phone: data.phone,
          coupon_code: appliedCoupon?.code || '',
        },
        theme: {
          color: '#059669'
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        toast.error(response.error?.description || 'Payment failed. Please try again.');
      });
      razorpayInstance.open();

    } catch (error) {
      console.error('Razorpay init error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  // COD Flow
  const submitOrder = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone
        },
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        discount,
        couponCode: appliedCoupon?.code || '',
        paymentMethod: 'cod'
      });

      clearCart();
      sessionStorage.removeItem('pendingOrder');
      toast.success('Order placed successfully!');
      navigate(`/order-success/${res.data.order.orderId}`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-9xl mx-auto -mt-20">
        <button
          onClick={goBack}
          className="mb-8 flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <form onSubmit={handleSubmit(placeOrder)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Form & Address Details */}
            <div className="lg:col-span-2 space-y-8">
              <Step1AddressSummary
                register={register}
                errors={errors}
                touchedFields={touchedFields}
                watchedPhone={watchedPhone}
                watchedPincode={watchedPincode}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                pincodeLoading={pincodeLoading}
              />

              {/* Desktop Place Order Button (hidden on mobile) */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-soft hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      {selectedPayment === 'online' ? 'Proceed to Payment' : 'Place Order'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary & Mobile Submit Button */}
            <div className="space-y-8">
              <FixedOrderSummary
                cart={cart}
                subtotal={subtotal}
                discount={discount}
                finalTotal={finalTotal}
                appliedCoupon={appliedCoupon}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                couponLoading={couponLoading}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                availableCoupons={availableCoupons}
              />


              {/* Mobile Place Order Button (renders under Order Summary on mobile) */}
              <div className="block lg:hidden">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-soft hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      {selectedPayment === 'online' ? 'Proceed to Payment' : 'Place Order'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;