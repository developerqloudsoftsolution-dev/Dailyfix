import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Zap, Leaf,
  ShieldCheck, Truck, X, Play, CheckCircle2, Sparkles, AlertTriangle,
  BookOpen, Droplets, HelpCircle, ShieldAlert, Package, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getProductGallery, getListingImage } from '../utils/productImages';
import { getProductDetailData } from '../data/productDetailData';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews, { StarRating } from '../components/ProductReviews';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [openAccordion, setOpenAccordion] = useState({
    howToUse: true,
    features: false,
    benefits: false,
    ingredients: false,
    safety: false
  });
  const [openFaq, setOpenFaq] = useState(null);
  const imageRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const apiProduct = res.data;
        const slug = apiProduct.slug;
        const detailData = getProductDetailData(slug);
        setDetail(detailData);

        if (detailData.seoTitle) {
          document.title = detailData.seoTitle;
        }
        if (detailData.seoDescription) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
          }
          meta.content = detailData.seoDescription;
        }

        const mappedProduct = {
          id: apiProduct._id,
          name: apiProduct.name || `Dailyfix Men's Beard Colour – ${detailData.shadeName}`,
          desc: 'Ammonia-Free Formula',
          price: apiProduct.price,
          image: getListingImage(slug),
          images: getProductGallery(slug),
          slug: slug,
          sku: apiProduct.sku || detailData.shadeName,
          brand: apiProduct.brand || 'Dailyfix',
          stock: typeof apiProduct.stock === 'number' ? apiProduct.stock : 100,
          description: apiProduct.description || detailData.longDescription?.[0] || ''
        };
        setProduct(mappedProduct);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Unable to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => {
    if (!product) return;
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ecfdf5' }}>
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ecfdf5' }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-800 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const AccordionItem = ({ idKey, title, icon: Icon, children, defaultOpen = false }) => (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => toggleAccordion(idKey)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-emerald-600" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 text-stone-600 transition-transform duration-300 flex-shrink-0 ml-2 ${openAccordion[idKey] ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openAccordion[idKey] && (
        <div className="px-5 sm:px-6 pb-6 sm:pb-7 border-t border-stone-100 pt-4 sm:pt-5">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-10 pb-20 bg-stone-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20">
          {/* LEFT: Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 lg:gap-8 lg:sticky lg:top-28 lg:self-start"
          >
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible sm:w-20 lg:w-24">
              {product.images.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 p-2 rounded-2xl overflow-hidden transition-all duration-300 relative"
                  style={{
                    borderWidth: '2px',
                    borderColor: index === currentImageIndex ? '#10b981' : 'transparent',
                    backgroundColor: index === currentImageIndex ? '#ecfdf5' : '#f5f5f4'
                  }}
                  aria-label={`View media ${index + 1}`}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.src}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <video
                        src={media.src}
                        className="w-full h-full object-contain"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Play size={12} fill="white" className="text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main media area */}
            <div className="flex-1 relative">
              <div
                ref={imageRef}
                className="aspect-square rounded-3xl overflow-hidden relative border group"
                style={{ backgroundColor: '#ecfdf5', borderColor: '#d1fae5', cursor: product.images[currentImageIndex].type === 'image' ? 'zoom-in' : 'default' }}
                onMouseEnter={() => product.images[currentImageIndex].type === 'image' && setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={product.images[currentImageIndex].type === 'image' ? handleMouseMove : undefined}
                onClick={() => product.images[currentImageIndex].type === 'image' && setLightboxOpen(true)}
              >
                {product.images[currentImageIndex].type === 'image' ? (
                  <img
                    src={product.images[currentImageIndex].src}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 sm:p-8"
                    draggable={false}
                  />
                ) : (
                  <video
                    src={product.images[currentImageIndex].src}
                    className="w-full h-full object-contain p-4"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {showZoom && product.images[currentImageIndex].type === 'image' && (
                  <div
                    className="hidden lg:block absolute inset-0 pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: `url(${product.images[currentImageIndex].src})`,
                      backgroundSize: '220%',
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}

                {product.images[currentImageIndex].type === 'image' && (
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold" style={{ backgroundColor: 'rgba(35, 31, 28, 0.8)', color: '#FAF7F2' }}>
                      Click to expand
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Product details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-7"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <p className="text-xs tracking-widest uppercase font-semibold text-emerald-600 flex items-center gap-2">
                  {product.brand}
                </p>
                <span className="w-1 h-1 bg-emerald-600 rounded-full"></span>
                <p className="text-xs tracking-widest uppercase font-semibold text-emerald-600">{product.desc}</p>
                {detail.shadeName && (
                  <>
                    <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm" style={{ backgroundColor: detail.shadeSwatch }}>
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-white/40" style={{ backgroundColor: detail.shadeSwatch }}></span>
                      {detail.shadeName}
                    </div>
                  </>
                )}
              </div>
              <h1 className="text-2xl  lg:text-4xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="#customer-reviews"
                  className="inline-flex items-center gap-2 group cursor-pointer hover:opacity-85 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <StarRating rating={4.9} size={18} />
                  <span className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-600 transition-colors">
                    4.9
                  </span>
                  <span className="text-xs text-stone-500 font-medium group-hover:underline">
                    (148+ Verified Reviews)
                  </span>
                </a>
                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  98% Recommend
                </span>
              </div>

              {detail.shortTagline && (
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-emerald-700 font-semibold flex items-center gap-2">
                  <Sparkles size={18} className="flex-shrink-0" />
                  {detail.shortTagline}
                </p>
              )}
              <p className="text-stone-500 mt-3 text-sm sm:text-base">SKU: {product.sku}</p>
            </div>

            {/* Price & availability */}
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-600">
                ₹{product.price}
              </span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                  <CheckCircle2 size={16} />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                  <AlertTriangle size={16} />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              {detail.longDescription?.map((para, i) => (
                <p key={i} className="text-stone-600 text-base sm:text-lg leading-relaxed">
                  {para}
                </p>
              ))}
              {(!detail.longDescription || detail.longDescription.length === 0) && product.description && (
                <p className="text-stone-600 text-lg leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Leaf, label: 'Ammonia-free', desc: 'Gentle formula' },
                { icon: ShieldCheck, label: 'Dermatologist tested', desc: 'Safe for skin' },
                { icon: Truck, label: 'Fast delivery', desc: 'Discreet packaging' },
              ].map(({ icon: Icon, label, desc }, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 text-center py-5 px-4 rounded-2xl border border-emerald-100 bg-emerald-50"
                >
                  <Icon size={22} className="text-emerald-600" />
                  <p className="font-semibold text-stone-900 text-sm">{label}</p>
                  <p className="text-xs text-stone-500">{desc}</p>
                </div>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-stone-900">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl border overflow-hidden" style={{ borderColor: '#a7f3d0' }}>
                  <button
                    onClick={decrement}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-emerald-50 transition-colors text-emerald-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} strokeWidth={2.5} />
                  </button>
                  <span className="w-14 sm:w-16 text-center font-bold text-xl text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-emerald-50 transition-colors text-emerald-700"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="text-sm text-stone-500">
                  <Package size={14} className="inline mr-1.5 -mt-0.5" />
                  {product.stock} units available
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 rounded-2xl font-bold py-4 px-5 border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                style={{
                  borderColor: '#10b981',
                  color: '#065f46',
                  backgroundColor: 'transparent',
                  ...(addedToCart ? { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' } : {})
                }}
                onMouseOver={(e) => !addedToCart && (e.currentTarget.style.backgroundColor = '#065f46', e.currentTarget.style.color = 'white')}
                onMouseOut={(e) => !addedToCart && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#065f46')}
              >
                <ShoppingBag size={20} />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 rounded-2xl font-bold py-4 px-5 transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-medium text-base sm:text-lg"
                style={{ backgroundColor: '#10b981', color: 'white' }}
              >
                <Zap size={20} fill="currentColor" />
                Buy Now
              </button>
            </div>

            {/* Award / Guarantee badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-100">
                <Award size={22} className="text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-stone-900">Premium Quality</p>
                  <p className="text-xs text-stone-500">Made with finest ingredients</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-100">
                <ShieldCheck size={22} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-stone-900">Secure Checkout</p>
                  <p className="text-xs text-stone-500">100% payment protection</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ==================== DETAILED SECTIONS BELOW ==================== */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Accordions */}
          <div className="lg:col-span-2 space-y-3 ">
            <AccordionItem
              idKey="features"
              title="Key Features"
              icon={Sparkles}
              defaultOpen={openAccordion.features}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {detail.keyFeatures?.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base font-medium text-stone-800">{feature}</p>
                  </div>
                ))}
              </div>
            </AccordionItem>

            <AccordionItem
              idKey="benefits"
              title="Benefits"
              icon={Award}
              defaultOpen={openAccordion.benefits}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.benefits?.map((b, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <h4 className="font-bold text-stone-900 text-base sm:text-lg mb-1.5">{b.title}</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </AccordionItem>

            <AccordionItem
              idKey="howToUse"
              title="How to Use"
              icon={BookOpen}
              defaultOpen={true}
            >
              <div className="space-y-4">
                <ol className="space-y-3 sm:space-y-4">
                  {detail.howToUse?.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                        {i + 1}
                      </div>
                      <p className="text-stone-700 text-sm sm:text-base leading-relaxed pt-1.5">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
                {detail.howToUseNote && (
                  <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                      <strong>Important:</strong> {detail.howToUseNote}
                    </p>
                  </div>
                )}
              </div>
            </AccordionItem>
            
            <AccordionItem
              idKey="safety"
              title="Safety & Precautions"
              icon={ShieldAlert}
              defaultOpen={openAccordion.safety}
            >
              <div className="space-y-3">
                {detail.safety?.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100">
                    <ShieldAlert size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 font-medium leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </AccordionItem>
          </div>

          {/* RIGHT COLUMN: FAQ */}
          <div className="space-y-5">
            <div className="sticky lg:top-28">
              <div className="p-5 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <HelpCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
                      FAQs
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Frequently asked questions</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {detail.faqs?.map((faq, i) => (
                    <div key={i} className="border border-stone-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            Q
                          </span>
                          <p className="font-semibold text-stone-900 text-sm leading-snug">
                            {faq.q}
                          </p>
                        </div>
                        <svg
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-stone-500 transition-transform duration-300 flex-shrink-0 mt-1 ${openFaq === i ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 pt-0 border-t border-stone-100">
                          <div className="flex items-start gap-2.5 mt-4">
                            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              A
                            </span>
                            <p className="text-sm text-stone-600 leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-100 text-center">
                  <p className="font-bold text-stone-900 text-sm sm:text-base mb-1">Still have questions?</p>
                  <p className="text-xs sm:text-sm text-stone-600 mb-4">Our team is happy to help you.</p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-md"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== CUSTOMER REVIEWS & RATINGS ==================== */}
        <ProductReviews product={product} slug={product?.slug || id} />

        {/* ==================== RELATED PRODUCTS / OTHER SHADES ==================== */}
        <RelatedProducts currentSlug={product?.slug || id} currentProduct={product} />
      </div>

      {/* Lightbox / click-to-expand modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-stone-900/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="sm:hidden text-stone-800" />
            <X size={24} className="hidden sm:block text-stone-800" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow-soft"
            aria-label="Previous media"
          >
            <ChevronLeft size={20} className="sm:hidden text-stone-800" />
            <ChevronLeft size={24} className="hidden sm:block text-stone-800" />
          </button>

          {product.images[currentImageIndex].type === 'image' ? (
            <img
              src={product.images[currentImageIndex].src}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={product.images[currentImageIndex].src}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow-soft"
            aria-label="Next media"
          >
            <ChevronRight size={20} className="sm:hidden text-stone-800" />
            <ChevronRight size={24} className="hidden sm:block text-stone-800" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;