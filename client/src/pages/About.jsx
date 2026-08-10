import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Zap,
  ShieldCheck,
  Star,
  CheckCircle2,
  Award,
  Heart,
  TrendingUp,
  Users
} from 'lucide-react';
import banner from '../assets/images/dailyfixbannerforwebside.png';
import productBox from '../assets/images/mobile banner.png';
import naturalBlack from '../assets/images/NATURAL BLACK/01.png';
import blackBrown from '../assets/images/02 BLACK BROWN/01.png';
import darkBrown from '../assets/images/DARK BROWN/01.png';
import productOnly from '../assets/images/Dailyfix Beard Colour Product Only.png';
import threeProducts from '../assets/images/three.png';
import poster from '../assets/images/poster.png';

const About = () => {
  const stats = [
    { number: '3+', label: 'Premium Shades', icon: TrendingUp },
    { number: '100%', label: 'Ammonia-Free', icon: Leaf },
    { number: '10K+', label: 'Happy Customers', icon: Users }
  ];

  const features = [
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'Enriched with olive oil, taurine, and natural extracts to nourish your beard.'
    },
    {
      icon: ShieldCheck,
      title: '100% Ammonia-Free',
      description: 'Gentle formula that won\'t irritate your skin or damage your beard.'
    },
    {
      icon: Zap,
      title: 'Long-Lasting',
      description: 'Vibrant color that lasts for weeks without fading.'
    },
    {
      icon: Award,
      title: 'Easy Application',
      description: 'Simple step-by-step process that anyone can do at home.'
    }
  ];

  const galleryItems = [
    { image: naturalBlack, title: 'Natural Black' },
    { image: blackBrown, title: 'Black Brown' },
    { image: darkBrown, title: 'Dark Brown' },
    { image: productOnly, title: 'Product Only' },
    { image: threeProducts, title: 'All Shades' },
    { image: poster, title: 'Poster' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description:
        'We never compromise on quality. Every product is tested rigorously to ensure it meets our high standards before it reaches you.'
    },
    {
      icon: Heart,
      title: 'Safety & Transparency',
      description:
        'We believe in full transparency. All Our ingredients are clearly listed, and our formulas are designed to be safe and gentle.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description:
        'Our customers are at the heart of everything we do. We\'re always listening and improving based on your feedback.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-emerald-900 to-stone-900" />
        <div className="absolute inset-0 opacity-10">
          <img
            src={banner}
            alt="DailyFix Banner"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-3 rounded-full backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold text-xs md:text-sm tracking-widest uppercase">About Us</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Premium Grooming for the Modern Man
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Redefining men's grooming with natural, effective products that enhance your natural look.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative hidden sm:flex justify-center lg:justify-start"
            >
              {/* Decorative background shape */}
              <div className="absolute -left-10 -top-10 w-full h-full bg-emerald-100 rounded-3xl blur-3xl opacity-60" />

              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-900/10 rounded-3xl blur-2xl transform translate-x-6 translate-y-6 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
                <div className="relative w-72 sm:w-80 md:w-[450px] h-[380px] sm:h-[480px] md:h-[520px] bg-gradient-to-br from-stone-100 to-white rounded-3xl shadow-hard overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] z-10">
                  <img
                    src={productBox}
                    alt="DailyFix Product"
                    loading="lazy"
                    className="w-full h-full object-contain sm:object-cover p-3 sm:p-0"
                  />
                </div>
                <div className="absolute -bottom-16 -right-8 md:right-[-40px] bg-white p-8 rounded-2xl shadow-hard border border-stone-100 max-w-[260px] z-20">
                  <p className="text-4xl font-black text-emerald-500">100%</p>
                  <p className="text-sm font-bold uppercase tracking-wider text-stone-800 mt-2">Ammonia-Free</p>
                  <p className="text-sm text-stone-600 mt-2">Formulated with premium natural ingredients.</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="space-y-4">
                <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase bg-emerald-50 px-6 py-3 rounded-full inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Our Story
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
                  Born from a Passion for Perfect Grooming
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-stone-600 text-xl leading-relaxed">
                  DailyFix was founded with a simple mission: to give men the tools they need to look and feel their absolute best. We believe that great grooming shouldn't be complicated - it should be simple, effective, and enjoyable.
                </p>
                <p className="text-stone-600 text-xl leading-relaxed">
                  After years of research and development, we created our signature beard colour - a product that combines the best of science and nature. Our formula is designed to give you natural-looking colour while nourishing your beard and skin.
                </p>
                <p className="text-stone-600 text-xl leading-relaxed">
                  Today, DailyFix is proud to serve thousands of men who trust us with their grooming needs. We're committed to continuous improvement and innovation to bring you the best products possible.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-stone-200">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-5xl font-extrabold text-stone-900">{stat.number}</p>
                      </div>
                      <p className="text-stone-600 text-sm font-medium">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-100 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">What Makes Us Different</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900">Why Choose DailyFix</h2>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-stone-50 p-8 md:p-10 rounded-3xl shadow-soft hover:shadow-hard transition-all duration-500 border border-stone-100 hover:border-emerald-100 group"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-4">{feature.title}</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-100 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Our Products</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900">Gallery</h2>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-soft hover:shadow-hard transition-all duration-500 border border-stone-100 overflow-hidden">
                  <div className="aspect-square bg-stone-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center group-hover:bg-emerald-50 transition-colors duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-stone-900 text-center group-hover:text-emerald-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-100 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Our Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900">What We Stand For</h2>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-gradient-to-br from-stone-50 to-white p-10 md:p-12 rounded-3xl shadow-soft hover:shadow-hard transition-all duration-500 border border-stone-100 group"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-200 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-4">{value.title}</h3>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-3 rounded-full backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold text-xs md:text-sm tracking-widest uppercase">Ready to Transform?</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-8">
              Experience the DailyFix Difference
            </h2>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of happy customers who have transformed their look with our premium beard colour.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-5 px-12 rounded-full shadow-soft hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-5 px-12 rounded-full transition-all duration-300 backdrop-blur-md"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

const ArrowRight = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default About;
