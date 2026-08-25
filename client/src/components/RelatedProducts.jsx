import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getListingImage, getProductImageSrc } from '../utils/productImages';
import { getProductDetailData, getShadeSortRank } from '../data/productDetailData';
import toast from 'react-hot-toast';

// Fallback list of the 3 Dailyfix beard colour products
const FALLBACK_PRODUCTS = [
  {
    id: 'natural-black',
    slug: 'natural-black',
    name: "Dailyfix Men's Beard Colour – Natural Black",
    shade: 'Natural Black',
    price: 450,
    desc: 'Ammonia-Free Formula',
    stock: 100,
    brand: 'Dailyfix',
    sku: 'DF-NB-001'
  },
  {
    id: 'black-brown',
    slug: 'black-brown',
    name: "Dailyfix Men's Beard Colour – Black Brown",
    shade: 'Black Brown',
    price: 450,
    desc: 'Ammonia-Free Formula',
    stock: 100,
    brand: 'Dailyfix',
    sku: 'DF-BB-002'
  },
  {
    id: 'dark-brown',
    slug: 'dark-brown',
    name: "Dailyfix Men's Beard Colour – Dark Brown",
    shade: 'Dark Brown',
    price: 450,
    desc: 'Ammonia-Free Formula',
    stock: 100,
    brand: 'Dailyfix',
    sku: 'DF-DB-003'
  }
];

const RelatedProducts = ({ currentSlug, currentProduct }) => {
  const [products, setProducts] = useState([]);
  const [addedMap, setAddedMap] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchAllProducts = async () => {
      try {
        const res = await api.get('/products');
        const list = (res.data && res.data.products) || (Array.isArray(res.data) ? res.data : []);

        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((p) => ({
            id: p._id || p.id,
            name: p.name,
            desc: 'Ammonia-Free Formula',
            price: p.price || 450,
            image: getListingImage(p.slug),
            slug: p.slug,
            sku: p.sku,
            brand: p.brand || 'Dailyfix',
            stock: typeof p.stock === 'number' ? p.stock : 100,
            description: p.description
          }));
          mapped.sort((a, b) => getShadeSortRank(a.slug) - getShadeSortRank(b.slug));
          if (isMounted) setProducts(mapped);
          return;
        }
      } catch (err) {
        console.warn('Could not fetch products from API for related section, using default list:', err);
      }

      // Fallback
      if (isMounted) {
        const mappedFallback = FALLBACK_PRODUCTS.map((p) => ({
          ...p,
          image: getListingImage(p.slug)
        }));
        setProducts(mappedFallback);
      }
    };

    fetchAllProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter out the current product to get the remaining 2 products
  const currentKey = String(currentSlug || currentProduct?.slug || currentProduct?.id || '').toLowerCase();
  
  const relatedList = (products.length > 0 ? products : FALLBACK_PRODUCTS).filter((p) => {
    const slugStr = String(p.slug || '').toLowerCase();
    const idStr = String(p.id || p._id || '').toLowerCase();
    const currentIdStr = String(currentProduct?.id || currentProduct?._id || '').toLowerCase();

    if (currentKey && (slugStr === currentKey || slugStr.includes(currentKey) || currentKey.includes(slugStr))) {
      return false;
    }
    if (currentIdStr && (idStr === currentIdStr || slugStr === currentIdStr)) {
      return false;
    }
    // Also match shade keywords if slug formats differ
    if (currentKey.includes('natural-black') && slugStr.includes('natural-black')) return false;
    if (currentKey.includes('black-brown') && slugStr.includes('black-brown')) return false;
    if (currentKey.includes('dark-brown') && slugStr.includes('dark-brown')) return false;

    return true;
  }).slice(0, 2);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`);

    setAddedMap((prev) => ({ ...prev, [product.id || product.slug]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id || product.slug]: false }));
    }, 1800);
  };

  if (relatedList.length === 0) return null;

  return (
    <section className="mt-20 pt-14 border-t border-stone-200/80">
      <div className="max-w-9xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
          >
            <Sparkles size={14} className="text-emerald-600 animate-pulse" />
            Explore Other Shades
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight"
          >
            Related Products
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed"
          >
            Discover our other 100% ammonia-free beard colour shades, specially formulated for natural grey coverage and healthy skin.
          </motion.p>
        </div>

        {/* 2-Card Grid for Remaining Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {relatedList.map((item, index) => {
            const detailData = getProductDetailData(item.slug);
            const isAdded = !!addedMap[item.id || item.slug];
            const imgSrc = item.image || getProductImageSrc(item) || getListingImage(item.slug);

            return (
              <motion.div
                key={item.id || item.slug || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-soft hover:shadow-xl hover:border-emerald-300 transition-all duration-500 overflow-hidden"
              >
                {/* Top Media / Image Area */}
                <Link
                  to={`/product/${item.slug || item.id}`}
                  className="block relative bg-gradient-to-br from-emerald-50/70 via-stone-50 to-emerald-100/30 p-8 sm:p-10 border-b border-stone-100 overflow-hidden cursor-pointer"
                >
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    {detailData.shadeSwatch && (
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm backdrop-blur-md"
                        style={{ backgroundColor: detailData.shadeSwatch }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border-2 border-white/60"
                          style={{ backgroundColor: detailData.shadeSwatch }}
                        />
                        {detailData.shadeName || item.name}
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/60 text-emerald-800 text-xs font-semibold shadow-xs">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      Ammonia-Free
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-64 sm:h-72 flex items-center justify-center relative">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-700 ease-out drop-shadow-md"
                    />
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 bg-white">
                  <div>
                    {/* Brand & Subtitle */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                        {item.brand || 'Dailyfix Grooming'}
                      </span>
                      <span className="text-xs font-medium text-stone-500">
                        SKU: {item.sku || detailData.shadeName}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/product/${item.slug || item.id}`}>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 group-hover:text-emerald-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Tagline */}
                    {detailData.shortTagline && (
                      <p className="mt-2 text-sm font-semibold text-emerald-700/90 flex items-center gap-1.5">
                        <Sparkles size={15} className="text-emerald-500 flex-shrink-0" />
                        {detailData.shortTagline}
                      </p>
                    )}

                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 text-xs text-stone-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                        <span>100% Grey Coverage</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                        <span>Gentle on Beard Skin</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-4 border-t border-stone-100 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-extrabold text-emerald-600">
                          ₹{item.price}
                        </span>
                        <span className="ml-2 text-xs text-stone-500 font-medium">
                          (Inclusive of all taxes)
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        <CheckCircle2 size={12} />
                        In Stock
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl font-bold py-3.5 px-4 border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-300 text-sm shadow-xs"
                        style={isAdded ? { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' } : {}}
                      >
                        <ShoppingBag size={17} />
                        {isAdded ? 'Added!' : 'Add to Cart'}
                      </button>

                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl font-bold py-3.5 px-4 bg-stone-900 hover:bg-emerald-600 text-white transition-all duration-300 text-sm shadow-soft group/btn"
                      >
                        <span>View Shade</span>
                        <ArrowRight size={17} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
