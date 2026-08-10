import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { getListingImage } from '../utils/productImages';
import { getShadeSortRank } from '../data/productDetailData';
import toast from 'react-hot-toast';

const TRUST_POINTS = [
  { icon: Leaf, label: 'Ammonia-Free Formula' },
  { icon: ShieldCheck, label: 'Dermatologically Tested' },
  { icon: Truck, label: 'Fast, Discreet Shipping' },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            ? 'Products endpoint not found — check API server is running on port 5001'
            : status && status >= 500
              ? 'Server error while loading products — please refresh in a moment'
              : 'Unable to load products. Verify that the Dailyfix API server is running on port 5001';
        toast.error(msg, { duration: 6000 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen -mt-20 bg-stone-50">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-stone-200 bg-white">
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-emerald-200/40 blur-3xl"
        />

        <div className="relative max-w-9xl mx-auto px-6 md:px-12 pt-32 pb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs md:text-sm font-bold tracking-[0.2em] text-emerald-600 uppercase mb-6"
          >
            Dailyfix Grooming
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight mb-6"
          >
            Beard Colour, Done Right
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
          >
            Three natural shades. Zero ammonia. A grey-free beard that still feels like yours.
          </motion.p>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
          >
            {TRUST_POINTS.map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="hidden sm:block w-px h-6 bg-stone-300" aria-hidden="true" />}
                <div className="flex items-center gap-3 text-sm font-medium text-stone-700">
                  <Icon size={20} className="text-emerald-600" />
                  {label}
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-9xl mx-auto px-6 md:px-12 py-4">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900">All Shades</h2>
          <span className="text-stone-500 text-lg">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-32 text-stone-500">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-500 mb-4"></div>
            <p className="text-lg">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 text-stone-500">
            <p className="text-lg">No products available right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
