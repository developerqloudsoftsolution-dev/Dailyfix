import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Minus, Plus, X, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { getProductImageSrc } from '../utils/productImages';
import Modal from '../components/Modal';

function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen -mt-20 pt-28 pb-16 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-emerald-50 to-stone-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingCart size={64} className="mx-auto text-stone-300 mb-6 sm:size-20" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-stone-600 text-base sm:text-lg mb-8">
              Add some products to get started!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setItemToRemove(null);
  };

  const handleCheckout = () => {
    sessionStorage.removeItem('pendingOrder');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen -mt-20 pt-28 pb-16 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-emerald-50 to-stone-50">
      <div className="max-w-9xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-stone-900">
                Shopping Cart
              </h1>
              <p className="text-stone-500 text-sm sm:text-base mt-1">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm sm:text-base transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Shop</span>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cart.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-soft border border-stone-100 hover:shadow-medium transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image Container */}
                    <div className="w-full sm:w-32 h-36 sm:h-32 bg-gradient-to-br from-emerald-50 to-stone-50 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-stone-100">
                      <img
                        src={getProductImageSrc(item.product)}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2 sm:p-3"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.product.slug || item.product.id}`}
                            className="text-base sm:text-lg font-bold text-stone-900 hover:text-emerald-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        {item.product.sku && (
                          <p className="text-xs text-stone-500 mt-1">SKU: {item.product.sku}</p>
                        )}
                      </div>

                      {/* Controls & Price */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        {/* Quantity controls & Remove */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center rounded-xl border border-stone-200 overflow-hidden bg-stone-50">
                            <button
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white transition-colors text-stone-600 hover:text-emerald-600"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 sm:w-12 text-center font-bold text-sm sm:text-base text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white transition-colors text-stone-600 hover:text-emerald-600"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => setItemToRemove(item.productId)}
                            className="text-red-500 hover:text-red-600 flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors p-1"
                          >
                            <Trash2 size={16} />
                            <span className="hidden xs:inline">Remove</span>
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-lg sm:text-xl font-bold text-emerald-600">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-soft border border-stone-100 lg:sticky lg:top-28">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6">Order Summary</h2>
                
                {/* Minimal Item Preview */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-3 border-b border-stone-100 text-sm">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-10 h-10 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={getProductImageSrc(item.product)}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-stone-700 truncate">{item.product.name}</p>
                          <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-stone-900 flex-shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Shipping, Total */}
                <div className="space-y-3 text-stone-700 mb-6 text-sm sm:text-base">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{getTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Shipping</span>
                    <span className="text-emerald-700 font-semibold">Free</span>
                  </div>
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-stone-900">Total</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                      ₹{Math.round(getTotal()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout Button (Visible on both desktop & mobile at the end of Order Summary) */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal - Confirm Delete */}
      <Modal
        isOpen={Boolean(itemToRemove)}
        onClose={() => setItemToRemove(null)}
        maxWidth="max-w-md"
      >
        {itemToRemove && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">Remove Item</h3>
              <button
                onClick={() => setItemToRemove(null)}
                className="text-stone-400 hover:text-stone-600 transition-colors p-1"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-stone-600 mb-8 text-sm sm:text-base">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setItemToRemove(null)}
                className="flex-1 py-3.5 px-4 rounded-xl sm:rounded-2xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(itemToRemove)}
                className="flex-1 py-3.5 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Check size={18} />
                Remove
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CartPage;