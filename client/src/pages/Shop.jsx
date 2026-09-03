import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  Truck,
  Sparkles,
  Clock,
  RefreshCw,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { getListingImage } from '../utils/productImages';
import { getShadeSortRank } from '../data/productDetailData';
import toast from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Beard Colour | DailyFix 100% Ammonia-Free Signature Shades';

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const list =
          (res.data && res.data.products) ||
          (Array.isArray(res.data) ? res.data : []);

        if (!Array.isArray(list) || list.length === 0) {
          toast.error('No products are available right now');
          setProducts([]);
          return;
        }

        const mappedProducts = list.map((product) => ({
          id: product._id || product.id,
          name: product.name,
          desc: 'Ammonia-Free Formula',
          price: product.price,
          image: getListingImage(product.slug),
          slug: product.slug,
          sku: product.sku,
          brand: product.brand,
          stock: product.stock
        }));
        mappedProducts.sort((a, b) => getShadeSortRank(a.slug) - getShadeSortRank(b.slug));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        const status = error?.response?.status;
        const msg =
          status === 404
            ? 'Products endpoint not found — check API server is running on port 5000'
            : status && status >= 500
              ? 'Server error while loading products — please refresh in a moment'
              : 'Unable to load products. Verify that the Dailyfix API server is running on port 5000';
        toast.error(msg, { duration: 6000 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#F7F5EE] min-h-screen relative overflow-hidden">
      {/* Decorative ambient subtle green glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[#2D7D52]/8 via-[#4EA874]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-[#2D7D52]/4 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================
          MINIMAL HEADER SECTION: COMPACT & ELEGANT
      ========================================================= */}
      <section className="relative pt-34 sm:pt-38 lg:pt-40 pb-6 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1B4D31]/10">
          {/* Left Minimal Title & Tag */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/25 text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
              <Sparkles size={13} className="text-[#2D7D52]" />
              <span>Pure Botanical Collection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight">
              Signature Beard Colour
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#4A6352]">
              100% Ammonia-free botanical formula. Undetectable gray coverage in 10 minutes.
            </p>
          </div>

          {/* Right Trust Badges (Compact Minimal Row) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#1B4D31]/10 text-[11px] font-bold text-[#143D28] shadow-xs">
              <Leaf size={13} className="text-[#2D7D52]" />
              <span>0% Ammonia</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#1B4D31]/10 text-[11px] font-bold text-[#143D28] shadow-xs">
              <Clock size={13} className="text-[#2D7D52]" />
              <span>10-Min Action</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#1B4D31]/10 text-[11px] font-bold text-[#143D28] shadow-xs">
              <Truck size={13} className="text-[#2D7D52]" />
              <span>Free Delivery</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EAF5EE] text-[11px] font-bold text-[#2D7D52] border border-[#2D7D52]/20">
              <span>3 Shades</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRODUCTS GRID: SEEN IMMEDIATELY ABOVE THE FOLD
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 relative z-10">
        {loading ? (
          <div className="text-center py-24 text-[#4A6352]">
            <div className="inline-block h-9 w-9 animate-spin rounded-full border-3 border-[#2D7D52]/20 border-t-[#2D7D52] mb-3"></div>
            <p className="font-sans text-xs font-semibold">Loading signature shades...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-[#4A6352] bg-white rounded-[24px] border border-[#1B4D31]/10 p-8 max-w-lg mx-auto">
            <p className="font-serif text-xl font-bold text-[#143D28] mb-2">No Products Available</p>
            <p className="font-sans text-xs">Please refresh or check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* ========================================================
            TRUST INDICATORS BANNER (Below Products)
        ========================================================= */}
        <div className="mt-14 bg-white rounded-[24px] p-6 sm:p-8 border border-[#1B4D31]/10 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center flex-shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-[#143D28]">Free Pan-India Delivery</p>
              <p className="font-sans text-xs text-[#637D6C] mt-0.5">Dispatched within 24 hours in discreet packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-[#143D28]">100% Genuine Formula</p>
              <p className="font-sans text-xs text-[#637D6C] mt-0.5">Direct botanical blend with zero harsh odors</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center flex-shrink-0">
              <RefreshCw size={22} />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-[#143D28]">Shade Match Guarantee</p>
              <p className="font-sans text-xs text-[#637D6C] mt-0.5">Need help choosing? Our advisors assist free</p>
            </div>
          </div>
        </div>

        {/* ========================================================
            SHADE CONCIERGE CTA
        ========================================================= */}
        <div className="mt-8 bg-gradient-to-br from-[#1B4D31] to-[#143D28] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-serif text-xl font-bold">Unsure Which Shade Fits You?</p>
            <p className="font-sans text-xs sm:text-sm text-white/80">
              Send a photo of your beard in natural daylight to our grooming concierge for custom recommendation.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#EAF5EE] text-[#143D28] font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-xs hover:scale-105"
          >
            <span>Ask a Grooming Specialist</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Shop;
