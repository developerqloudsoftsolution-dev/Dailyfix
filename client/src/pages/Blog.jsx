import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { blogPosts } from '../data/blogData.js';

const CATEGORIES = ['All', 'Grooming Tips', 'Shade Guides', 'Product Science'];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'The DailyFix Journal | Men’s Beard Grooming Advice & Style Guides';
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (post.category && post.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory === 'Shade Guides' && post.title.toLowerCase().includes('shade')) ||
        (selectedCategory === 'Grooming Tips' && (post.title.toLowerCase().includes('grooming') || post.title.toLowerCase().includes('how to'))) ||
        (selectedCategory === 'Product Science' && (post.title.toLowerCase().includes('ammonia') || post.title.toLowerCase().includes('formula') || post.title.toLowerCase().includes('beard color')));

      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : blogPosts[0];
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : filteredPosts.length === 1 ? [] : [];

  return (
    <div className="bg-[#F7F5EE] min-h-screen relative overflow-hidden">
      {/* Ambient subtle glowing backdrops matching /sample1 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#2D7D52]/10 via-[#4EA874]/6 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[45%] right-0 w-[500px] h-[500px] bg-[#2D7D52]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================
          HERO SECTION: EDITORIAL JOURNAL HEADER
      ========================================================= */}
      <section className="relative pt-40 pb-16 sm:pt-48 lg:pt-52 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={14} className="text-[#2D7D52]" />
            <span>The DailyFix Journal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#143D28] tracking-tight leading-tight"
          >
            Grooming Wisdom, <br />
            <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
              Elevated & Refined.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-sans text-base sm:text-lg text-[#4A6352] leading-relaxed max-w-2xl mx-auto"
          >
            Expert masterclasses, shade matching guidance, and botanical science designed to help the modern Indian gentleman look and feel his absolute best.
          </motion.p>
        </div>
      </section>

      {/* ========================================================
          SEARCH & CATEGORY NAVIGATION BAR
      ========================================================= */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto relative z-10 mb-12">
        <div className="bg-white rounded-[24px] p-3 sm:p-4 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-[#143D28] text-white shadow-xs'
                      : 'bg-[#F7F5EE] text-[#4A6352] hover:bg-[#EAF5EE] hover:text-[#143D28] border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A6352]/70 pointer-events-none" />
            <input
              type="text"
              placeholder="Search grooming guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5EE] border border-[#1B4D31]/10 rounded-full text-xs font-sans text-[#143D28] placeholder-[#637D6C] focus:outline-none focus:ring-2 focus:ring-[#2D7D52]/30 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED STORY (Magazine Spotlight)
      ========================================================= */}
      {featuredPost && (
        <section className="px-4 sm:px-8 max-w-7xl mx-auto relative z-10 mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 border border-[#1B4D31]/12 shadow-[0_16px_45px_rgba(27,77,49,0.06)] hover:shadow-[0_22px_55px_rgba(27,77,49,0.1)] transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Featured Image */}
              <div className="lg:col-span-6">
                <Link to={`/blog/${featuredPost.slug}`} className="block relative group overflow-hidden rounded-[20px] shadow-sm">
                  <div className="w-full h-72 sm:h-96 bg-[#F7F5EE] overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#1B4D31] border border-[#1B4D31]/10 shadow-xs">
                    ★ Featured Story
                  </div>
                </Link>
              </div>

              {/* Featured Info */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3 text-xs font-semibold text-[#637D6C]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#2D7D52]" />
                    {featuredPost.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[#2D7D52]" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <Link to={`/blog/${featuredPost.slug}`} className="block group">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143D28] group-hover:text-[#2D7D52] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#143D28] hover:bg-[#2D7D52] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ========================================================
          ARTICLE GRID
      ========================================================= */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto relative z-10 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28]">
              {selectedCategory === 'All' ? 'All Grooming Guides' : `${selectedCategory} Guides`}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#637D6C] mt-1">
              Showing {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 text-center border border-[#1B4D31]/10 max-w-xl mx-auto my-12">
            <BookOpen size={36} className="mx-auto text-[#2D7D52] mb-4 opacity-60" />
            <h3 className="font-serif text-2xl font-bold text-[#143D28] mb-2">No Articles Found</h3>
            <p className="font-sans text-sm text-[#4A6352] mb-6">
              We couldn't find any guides matching "{searchQuery}". Try selecting another category or clear your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2.5 rounded-full bg-[#143D28] text-white font-bold text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(gridPosts.length > 0 ? gridPosts : filteredPosts).map((post, idx) => (
              <motion.div
                key={post.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                className="bg-white rounded-[26px] p-5 sm:p-6 border border-[#1B4D31]/12 shadow-[0_12px_36px_rgba(27,77,49,0.05)] hover:shadow-[0_20px_50px_rgba(27,77,49,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link to={`/blog/${post.slug}`} className="block relative rounded-[18px] overflow-hidden mb-5 aspect-[16/10] bg-[#F7F5EE]">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#1B4D31] border border-[#1B4D31]/10">
                        {post.category}
                      </span>
                    )}
                  </Link>

                  {/* Date & Read time */}
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#637D6C] mb-2.5">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <Link to={`/blog/${post.slug}`} className="block">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#143D28] group-hover:text-[#2D7D52] transition-colors leading-snug line-clamp-2 mb-2.5">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="font-sans text-xs sm:text-sm text-[#4A6352] line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 border-t border-[#1B4D31]/8 flex items-center justify-between text-xs font-bold text-[#143D28] group-hover:text-[#2D7D52] transition-colors">
                  <span>Read Full Guide</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          NEWSLETTER / CONCIERGE SIGNUP BANNER
      ========================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-[0_18px_50px_rgba(27,77,49,0.06)] border border-[#1B4D31]/12">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <Sparkles size={14} className="text-[#2D7D52]" />
              <span>Grooming Knowledge in Your Inbox</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
              Master Your Facial Grooming Ritual
            </h2>

            <p className="font-sans text-xs sm:text-base text-[#4A6352] leading-relaxed max-w-xl mx-auto">
              Subscribe to the DailyFix Journal for monthly expert shade guides, beard care secrets, and early VIP access to product drops.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to the DailyFix Journal!');
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto w-full"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 rounded-full bg-[#F7F5EE] border border-[#1B4D31]/15 text-[#143D28] placeholder-[#637D6C] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D52]/30"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#2D7D52] to-[#1B4D31] hover:brightness-110 text-white font-bold text-sm shadow-md hover:scale-105 transition-all whitespace-nowrap"
              >
                Join Journal
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
