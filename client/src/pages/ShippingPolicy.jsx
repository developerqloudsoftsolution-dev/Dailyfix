import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, ShieldCheck, Package, Search, ArrowRight } from 'lucide-react';

const ShippingPolicy = () => {
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
              <Truck size={16} className="text-emerald-600" />
              <span>Fast & Reliable Pan-India Delivery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
              Shipping & Delivery Policy
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              We are committed to delivering your Dailyfix grooming essentials safely, promptly, and in pristine condition across India.
            </p>
          </div>

          {/* Quick Shipping Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">24-48 Hours Dispatch</h3>
              <p className="text-xs text-slate-500">
                Quick fulfillment and dispatch from our Mumbai central warehouse.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Pan-India Reach</h3>
              <p className="text-xs text-slate-500">
                Delivering to 27,000+ pin codes across all states and union territories.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Live Tracking</h3>
              <p className="text-xs text-slate-500">
                Real-time tracking updates sent directly via WhatsApp and SMS.
              </p>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package size={20} className="text-emerald-600" />
                1. Order Processing & Dispatch
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                All confirmed orders are processed and handed over to our logistics partners within 24 to 48 hours. Orders placed on Sundays or public holidays will be dispatched on the next business day.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" />
                2. Estimated Delivery Timelines
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Standard delivery time varies depending on your geographical location:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Location Region</th>
                      <th className="p-3">Estimated Transit Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Mumbai & MMR Region</td>
                      <td className="p-3">1 to 2 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Metro Cities (Delhi NCR, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad)</td>
                      <td className="p-3">2 to 4 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Tier 2 & Tier 3 Cities</td>
                      <td className="p-3">3 to 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">North East, J&K, Remote Pin Codes</td>
                      <td className="p-3">5 to 7 Business Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 italic">
                * Please note delivery timelines may slightly vary during regional holidays, extreme weather events, or high peak festive seasons.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Truck size={20} className="text-emerald-600" />
                3. Shipping Charges
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We offer free standard shipping on eligible promotional offers and combo packs. Standard shipping rates, if applicable, are clearly calculated and displayed at checkout before order confirmation.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                4. Courier Partners & Real-time Tracking
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We partner with India’s leading logistics providers, including <span className="font-semibold text-slate-700">Delhivery</span> and <span className="font-semibold text-slate-700">Ekart Logistics</span>, to guarantee reliable handling and doorstep delivery.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                As soon as your order is dispatched, you will receive an SMS and WhatsApp message with your tracking ID (Waybill number) and a direct tracking link.
              </p>
            </section>

            {/* Section 5 - CTA */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Already placed an order?</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Check live status and location of your parcel with your Order ID or Waybill.
                </p>
              </div>
              <Link
                to="/track-order"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
              >
                <Search size={15} />
                <span>Track Order</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Contact */}
            <div className="pt-4 border-t text-xs text-slate-500">
              For any questions regarding shipping and delivery, please contact our support team at{' '}
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

export default ShippingPolicy;
