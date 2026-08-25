import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Play, Clock, Droplets, Shield, Sparkles, CheckCircle2, Box } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import banner from '../assets/images/webbanner3.png';
import mobileBanners from '../assets/images/mobile banner.png';
import poster from '../assets/images/poster.png';
import banners from '../assets/images/2.jpg.jpeg';
import beardVideo from '../assets/Untitled design (3).mp4';
import api from '../services/api';
import { getListingImage } from '../utils/productImages';
import { getShadeSortRank } from '../data/productDetailData';
import { blogPosts } from '../data/blogData.js';
import toast from 'react-hot-toast';
import InstagramFeed from '../components/Instagramfeed.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "DailyFix | Beard Colour for Men | Natural, Ammonia-Free Shades";

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const list =
          (res.data && res.data.products) ||
          (Array.isArray(res.data) ? res.data : []);

        if (!Array.isArray(list) || list.length === 0) {
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
        toast.error('Unable to load products. Verify API server is running on port 5000.', { duration: 5000 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const benefits = [
    { icon: <Clock className="w-6 h-6 text-emerald-500" />, title: "Ammonia-Free", desc: "Gentle formula without harsh ammonia, safe for regular use" },
    { icon: <Droplets className="w-6 h-6 text-emerald-500" />, title: "Natural Ingredients", desc: "Enriched with olive oil, taurine, and natural extracts" },
    { icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, title: "Gray Coverage", desc: "Perfect coverage for gray hairs in beard, mustache, and sideburns" },
    { icon: <Box className="w-6 h-6 text-stone-700" />, title: "Long-Lasting", desc: "Colour that stays vibrant and lasts for weeks" },
    { icon: <Sparkles className="w-6 h-6 text-stone-700" />, title: "Natural Look", desc: "Blends seamlessly for a natural, undetectable result" },
    { icon: <Shield className="w-6 h-6 text-stone-700" />, title: "Easy to Use", desc: "Simple application process for at-home use" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Banner */}
      <section className="relative overflow-hidden -mt-[76px] sm:-mt-[84px]">
        {/* Background Banner Image */}
        <div className="relative w-full">
          {/* Mobile Banner */}
          <img
            src={mobileBanners}
            alt="Dailyfix Banner"
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto object-contain object-center sm:hidden block"
          />
          {/* Desktop Banner */}
          <img
            src={banner}
            alt="Dailyfix Banner"
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto object-cover object-center hidden sm:block"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 sm:bg-gradient-to-r sm:from-black/60 sm:via-black/30 sm:to-transparent" />
        </div>

        {/* Content Overlay - positioned lower on mobile so product in banner is visible */}
        <div className="absolute inset-0 z-10">
          <div className="max-w-9xl -mt-60 sm:mt-0 mx-auto h-full px-5 sm:px-10 lg:px-12 flex items-end sm:items-center justify-start pb-8 sm:pb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg text-left"
            >
              <div className="inline-flex items-center  gap-2  bg-white/10 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-white font-bold text-[10px] sm:text-xs tracking-widest uppercase">DailyFix Grooming</p>
              </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl mb-6 font-semibold text-white tracking-tight leading-[1.1]">
                Premium Men's <br />
                <span className="text-emerald-500">Beard Colour</span> <br />
                for a Perfect Look
              </h1>
              <Link
                to="/shop"
                className=" absolute mt-40 sm:mt-4 bg-emerald-500 text-white font-bold py-3 px-7 sm:py-4 sm:px-10 rounded-full hover:bg-emerald-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm sm:text-base"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
            {/* Left - Dynamic Image Layout */}
            <div className="lg:col-span-6 relative hidden sm:flex justify-center lg:justify-start">
              {/* Decorative background shape */}
              <div className="absolute -bottom-6 -right-6 w-72 h-80 bg-emerald-50 rounded-full blur-3xl opacity-70"></div>

              <div className="relative group">
                <div className="absolute inset-0 bg-stone-900/10 rounded-2xl blur-xl transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div className="relative w-72 sm:w-80 md:w-[400px] h-[380px] sm:h-[500px] bg-gradient-to-tr from-stone-200 to-stone-100 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] z-10">
                  <img src={poster} alt="Dailyfix Poster" loading="lazy" className="w-full h-full object-conatin" />
                </div>
                <div className="absolute -bottom-12 -right-6 md:right-[-20px] bg-white p-6 rounded-xl shadow-xl border border-stone-100 max-w-[200px] z-20">
                  <p className="text-3xl font-black text-emerald-500">100%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-800 mt-1">Ammonia-Free</p>
                  <p className="text-xs text-stone-600 mt-1">Formulated with premium natural ingredients.</p>
                </div>
              </div>
            </div>

            {/* Right - Premium Typography Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6 mt-12 lg:mt-0"
            >
              <div className="space-y-2">
                <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase bg-emerald-50 px-3 py-1.5 rounded-full">
                  Our Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-none pt-2">
                  Premium Grooming <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">for the Modern Man</span>
                </h2>
              </div>

              <p className="text-stone-700 text-lg leading-relaxed max-w-xl">
                DailyFix is committed to providing high-quality grooming products that enhance your natural look. Our beard colour is formulated with natural ingredients for a safe, seamless, and effective experience.
              </p>

              <hr className="border-stone-200 my-8" />

              <div className="grid grid-cols-2 gap-8 pt-2">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-4xl font-bold text-stone-900">
                    3<span className="text-emerald-500">+</span>
                  </p>
                  <p className="text-stone-600 text-sm font-medium mt-1">Premium Shades</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-4xl font-bold text-stone-900">
                    0<span className="text-emerald-500">%</span>
                  </p>
                  <p className="text-stone-600 text-sm font-medium mt-1">Harsh Chemicals</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-stone-100">
        <div className="max-w-9xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100/80">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest uppercase">Our Products</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight text-stone-900 leading-none">
                Premium <span className="font-bold text-emerald-600">Beard Colour</span>
              </h2>
            </div>
            <div>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold tracking-wide py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-98"
              >
                Shop All Products
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-24 text-slate-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
          <InstagramFeed />
      {/* Video & Highlight Section (Third Last) */}
      <section className="min-h-fit lg:h-[550px] max-h-none lg:max-h-[600px] flex flex-col lg:flex-row bg-black">
        <div className="w-full lg:w-1/2 bg-black flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <video
              className="w-full h-auto aspect-video lg:aspect-auto lg:h-full object-contain bg-black"
              src={beardVideo}
              controls
              autoPlay
              muted
              loop
              playsInline
              poster={poster}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 bg-black flex items-center p-6 sm:p-10 lg:p-16">
          <div className="max-w-lg">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              TRANSFORM YOUR LOOK WITH DAILYFIX
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-8">
              Premium beard colour made with natural ingredients for a perfect, natural-looking coverage. Ammonia-free formula designed specifically for men's grooming needs.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-3 text-white font-semibold border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Infinite Scroll Carousel */}
      <section className="py-12 sm:py-16 lg:py-20 px-0 overflow-hidden bg-stone-50">
        <div className="max-w-9xl mx-auto px-4 sm:px-8 md:px-16 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-emerald-600 font-bold text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                FROM OUR BLOG
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Latest Grooming Tips & Guides
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* CSS keyframes for continuous right-to-left scroll */}
        <style>{`
          @keyframes marquee-home-blog {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .home-blog-marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-home-blog 40s linear infinite;
          }
          .home-blog-marquee-wrap:hover .home-blog-marquee-track {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .home-blog-marquee-track { animation: none; }
          }
        `}</style>

        <div className="home-blog-marquee-wrap w-full overflow-hidden" aria-label="Blog articles carousel">
          <div className="home-blog-marquee-track gap-4 sm:gap-6 pl-4 sm:pl-8">
            {/* Duplicate posts twice for seamless loop */}
            {[...blogPosts, ...blogPosts].map((post, i) => (
              <Link
                key={`${post.id}-${i}`}
                to={`/blog/${post.slug}`}
                className="flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
              >
                <div className="relative overflow-hidden bg-stone-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-44 sm:h-52 md:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500 mb-2 sm:mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section (Second Last) */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-16 bg-white">
        <div className="max-w-9xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <p className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              BENEFITS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Why Choose DailyFix Beard Colour
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              {benefits.slice(0, 3).map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black mb-1 sm:mb-2">{benefit.title}</h4>
                    <p className="text-black/80 font-medium text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="my-6 lg:my-0 flex justify-center">
              <div className="w-full  lg:max-w-none  rounded-xl overflow-hidden">
                <img src={banners} alt="Dailyfix Product" loading="lazy" className="w-full h-[420px] object-contain rounded-xl" />
              </div>
            </div>

            <div className="space-y-6">
              {benefits.slice(3).map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black mb-1 sm:mb-2">{benefit.title}</h4>
                    <p className="text-black/80 font-medium text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-5 px-4 sm:px-8 md:px-16 bg-white relative overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black absolute inset-0 opacity-90"></div>
        <div className="max-w-9xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <p className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              GET STARTED
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Ready to Transform Your Look?
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-10 max-w-2xl mx-auto">
              Experience the difference with DailyFix Men's Beard Colour. Achieve a natural, well-groomed look with our ammonia-free formula.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="bg-emerald-500 text-white font-semibold py-4 px-8 rounded-full hover:scale-105 transition-transform shadow-2xl inline-block"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="bg-white/10 border border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:scale-105 transition-transform flex items-center gap-2 inline-block backdrop-blur-md"
              >
                <Play className="w-5 h-5" />
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;