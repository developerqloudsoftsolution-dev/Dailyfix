import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  Clock,
  ShieldCheck,
  Leaf,
  MessageCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    id: 'natural-look',
    category: 'Results',
    icon: Sparkles,
    question: 'Will the beard color look natural?',
    answer:
      'Yes, choosing the right shade and applying the product correctly can give your beard a natural and well-groomed appearance.'
  },
  {
    id: 'easy-apply',
    category: 'Application',
    icon: CheckCircle2,
    question: 'Is it easy to apply at home?',
    answer:
      'Yes, beard color can be easy to use at home when the application instructions are followed carefully.'
  },
  {
    id: 'fade-wash',
    category: 'After-Care',
    icon: Clock,
    question: 'Will the color fade after washing my face?',
    answer:
      'Color longevity may depend on the product formula and your washing routine. Follow the recommended after-care instructions for better results.'
  },
  {
    id: 'why-choose',
    category: 'Benefits',
    icon: ShieldCheck,
    question: 'Why should I choose this beard color?',
    answer:
      'Our beard color is designed to help cover grey and white beard hair while giving a neat, confident, and well-groomed appearance.'
  }
];

const CATEGORIES = ['All', 'Results', 'Application', 'After-Care', 'Benefits'];

const HomeFAQ = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [openId, setOpenId] = useState('natural-look'); // First item open by default

  const filteredFaqs =
    activeTab === 'All'
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeTab);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs"
          >
            <HelpCircle size={14} className="text-emerald-600 animate-pulse" />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight"
          >
            Got Questions? We’ve Got Answers.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-base sm:text-lg text-stone-600"
          >
            Everything you need to know about Dailyfix ammonia-free beard colour, shades, application, and results.
          </motion.p>

          {/* Filter Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 bg-white ${isOpen
                    ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                    : 'border-stone-200/90 shadow-soft hover:border-emerald-300 hover:shadow-md'
                  }`}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-700'
                        }`}
                    >
                      <Icon size={19} />
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen
                        ? 'bg-emerald-100 text-emerald-700 rotate-180'
                        : 'bg-stone-100 text-stone-500'
                      }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100/80 mt-1 whitespace-pre-line pl-14 sm:pl-16">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Assistance Help Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-emerald-500/20"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <MessageCircle size={26} />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                Have a specific question about your beard?
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Our grooming specialists are here to help you pick the right shade and application routine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/contact"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              Contact Support
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFAQ;
