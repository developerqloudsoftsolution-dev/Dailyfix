import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, RotateCcw, PackageCheck, Truck, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8 md:px-16 bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Customer Satisfaction Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
              Return & Replacement Policy
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              At Dailyfix, we want you to love your grooming routine. If something isn't right, we're here to help with a simple, hassle-free return and replacement process.
            </p>
          </div>

          {/* Quick Policy Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">7-Day Window</h3>
              <p className="text-xs text-slate-500">
                Initiate returns or replacements within 7 days of order delivery.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Truck size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Doorstep Reverse Pickup</h3>
              <p className="text-xs text-slate-500">
                Complimentary doorstep pickup by our verified courier partners.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <RotateCcw size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Replacement or Refund</h3>
              <p className="text-xs text-slate-500">
                Choose free product replacement or full refund to your account.
              </p>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <PackageCheck size={20} className="text-emerald-600" />
                1. Eligibility for Returns & Replacements
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                You may request a return or replacement under the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-2">
                <li>
                  <span className="font-semibold text-slate-700">Damaged in transit:</span> Product arrived broken, leaking, or with broken seals.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Incorrect Item Received:</span> Wrong shade or different product received than what was ordered.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Defective / Manufacturing Issue:</span> Quality concerns or dispensing pump / bottle defects.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Missing Items:</span> Package received with missing items or accessories.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle size={20} className="text-indigo-600" />
                2. Non-Returnable Conditions
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                For health, safety, and hygiene standards, items cannot be returned if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-2">
                <li>The return request is submitted after the 7-day delivery window has expired.</li>
                <li>The product has been substantially used or tampered with.</li>
                <li>The original packaging, box, or batch number details have been discarded or destroyed.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Truck size={20} className="text-emerald-600" />
                3. How Reverse Pickup Works
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Once your return/replacement request is accepted by our team:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 ml-2">
                <li>Our courier partner (Ekart / Delhivery) will attempt a reverse pickup from your original shipping address within 2-3 business days.</li>
                <li>Please keep the item safely packed in its original box for pickup.</li>
                <li>You will receive SMS and WhatsApp tracking updates throughout the reverse transit.</li>
              </ol>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <RotateCcw size={20} className="text-emerald-600" />
                4. Refund Process & Timelines
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Refunds are processed promptly upon pickup confirmation or receipt of the returned item:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-2">
                <li>
                  <span className="font-semibold text-slate-700">Prepaid Orders (Cards, UPI, Net Banking):</span> Refund will be credited back to your original payment method within 5 to 7 business days.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Cash on Delivery (COD) Orders:</span> Refund will be transferred directly to your provided UPI ID or verified Bank Account within 24 to 48 hours after item verification.
                </li>
              </ul>
            </section>

            {/* Section 5 - CTA */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Need to return or replace an order?</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Submit a quick return or replacement request online with your Order ID.
                </p>
              </div>
              <Link
                to="/return-order"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
              >
                <span>Initiate Return</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Contact */}
            <div className="pt-4 border-t text-xs text-slate-500">
              For any questions regarding our return policy, reach out to us at{' '}
              <a href="mailto:marketing@dailyfixcare.com" className="text-emerald-600 hover:underline font-semibold">
                marketing@dailyfixcare.com
              </a>
              .
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
