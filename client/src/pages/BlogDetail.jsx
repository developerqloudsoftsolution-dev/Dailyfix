import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ChevronRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getPostBySlug, getRelatedPosts } from '../data/blogData.js';

const BlogDetail = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const slug = useMemo(() => {
    const match = pathname.match(/^\/blog\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }, [pathname]);

  const post = slug ? getPostBySlug(slug) : null;
  const relatedPosts = post ? getRelatedPosts(slug, 3) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = post ? `${post.title} | DailyFix Journal` : 'Article Not Found | DailyFix';
    return () => {
      document.title = originalTitle;
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-20 bg-[#F7F5EE] px-6">
        <div className="text-center max-w-md bg-white rounded-[28px] p-8 sm:p-10 border border-[#1B4D31]/12 shadow-sm">
          <h1 className="font-serif text-3xl font-bold text-[#143D28] mb-3">Article Not Found</h1>
          <p className="font-sans text-sm text-[#4A6352] mb-6 leading-relaxed">
            The grooming guide you are looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#143D28] hover:bg-[#2D7D52] text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft size={16} />
            <span>Return to Journal</span>
          </button>
        </div>
      </div>
    );
  }

  const renderContent = (blocks) => {
    if (!Array.isArray(blocks)) return null;

    return blocks.map((block, idx) => {
      switch (block.type) {
        case 'heading':
          return (
            <h2
              key={idx}
              className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28] mt-10 sm:mt-12 mb-4 leading-snug"
            >
              {block.text}
            </h2>
          );
        case 'paragraph':
          return (
            <p
              key={idx}
              className="font-sans text-base sm:text-lg text-[#334D3D] leading-relaxed mb-6 font-normal"
            >
              {block.text}
            </p>
          );
        case 'list':
          return (
            <ul key={idx} className="space-y-3.5 mb-8 my-4 pl-1">
              {block.items?.map((item, i) => (
                <li key={i} className="font-sans text-base sm:text-lg text-[#334D3D] leading-relaxed flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={14} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        case 'quote':
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-[#2D7D52] pl-6 my-8 py-4 bg-white/90 rounded-r-2xl pr-6 shadow-xs border border-[#1B4D31]/8"
            >
              <p className="font-serif text-lg sm:text-xl italic font-bold text-[#143D28] leading-relaxed">
                "{block.text}"
              </p>
            </blockquote>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="bg-[#F7F5EE] min-h-screen relative overflow-hidden pb-20">
      {/* Decorative ambient subtle green glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#2D7D52]/10 via-[#4EA874]/6 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-[#2D7D52]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================
          ARTICLE HEADER & BREADCRUMB
      ========================================================= */}
      <header className="relative pt-40 pb-10 sm:pt-48 lg:pt-52 sm:pb-14 px-4 sm:px-8 max-w-4xl mx-auto z-10">
        <div className="space-y-5">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2D7D52] hover:text-[#143D28] transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            <span>Back to All Grooming Guides</span>
          </Link>

          {post.category && (
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#EAF5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider border border-[#2D7D52]/20">
                {post.category}
              </span>
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#637D6C] pt-2 border-b border-[#1B4D31]/10 pb-6">
            <span className="flex items-center gap-1.5 text-[#143D28]">
              <User size={14} className="text-[#2D7D52]" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#2D7D52]" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#2D7D52]" />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================
          FEATURED HERO IMAGE
      ========================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-12 relative z-10">
        <div className="w-full h-[280px] sm:h-[420px] md:h-[480px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_16px_45px_rgba(27,77,49,0.08)] border border-[#1B4D31]/12 bg-black">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ========================================================
          MAIN ARTICLE BODY
      ========================================================= */}
      <article className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-12 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)]">
          {renderContent(post.content)}

          {/* Share & Feedback Box */}
          <div className="mt-12 pt-6 border-t border-[#1B4D31]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#143D28]">
              <Sparkles size={16} className="text-[#2D7D52]" />
              <span>Tested & Approved by DailyFix Master Barbers</span>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Guide link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7F5EE] hover:bg-[#EAF5EE] text-[#143D28] text-xs font-bold transition-all border border-[#1B4D31]/10"
            >
              <Share2 size={13} />
              <span>Share Guide</span>
            </button>
          </div>
        </div>

        {/* Author Capsule */}
        <div className="mt-10 p-6 sm:p-8 bg-white rounded-[26px] border border-[#1B4D31]/10 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D7D52] to-[#143D28] text-white flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0 shadow-xs">
            {post.author ? post.author.charAt(0) : 'D'}
          </div>
          <div className="text-center sm:text-left space-y-1.5">
            <h3 className="font-serif text-xl font-bold text-[#143D28]">{post.author}</h3>
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#2D7D52]">
              Beard Grooming Specialist • DailyFix
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#4A6352] leading-relaxed pt-1">
              Committed to science-backed botanical grooming advice and honest formulation insights to help Indian gentlemen look sharp with zero effort.
            </p>
          </div>
        </div>
      </article>

      {/* ========================================================
          RELATED ARTICLES
      ========================================================= */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-8 relative z-10 pt-14 border-t border-[#1B4D31]/10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-[#2D7D52]" />
                <span>Keep Reading</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28]">
                Related Grooming Guides
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D7D52] hover:text-[#143D28] transition-colors"
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp, idx) => (
              <Link
                key={rp.id || idx}
                to={`/blog/${rp.slug}`}
                className="bg-white rounded-[24px] p-5 border border-[#1B4D31]/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] rounded-[16px] overflow-hidden mb-4 bg-[#F7F5EE]">
                    <img
                      src={rp.image}
                      alt={rp.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-[#637D6C] mb-2">
                    {rp.date} • {rp.readTime}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#143D28] group-hover:text-[#2D7D52] transition-colors line-clamp-2 mb-2 leading-snug">
                    {rp.title}
                  </h3>
                  <p className="font-sans text-xs text-[#4A6352] line-clamp-2 leading-relaxed">
                    {rp.excerpt}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-[#1B4D31]/8 flex items-center justify-between text-xs font-bold text-[#143D28] group-hover:text-[#2D7D52]">
                  <span>Read Guide</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
