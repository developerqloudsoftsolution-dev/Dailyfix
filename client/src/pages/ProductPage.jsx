import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Zap, Leaf,
  ShieldCheck, Truck, X, Play, CheckCircle2, Sparkles, AlertTriangle,
  BookOpen, Droplets, HelpCircle, ShieldAlert, Package, Award, ArrowRight,
  Info, Clock, Check, Eye, Sun
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getProductGallery, getListingImage } from '../utils/productImages';
import { getProductDetailData, SHADE_COMPARISON_MATRIX } from '../data/productDetailData';
import { getShadeDefaultReviews } from '../data/productReviews';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews, { StarRating } from '../components/ProductReviews';
import toast from 'react-hot-toast';

// Fallback catalog for instant offline/direct slug resolution
const FALLBACK_PRODUCTS_CATALOG = {
  'natural-black': {
    slug: 'natural-black',
    name: "Dailyfix 001 Natural Black Beard Colour for Men",
    price: 450,
    sku: 'DF-NB-001'
  },
  'black-brown': {
    slug: 'black-brown',
    name: "Dailyfix 002 Black Brown Beard Colour for Men",
    price: 450,
    sku: 'DF-BB-002'
  },
  'dark-brown': {
    slug: 'dark-brown',
    name: "Dailyfix 003 Dark Brown Beard Colour for Men",
    price: 450,
    sku: 'DF-DB-003'
  }
};

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
  const [openFaq, setOpenFaq] = useState(0); // open first FAQ by default
  const imageRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        let apiProduct = null;
        let slug = id || 'natural-black';

        try {
          const res = await api.get(`/products/${id}`);
          if (res.data) {
            apiProduct = res.data;
            slug = apiProduct.slug || slug;
          }
        } catch (apiErr) {
          // Fallback gracefully to catalog data if API is unavailable or route is static slug
          const cleanSlug = String(id || 'natural-black').toLowerCase().replace(/-beard-colour$/, '');
          const catalogItem = FALLBACK_PRODUCTS_CATALOG[cleanSlug] || FALLBACK_PRODUCTS_CATALOG['natural-black'];
          slug = catalogItem.slug;
          apiProduct = {
            _id: catalogItem.slug,
            name: catalogItem.name,
            price: catalogItem.price,
            slug: catalogItem.slug,
            sku: catalogItem.sku,
            stock: 100
          };
        }

        const detailData = getProductDetailData(slug);
        if (!isMounted) return;

        setDetail(detailData);

        // Update Document Title
        if (detailData.seoTitle) {
          document.title = detailData.seoTitle;
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) ogTitle.content = detailData.seoTitle;
          const twTitle = document.querySelector('meta[name="twitter:title"]');
          if (twTitle) twTitle.content = detailData.seoTitle;
        }

        // Update Meta Description
        if (detailData.seoDescription) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
          }
          meta.content = detailData.seoDescription;

          const ogDesc = document.querySelector('meta[property="og:description"]');
          if (ogDesc) ogDesc.content = detailData.seoDescription;
          const twDesc = document.querySelector('meta[name="twitter:description"]');
          if (twDesc) twDesc.content = detailData.seoDescription;
        }

        // Canonical URL
        const canonicalUrl = `https://dailyfixcare.com/product/${slug}`;
        let canonicalEl = document.querySelector('link[rel="canonical"]');
        if (!canonicalEl) {
          canonicalEl = document.createElement('link');
          canonicalEl.rel = 'canonical';
          document.head.appendChild(canonicalEl);
        }
        canonicalEl.href = canonicalUrl;

        // Keywords
        const kwMeta = document.querySelector('meta[name="keywords"]');
        if (kwMeta && detailData.seoTitle) {
          kwMeta.content = `Dailyfix, ${detailData.seoTitle}, ${detailData.shadeName} Beard Colour, Beard Colour for Men, Ammonia-Free Beard Colour, Natural-Looking Beard Colour, Beard Colour for Grey Hair`;
        }

        const mappedProduct = {
          id: apiProduct._id || slug,
          name: detailData.h1Title || apiProduct.name || `Dailyfix Men's Beard Colour – ${detailData.shadeName}`,
          desc: 'Ammonia-Free Formula',
          price: apiProduct.price || 450,
          image: getListingImage(slug),
          images: getProductGallery(slug),
          slug: slug,
          sku: apiProduct.sku || detailData.sku || detailData.shadeName,
          brand: apiProduct.brand || 'Dailyfix',
          stock: typeof apiProduct.stock === 'number' ? apiProduct.stock : 100,
          description: apiProduct.description || detailData.longDescription?.[0] || ''
        };

        setProduct(mappedProduct);
        setCurrentImageIndex(0);

        // ==========================================
        // DYNAMIC STRUCTURED DATA / SCHEMA INJECTION
        // ==========================================
        injectStructuredData(mappedProduct, detailData, slug, canonicalUrl);

      } catch (error) {
        console.error('Failed to resolve product:', error);
        toast.error('Unable to load product details. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
      // Cleanup injected JSON-LD script on component unmount
      const existingScript = document.getElementById('product-structured-data-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, [id]);

  // Structured Data (Product + FAQPage + BreadcrumbList) Injection
  const injectStructuredData = (prod, det, slug, canonical) => {
    let script = document.getElementById('product-structured-data-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'product-structured-data-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const reviewsList = getShadeDefaultReviews(slug) || [];
    const formattedReviews = reviewsList.slice(0, 5).map((rev) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.author
      },
      datePublished: '2026-08-28',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(rev.rating || 5),
        bestRating: '5',
        worstRating: '1'
      },
      reviewBody: rev.content
    }));

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prod.name,
      image: [
        `https://dailyfixcare.com/images/${slug}.png`,
        `https://dailyfixcare.com/images/${slug}.webp`,
        'https://dailyfixcare.com/images/dailyfix-beard-colour.png'
      ],
      description: det.seoDescription,
      sku: prod.sku,
      brand: {
        '@type': 'Brand',
        name: 'Dailyfix'
      },
      color: det.shadeName,
      offers: {
        '@type': 'Offer',
        url: canonical,
        priceCurrency: 'INR',
        price: String(prod.price),
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: prod.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Dailyfix'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '148',
        bestRating: '5',
        worstRating: '1'
      },
      review: formattedReviews
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (det.faqs || []).map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://dailyfixcare.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: 'https://dailyfixcare.com/shop'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: prod.name,
          item: canonical
        }
      ]
    };

    script.textContent = JSON.stringify([productSchema, faqSchema, breadcrumbSchema], null, 2);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500 mb-4"></div>
          <p className="text-stone-600 text-lg font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-emerald-100 max-w-md mx-4">
          <p className="text-2xl font-bold text-stone-900 mb-2">Product Not Found</p>
          <p className="text-stone-600 text-sm mb-6">The requested shade could not be found. Explore our complete beard colour collection.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            Explore All Shades <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-24 bg-stone-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMB NAVIGATION */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
            <li>
              <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/shop" className="hover:text-emerald-700 transition-colors">Shop</Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-none">
              {detail.shadeName}
            </li>
          </ol>
        </nav>

        {/* HERO SECTION: GALLERY + BUY BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-16">

          {/* LEFT: Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 lg:sticky lg:top-24 lg:self-start"
          >
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible sm:w-20 lg:w-24 pb-2 sm:pb-0">
              {product.images.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 p-2 rounded-2xl overflow-hidden transition-all duration-300 relative border-2"
                  style={{
                    borderColor: index === currentImageIndex ? '#10b981' : '#e7e5e4',
                    backgroundColor: index === currentImageIndex ? '#ecfdf5' : '#ffffff'
                  }}
                  aria-label={`View media ${index + 1}`}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.src}
                      alt={`${detail?.imageAlt || product.name} - View ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center bg-stone-100 rounded-xl">
                      <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
                        <Play size={12} fill="white" className="text-white ml-0.5" />
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
                className="aspect-square rounded-3xl overflow-hidden relative border border-emerald-100 bg-white shadow-sm group"
                style={{ cursor: product.images[currentImageIndex]?.type === 'image' ? 'zoom-in' : 'default' }}
                onMouseEnter={() => product.images[currentImageIndex]?.type === 'image' && setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={product.images[currentImageIndex]?.type === 'image' ? handleMouseMove : undefined}
                onClick={() => product.images[currentImageIndex]?.type === 'image' && setLightboxOpen(true)}
              >
                {product.images[currentImageIndex]?.type === 'image' ? (
                  <img
                    src={product.images[currentImageIndex].src}
                    alt={detail?.imageAlt || product.name}
                    className="w-full h-full object-contain p-6 sm:p-8 transition-transform duration-300 group-hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <video
                    src={product.images[currentImageIndex]?.src}
                    className="w-full h-full object-contain p-4"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {showZoom && product.images[currentImageIndex]?.type === 'image' && (
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

                {product.images[currentImageIndex]?.type === 'image' && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-900/80 text-white backdrop-blur-sm shadow">
                      Click to expand
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Product details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div>
              {/* Brand & Shade Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="text-xs tracking-widest uppercase font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {product.brand} Botanical Formula
                </span>
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  100% Ammonia-Free
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm" style={{ backgroundColor: detail.shadeSwatch }}>
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-white/60" style={{ backgroundColor: detail.shadeSwatch }}></span>
                  Shade {detail.shadeNumber} — {detail.shadeName}
                </div>
              </div>

              {/* H1 Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight">
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
                  <span className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    4.9
                  </span>
                  <span className="text-xs text-stone-500 font-medium group-hover:underline">
                    (148+ Verified Reviews)
                  </span>
                </a>
                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  98% Would Recommend
                </span>
              </div>

              {detail.shortTagline && (
                <p className="mt-3 text-base sm:text-lg text-emerald-800 font-semibold flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600 flex-shrink-0" />
                  {detail.shortTagline}
                </p>
              )}
            </div>

            {/* INTERNAL LINKING: Shade Variant Switcher ("Also Available In:") */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold tracking-wider uppercase text-stone-600">
                  Also Available In:
                </span>
                <span className="text-xs text-emerald-700 font-medium">3 Calibrated Shades</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {detail.shadeDetails?.otherShades?.map((other) => (
                  <Link
                    key={other.slug}
                    to={`/product/${other.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                      style={{ backgroundColor: other.swatch }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                        {other.name}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{other.label}</p>
                    </div>
                    <ArrowRight size={14} className="text-stone-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Price & availability */}
            <div className="flex flex-wrap items-baseline gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-stone-400 line-through">₹599</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Save ₹149 (25% OFF)
                </span>
              </div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 size={14} />
                  In Stock &amp; Ready to Ship
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                  <AlertTriangle size={14} />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Existing long description paragraphs (preserved as-is) */}
            <div className="space-y-3">
              {detail.longDescription?.map((para, i) => (
                <p key={i} className="text-stone-600 text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Leaf, label: '0% Ammonia', desc: 'No chemical burn' },
                { icon: Clock, label: '10-Min Action', desc: 'Fast application' },
                { icon: Truck, label: 'Express Shipping', desc: 'All India PINs' },
              ].map(({ icon: Icon, label, desc }, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1 text-center py-3.5 px-2 rounded-2xl border border-emerald-100 bg-emerald-50/60"
                >
                  <Icon size={20} className="text-emerald-700 mb-0.5" />
                  <p className="font-bold text-stone-900 text-xs sm:text-sm leading-tight">{label}</p>
                  <p className="text-[11px] text-stone-500 leading-tight">{desc}</p>
                </div>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-stone-900">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={decrement}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-emerald-50 transition-colors text-emerald-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span className="w-12 sm:w-14 text-center font-bold text-lg text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-emerald-50 transition-colors text-emerald-700"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="text-xs text-stone-500">
                  <Package size={13} className="inline mr-1 -mt-0.5" />
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl font-bold py-3.5 px-5 border-2 transition-all duration-300 disabled:opacity-50 text-base"
                style={{
                  borderColor: '#10b981',
                  color: addedToCart ? 'white' : '#065f46',
                  backgroundColor: addedToCart ? '#10b981' : 'transparent'
                }}
              >
                <ShoppingBag size={18} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl font-bold py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-base"
              >
                <Zap size={18} fill="currentColor" />
                Buy Now
              </button>
            </div>

            {/* Award / Guarantee badges */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-100">
                <Award size={18} className="text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs text-stone-900">Botanical Science</p>
                  <p className="text-[11px] text-stone-500">Formulated with olive lipids</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-100">
                <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs text-stone-900">Secure Checkout</p>
                  <p className="text-[11px] text-stone-500">100% encrypted payments</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PRODUCT BENEFITS (Benefit-Led Scannable Bullets) */}
        {/* ========================================================================= */}
        <section id="product-benefits" className="mt-20 pt-8 border-t border-stone-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Key Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              Product Benefits of {detail.shadeName}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Engineered specifically for men’s coarse facial hair with zero ammonia, zero burning, and natural-looking depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {detail.benefitsBulletList?.map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mb-4">
                    <CheckCircle2 size={20} className="text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-extrabold text-stone-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Check size={14} /> Proven for {detail.shadeName}
                </div>
              </div>
            ))}

            {/* Preserved key features summary card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-stone-900 text-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <Sparkles size={20} className="text-emerald-300" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  All-In-One Men's Solution
                </h3>
                <ul className="space-y-2 text-xs text-stone-200">
                  {detail.keyFeatures?.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-300 font-medium">
                Dermatologically tested formula
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: SHADE INFORMATION & SIDE-BY-SIDE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <section id="shade-guide" className="mt-20 pt-8 border-t border-stone-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Shade Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              Shade Information &amp; Comparison Guide
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Understand the subtle tone nuances between our three signature shades to find your exact match.
            </p>
          </div>

          {/* Active shade highlight banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex-shrink-0 shadow-md border-4 border-white"
                  style={{ backgroundColor: detail.shadeSwatch }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      Current Shade
                    </span>
                    <span className="text-xs font-bold text-stone-500">SKU {detail.sku}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                    {detail.shadeNumber} — {detail.shadeName}
                  </h3>
                  <p className="text-stone-600 text-sm mt-0.5">{detail.shadeDetails?.tone}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="block text-stone-400 font-semibold uppercase text-[10px]">Undertone Profile</span>
                  <span className="font-bold text-stone-800">{detail.shadeDetails?.undertone}</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="block text-stone-400 font-semibold uppercase text-[10px]">Coverage Character</span>
                  <span className="font-bold text-stone-800">{detail.shadeDetails?.coverageType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side 3-Shade Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-100/75 border-b border-stone-200">
                  <th className="py-4 px-5 font-extrabold text-stone-900">Shade Variant</th>
                  <th className="py-4 px-5 font-extrabold text-stone-900">Undertone &amp; Finish</th>
                  <th className="py-4 px-5 font-extrabold text-stone-900">Best Suited For</th>
                  <th className="py-4 px-5 font-extrabold text-stone-900">Sunlight Reflection</th>
                  <th className="py-4 px-5 font-extrabold text-stone-900">Grey Blend</th>
                  <th className="py-4 px-5 font-extrabold text-stone-900 text-right">View Shade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {SHADE_COMPARISON_MATRIX.map((item) => {
                  const isCurrent = detail.shadeNumber === item.code;
                  return (
                    <tr
                      key={item.code}
                      className={isCurrent ? 'bg-emerald-50/40 font-semibold' : 'hover:bg-stone-50 transition-colors'}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                            style={{ backgroundColor: item.swatch }}
                          />
                          <div>
                            <span className="font-extrabold text-stone-900">{item.code} {item.name}</span>
                            {isCurrent && (
                              <span className="ml-2 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Viewing
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-stone-700">{item.undertone}</td>
                      <td className="py-4 px-5 text-stone-700">{item.idealFor}</td>
                      <td className="py-4 px-5 text-stone-700">{item.daylightEffect}</td>
                      <td className="py-4 px-5 text-stone-700">{item.greyCoverage}</td>
                      <td className="py-4 px-5 text-right">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-emerald-700">Active Page</span>
                        ) : (
                          <Link
                            to={`/product/${item.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-emerald-700 hover:underline"
                          >
                            Explore <ArrowRight size={13} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: WHAT'S INSIDE THE PACK */}
        {/* ========================================================================= */}
        <section id="pack-contents" className="mt-20 pt-8 border-t border-stone-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Complete Kit
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              What's Inside the Pack: {detail.shadeName}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Everything required for a clean, mess-free, salon-grade grooming session at home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {detail.packContents?.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
                  <Package size={20} />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                      {item.item}
                    </h3>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                    {item.qty}
                  </span>
                  <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: HOW TO USE (Numbered Step-by-Step Instructions) */}
        {/* ========================================================================= */}
        <section id="how-to-use" className="mt-20 pt-8 border-t border-stone-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Application Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              How to Use: Step-by-Step Instructions
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Follow these six simple numbered steps for seamless, natural grey hair coverage in just 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.howToUseSteps?.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                      {step.step}
                    </span>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Step {step.step} of 6
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {step.action}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock size={13} /> {step.step === 5 ? '10-Minute Timer' : 'Preparation Phase'}
                </div>
              </div>
            ))}
          </div>

          {/* Important note callout */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5 max-w-4xl mx-auto">
            <AlertTriangle size={22} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-900">Application Advisory</p>
              <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">
                {detail.howToUseNote} For coarse or highly resistant grey whiskers, leaving the cream on for an additional 2–3 minutes (up to 13 minutes total) ensures deep melanin penetration.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: PRECAUTIONS & 48-HOUR PATCH TEST */}
        {/* ========================================================================= */}
        <section id="precautions" className="mt-20 pt-8 border-t border-stone-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Safety First
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              Precautions &amp; 48-Hour Patch Test Protocol
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Read all safety instructions carefully before every application to protect sensitive facial skin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Patch test protocol card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900">
                    {detail.precautions?.patchTestHeadline}
                  </h3>
                  <p className="text-xs text-stone-500">Perform 48 hours before each application</p>
                </div>
              </div>

              <ol className="space-y-3 mt-4 text-xs sm:text-sm text-stone-600">
                {detail.precautions?.patchTestSteps?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* General warnings card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-red-50/60 border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-700">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900">
                    Important Safety Warnings
                  </h3>
                  <p className="text-xs text-red-700">Standard cosmetic precautions</p>
                </div>
              </div>

              <ul className="space-y-3 mt-4 text-xs sm:text-sm text-stone-700">
                {detail.precautions?.safetyWarnings?.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: FAQS (Product-Specific Accordion UI) */}
        {/* ========================================================================= */}
        <section id="faqs" className="mt-20 pt-8 border-t border-stone-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              Frequently Asked Questions: {detail.shadeName}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Everything you need to know about Dailyfix {detail.shadeName} beard hair colourant.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {detail.faqs?.map((faq, i) => (
              <div
                key={i}
                className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      Q
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-stone-500 transition-transform duration-300 flex-shrink-0 mt-0.5 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0 border-t border-stone-100">
                    <div className="flex items-start gap-3 mt-4">
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        A
                      </span>
                      <p className="text-sm text-stone-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact support CTA */}
          <div className="mt-8 text-center">
            <p className="text-xs text-stone-500 mb-2">Have a question not covered above?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Contact Our Beard Grooming Concierge <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: CUSTOMER REVIEWS (Connected to ProductReviews component) */}
        {/* ========================================================================= */}
        <section id="customer-reviews" className="mt-20 pt-8 border-t border-stone-200">
          <ProductReviews product={product} slug={product?.slug || id} />
        </section>

        {/* ========================================================================= */}
        {/* RELATED PRODUCTS & REMAINING SHADES */}
        {/* ========================================================================= */}
        <section id="related-shades" className="mt-16">
          <RelatedProducts currentSlug={product?.slug || id} currentProduct={product} />
        </section>

      </div>

      {/* Lightbox / click-to-expand modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-stone-900/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow"
            aria-label="Close"
          >
            <X size={20} className="sm:hidden text-stone-800" />
            <X size={24} className="hidden sm:block text-stone-800" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow"
            aria-label="Previous media"
          >
            <ChevronLeft size={20} className="sm:hidden text-stone-800" />
            <ChevronLeft size={24} className="hidden sm:block text-stone-800" />
          </button>

          {product.images[currentImageIndex]?.type === 'image' ? (
            <img
              src={product.images[currentImageIndex].src}
              alt={detail?.imageAlt || product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={product.images[currentImageIndex]?.src}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow"
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