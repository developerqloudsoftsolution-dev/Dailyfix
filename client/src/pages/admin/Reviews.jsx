import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Trash2,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Award,
  ThumbsUp,
  X,
  Send,
  Eye,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Layers
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const StarRating = ({ rating = 5, size = 15 }) => (
  <div className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={
          rating >= star
            ? 'fill-amber-400 text-amber-400'
            : rating >= star - 0.5
            ? 'fill-amber-300 text-amber-400'
            : 'fill-slate-200 text-slate-300'
        }
      />
    ))}
  </div>
);

const PRODUCT_SHADES = [
  {
    slug: 'natural-black-beard-colour',
    name: 'Natural Black',
    fullName: "Dailyfix Men's Beard Colour – Natural Black",
    colorHex: '#1c1917',
    badgeClass: 'bg-stone-900 text-white border-stone-800'
  },
  {
    slug: 'black-brown-beard-colour',
    name: 'Black Brown',
    fullName: "Dailyfix Men's Beard Colour – Black Brown",
    colorHex: '#35251d',
    badgeClass: 'bg-[#35251d] text-white border-amber-950'
  },
  {
    slug: 'dark-brown-beard-colour',
    name: 'Dark Brown',
    fullName: "Dailyfix Men's Beard Colour – Dark Brown",
    colorHex: '#4e3523',
    badgeClass: 'bg-[#4e3523] text-white border-amber-900'
  }
];

const AdminReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProductParam = searchParams.get('productSlug') || searchParams.get('shade') || 'All';

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalAll: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    fiveStarCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Active Product Tab ('All' | 'natural-black-beard-colour' | 'black-brown-beard-colour' | 'dark-brown-beard-colour')
  const [activeProductTab, setActiveProductTab] = useState(initialProductParam);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Form State for Adding Review
  const [formData, setFormData] = useState({
    productSlug: 'natural-black-beard-colour',
    productName: "Dailyfix Men's Beard Colour – Natural Black",
    author: '',
    email: '',
    rating: 5,
    headline: '',
    content: '',
    shade: 'Natural Black',
    status: 'Approved',
    isFeatured: false,
    skinType: 'Sensitive Skin',
    usageDuration: 'Using for 3 months',
    location: 'Mumbai, MH'
  });

  const fetchAdminReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (ratingFilter !== 'All') params.append('rating', ratingFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/reviews/admin?${params.toString()}`);
      if (res.data?.success) {
        setReviews(res.data.reviews || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin reviews:', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, [statusFilter, ratingFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminReviews();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Count reviews per product
  const productCounts = useMemo(() => {
    const counts = {
      'All': reviews.length,
      'natural-black-beard-colour': 0,
      'black-brown-beard-colour': 0,
      'dark-brown-beard-colour': 0
    };
    reviews.forEach((r) => {
      const slug = r.productSlug || 'natural-black-beard-colour';
      if (counts[slug] !== undefined) {
        counts[slug]++;
      }
    });
    return counts;
  }, [reviews]);

  // Filter reviews based on active product tab
  const displayedReviews = useMemo(() => {
    if (activeProductTab === 'All') return reviews;
    return reviews.filter((r) => (r.productSlug || 'natural-black-beard-colour') === activeProductTab);
  }, [reviews, activeProductTab]);

  // Grouped reviews when "All" tab is active
  const groupedByProduct = useMemo(() => {
    const groups = {};
    PRODUCT_SHADES.forEach((p) => {
      groups[p.slug] = {
        meta: p,
        items: reviews.filter((r) => (r.productSlug || 'natural-black-beard-colour') === p.slug)
      };
    });
    return groups;
  }, [reviews]);

  // Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/reviews/admin/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Review marked as ${newStatus}`);
        setReviews((prev) =>
          prev.map((r) => ((r._id === id || r.id === id) ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  // Toggle Feature
  const handleToggleFeature = async (id) => {
    try {
      const res = await api.put(`/reviews/admin/${id}/feature`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setReviews((prev) =>
          prev.map((r) =>
            (r._id === id || r.id === id) ? { ...r, isFeatured: res.data.isFeatured } : r
          )
        );
      }
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  // Delete Review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;

    try {
      const res = await api.delete(`/reviews/admin/${id}`);
      if (res.data?.success) {
        toast.success('Review deleted successfully');
        setReviews((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  // Re-seed Curated Reviews
  const handleSeedDummy = async () => {
    if (!window.confirm('This will seed the standard curated positive reviews for all 3 shades. Continue?')) {
      return;
    }
    setIsSeeding(true);
    try {
      const res = await api.post('/reviews/admin/seed-dummy', { replaceAll: false });
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchAdminReviews();
      }
    } catch (err) {
      toast.error('Failed to seed reviews');
    } finally {
      setIsSeeding(false);
    }
  };

  // Open add review modal pre-selected for a specific product
  const handleOpenAddModal = (productSlug = 'natural-black-beard-colour') => {
    const product = PRODUCT_SHADES.find((p) => p.slug === productSlug) || PRODUCT_SHADES[0];
    setFormData({
      productSlug: product.slug,
      productName: product.fullName,
      author: '',
      email: '',
      rating: 5,
      headline: '',
      content: '',
      shade: product.name,
      status: 'Approved',
      isFeatured: false,
      skinType: 'Sensitive Skin',
      usageDuration: 'Using for 3 months',
      location: 'Mumbai, MH'
    });
    setIsAddModalOpen(true);
  };

  // Add Review Submit
  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.headline.trim() || !formData.content.trim()) {
      toast.error('Please enter Author Name, Headline, and Content');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        ...formData,
        verified: true
      });
      if (res.data?.success) {
        toast.success('New review created successfully!');
        setIsAddModalOpen(false);
        fetchAdminReviews();
      }
    } catch (err) {
      toast.error('Failed to create review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Table Component for any list of reviews
  const renderReviewTable = (reviewList, productMeta = null) => {
    if (reviewList.length === 0) {
      return (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No reviews found for this product</h4>
          <p className="text-xs text-slate-400 mt-1">Add a new verified review to boost social proof.</p>
          <button
            onClick={() => handleOpenAddModal(productMeta?.slug || 'natural-black-beard-colour')}
            className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Review
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Reviewer</th>
              <th className="py-3.5 px-4">Product / Shade</th>
              <th className="py-3.5 px-4">Rating & Testimonial</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviewList.map((rev) => {
              const revId = rev._id || rev.id;
              const shadeObj = PRODUCT_SHADES.find((p) => p.slug === rev.productSlug) || PRODUCT_SHADES[0];

              return (
                <tr key={revId} className="hover:bg-slate-50/70 transition-colors">
                  {/* Reviewer Info */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-extrabold text-slate-900 text-sm">{rev.author}</div>
                    {rev.email && <div className="text-[11px] text-slate-400">{rev.email}</div>}
                    {rev.location && <div className="text-[11px] text-slate-500 font-medium">{rev.location}</div>}
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 mt-1">
                        <CheckCircle2 size={10} />
                        Verified Buyer
                      </span>
                    )}
                  </td>

                  {/* Product / Shade Badge */}
                  <td className="py-4 px-4 align-top">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: shadeObj.colorHex }}
                      />
                      <span>{rev.shade || shadeObj.name}</span>
                    </div>
                  </td>

                  {/* Rating & Content */}
                  <td className="py-4 px-4 align-top max-w-md">
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={rev.rating || 5} size={14} />
                      <span className="font-extrabold text-slate-900">{rev.rating || 5}.0</span>
                      {rev.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{rev.headline}</p>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{rev.content}</p>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4 align-top">
                    <select
                      value={rev.status || 'Approved'}
                      onChange={(e) => handleStatusChange(revId, e.target.value)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                        rev.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : rev.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 align-top text-slate-500 whitespace-nowrap">
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : rev.date || 'Recent'}
                  </td>

                  {/* Actions (Feature, View, Delete) */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleFeature(revId)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          rev.isFeatured
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border-slate-200'
                        }`}
                        title={rev.isFeatured ? 'Unfeature' : 'Feature on Product Page'}
                      >
                        <Star size={14} className={rev.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReview(rev);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                        title="View Full Review"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteReview(revId)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Delete Review Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Star size={20} className="fill-amber-500 text-amber-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Product Reviews Management</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Moderate, organize, and delete customer reviews separated by product shade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDummy}
            disabled={isSeeding}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Sparkles size={15} className="text-amber-500" />
            {isSeeding ? 'Seeding...' : 'Seed Positive Reviews'}
          </button>

          <button
            onClick={() => handleOpenAddModal(activeProductTab !== 'All' ? activeProductTab : 'natural-black-beard-colour')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Add Review
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: stats.totalAll || reviews.length, color: 'text-slate-900', bg: 'bg-white', icon: MessageSquare },
          { label: 'Approved Live', value: stats.approvedCount, color: 'text-emerald-600', bg: 'bg-emerald-50/60', icon: CheckCircle2 },
          { label: 'Pending Review', value: stats.pendingCount, color: 'text-amber-600', bg: 'bg-amber-50/60', icon: Clock },
          { label: '5-Star Ratings', value: stats.fiveStarCount, color: 'text-amber-500', bg: 'bg-amber-50/40', icon: Star }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`${kpi.bg} p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between`}>
              <div>
                <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                <p className={`text-2xl font-black ${kpi.color} mt-1`}>{kpi.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-slate-700">
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================== SEPARATE PRODUCT TABS ===================== */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
        {/* All Products Tab */}
        <button
          onClick={() => {
            setActiveProductTab('All');
            setSearchParams({});
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeProductTab === 'All'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Layers size={15} />
          <span>All Products Separated</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeProductTab === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {productCounts['All']}
          </span>
        </button>

        {/* Product Shade Tabs */}
        {PRODUCT_SHADES.map((prod) => {
          const isSelected = activeProductTab === prod.slug;
          const count = productCounts[prod.slug] || 0;

          return (
            <button
              key={prod.slug}
              onClick={() => {
                setActiveProductTab(prod.slug);
                setSearchParams({ productSlug: prod.slug });
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-white/50 shadow-xs flex-shrink-0"
                style={{ backgroundColor: prod.colorHex }}
              />
              <span>{prod.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Status Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved Only</option>
              <option value="Pending">Pending Moderation</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviewer or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            onClick={fetchAdminReviews}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ===================== REVIEWS LISTING (GROUPED OR FILTERED) ===================== */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 mb-3" />
          <p className="text-xs text-slate-500">Loading reviews...</p>
        </div>
      ) : activeProductTab === 'All' ? (
        /* GROUPED PRODUCT VIEW (Distinct card per product) */
        <div className="space-y-6">
          {PRODUCT_SHADES.map((prod) => {
            const group = groupedByProduct[prod.slug];
            const items = group?.items || [];

            return (
              <div key={prod.slug} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Product Section Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/60 shadow-xs flex items-center justify-center text-white"
                      style={{ backgroundColor: prod.colorHex }}
                    >
                      <Star size={13} className="fill-white text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {prod.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {items.length} total reviews • {items.filter(i => i.status === 'Approved').length} live on store
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveProductTab(prod.slug);
                        setSearchParams({ productSlug: prod.slug });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      View Only This Shade
                    </button>

                    <button
                      onClick={() => handleOpenAddModal(prod.slug)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus size={13} /> Add Review
                    </button>
                  </div>
                </div>

                {/* Table for this product */}
                {renderReviewTable(items, prod)}
              </div>
            );
          })}
        </div>
      ) : (
        /* SINGLE SELECTED PRODUCT VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {(() => {
            const currentProd = PRODUCT_SHADES.find((p) => p.slug === activeProductTab) || PRODUCT_SHADES[0];
            return (
              <>
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/60 shadow-xs flex items-center justify-center text-white"
                      style={{ backgroundColor: currentProd.colorHex }}
                    >
                      <Star size={13} className="fill-white text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {currentProd.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Showing {displayedReviews.length} reviews for this product
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(currentProd.slug)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Review for {currentProd.name}
                  </button>
                </div>

                {renderReviewTable(displayedReviews, currentProd)}
              </>
            );
          })()}
        </div>
      )}

      {/* ===================== ADD REVIEW MODAL ===================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Add Product Review</h3>
              <p className="text-xs text-slate-500 mb-6">Create a verified customer review for this product</p>

              <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                {/* Product / Shade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Product *</label>
                    <select
                      value={formData.productSlug}
                      onChange={(e) => {
                        const val = e.target.value;
                        const prod = PRODUCT_SHADES.find((p) => p.slug === val) || PRODUCT_SHADES[0];
                        setFormData({
                          ...formData,
                          productSlug: prod.slug,
                          productName: prod.fullName,
                          shade: prod.name
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                    >
                      {PRODUCT_SHADES.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name} ({p.fullName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rating *</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                    >
                      <option value={5}>★★★★★ 5.0 (Excellent)</option>
                      <option value={4}>★★★★☆ 4.0 (Very Good)</option>
                      <option value={3}>★★★☆☆ 3.0 (Average)</option>
                    </select>
                  </div>
                </div>

                {/* Author Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Reviewer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, MH"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% Grey Coverage with Zero Skin Staining"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Text *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed testimonial on grey coverage, ease of use, ammonia-free formula, skin friendliness..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs leading-relaxed"
                  />
                </div>

                {/* Status & Featured */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Mark as Featured Review</span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Creating...' : 'Save & Publish Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== VIEW DETAIL MODAL ===================== */}
      <AnimatePresence>
        {isDetailModalOpen && selectedReview && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={selectedReview.rating || 5} size={18} />
                <span className="font-extrabold text-slate-900 text-base">{selectedReview.rating}.0</span>
                {selectedReview.isFeatured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                {selectedReview.headline}
              </h3>

              <p className="text-slate-700 text-sm leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {selectedReview.content}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mb-6">
                <div>
                  <span className="font-bold text-slate-400 block">Reviewer</span>
                  <span className="font-bold text-slate-900">{selectedReview.author}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block">Location</span>
                  <span>{selectedReview.location || 'India'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block">Shade</span>
                  <span>{selectedReview.shade || 'Natural Black'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block">Helpful Votes</span>
                  <span>👍 {selectedReview.helpfulCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleDeleteReview(selectedReview._id || selectedReview.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} /> Delete Review
                </button>

                <button
                  onClick={() => {
                    handleStatusChange(selectedReview._id || selectedReview.id, 'Approved');
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  Approve Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviews;
