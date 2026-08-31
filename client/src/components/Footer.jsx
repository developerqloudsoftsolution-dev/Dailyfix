import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Youtube, Facebook, Instagram, Linkedin, Search } from 'lucide-react';
import logo from '../assets/images/dailyfix new logo.png';

const Footer = () => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order?orderId=${encodeURIComponent(orderId.trim())}`);
      setOrderId('');
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-10 px-8 md:px-10">
      <div className="max-w-9xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-8">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-1">
            <img
              src={logo}
              alt="Dailyfix"
              className="h-12 w-auto"
            />
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium grooming products for the modern man. Enhance your look with our high-quality beard colour and grooming essentials.
            </p>
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ y: -3 }}
                href="https://www.youtube.com/channel/UC2OE1pPDCj9cWVJ0k9m_ttQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all duration-300"
              >
                <Youtube size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="https://www.facebook.com/share/1JShp38pJT/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all duration-300"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://www.instagram.com/dailyfix_care/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all duration-300"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://www.linkedin.com/company/daily-fix-care/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all duration-300"
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4 relative inline-block group">
              Quick Links
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Beard Colour', path: '/shop' },
                { label: 'Track Order', path: '/track-order' },
                { label: 'Return Policy', path: '/return-policy' },
                { label: 'Shipping Policy', path: '/shipping-policy' },
                { label: 'Contact', path: '/contact' },
                { label: 'Store Locator', path: '/store-locator' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-slate-400 hover:text-emerald-400 hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Our Products */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4 relative inline-block group">
              Our Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/product/natural-black-beard-colour" 
                  className="text-slate-400 hover:text-emerald-400 hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Natural Black Beard Colour
                </Link>
              </li>
              <li>
                <Link 
                  to="/product/black-brown-beard-colour" 
                  className="text-slate-400 hover:text-emerald-400 hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Black Brown Beard Colour
                </Link>
              </li>
              <li>
                <Link 
                  to="/product/dark-brown-beard-colour" 
                  className="text-slate-400 hover:text-emerald-400 hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Dark Brown Beard Colour
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Track Order */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4 relative inline-block group">
              Track Your Order
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Waybill / Order ID" 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-800 transition-all flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Track Order
              </motion.button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4 relative inline-block group">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-slate-400 text-sm group">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-all duration-300"
                >
                  <MapPin size={20} className="text-emerald-500" />
                </motion.div>
                <span className="leading-relaxed">
                  Lightbridge, 6th Floor, Hiranandani Business Park, Saki Vihar Road, Tunga Village, Chandivali, Powai, Mumbai, Maharashtra 400072
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm group">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-all duration-300"
                >
                  <Mail size={20} className="text-emerald-500" />
                </motion.div>
                <a 
                  href="mailto:marketing@dailyfixcare.com" 
                  className="hover:text-emerald-400 transition-colors"
                >
                  marketing@dailyfixcare.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 Dailyfix. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/admin/login" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm">
              Admin
            </Link>
            <Link to="/privacy-policy" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
