import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Youtube, Facebook, Instagram, Linkedin, Search } from 'lucide-react';
import logo from '../assets/images/dailyfix new logo.png';

const Footer = () => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isSample1 = location.pathname === '/sample1';

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order?orderId=${encodeURIComponent(orderId.trim())}`);
      setOrderId('');
    }
  };

  return (
    <footer className="bg-white border-t border-[#1B4D31]/10 text-[#143D28] py-14 px-6 sm:px-8 md:px-12 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Dailyfix"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-[#4A6352] text-sm leading-relaxed">
              Elevating men's daily grooming rituals with clean, skin-friendly botanical formulations and timeless confidence.
            </p>
            <div className="flex gap-2.5 pt-1">
              <motion.a 
                whileHover={{ y: -2 }}
                href="https://www.youtube.com/channel/UC2OE1pPDCj9cWVJ0k9m_ttQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#EAF5EE] text-[#2D7D52] rounded-full flex items-center justify-center hover:bg-[#2D7D52] hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={17} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -2 }}
                href="https://www.facebook.com/share/1JShp38pJT/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#EAF5EE] text-[#2D7D52] rounded-full flex items-center justify-center hover:bg-[#2D7D52] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="https://www.instagram.com/dailyfix_care/"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#EAF5EE] text-[#2D7D52] rounded-full flex items-center justify-center hover:bg-[#2D7D52] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="https://www.linkedin.com/company/daily-fix-care/"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#EAF5EE] text-[#2D7D52] rounded-full flex items-center justify-center hover:bg-[#2D7D52] hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#143D28] tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
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
                    className="text-[#4A6352] hover:text-[#1B4D31] hover:translate-x-1 transition-all duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D52] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Our Products */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#143D28] tracking-tight">
              Shade Portfolio
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/product/natural-black-beard-colour" 
                  className="text-[#4A6352] hover:text-[#1B4D31] hover:translate-x-1 transition-all duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-[#18181B] border border-white shadow-xs" />
                  01 Natural Black
                </Link>
              </li>
              <li>
                <Link 
                  to="/product/dark-brown-beard-colour" 
                  className="text-[#4A6352] hover:text-[#1B4D31] hover:translate-x-1 transition-all duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-[#3E2723] border border-white shadow-xs" />
                  02 Dark Brown
                </Link>
              </li>
              <li>
                <Link 
                  to="/product/black-brown-beard-colour" 
                  className="text-[#4A6352] hover:text-[#1B4D31] hover:translate-x-1 transition-all duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-[#271D18] border border-white shadow-xs" />
                  03 Brown Black
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Track Order */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#143D28] tracking-tight">
              Track Your Order
            </h4>
            <p className="text-xs text-[#637D6C]">
              Enter your tracking or order ID to get live delivery updates.
            </p>
            <form onSubmit={handleTrackOrder} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Waybill / Order ID" 
                  className="w-full px-4 py-2.5 bg-[#F7F5EE] border border-[#1B4D31]/15 rounded-xl text-[#143D28] placeholder-[#637D6C]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D52]/30 focus:border-[#2D7D52] transition-all"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit" 
                className="w-full bg-gradient-to-r from-[#2D7D52] to-[#1B4D31] text-white font-bold py-2.5 rounded-xl shadow-sm hover:brightness-105 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Search size={16} />
                Track Order
              </motion.button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#143D28] tracking-tight">
              Contact & HQ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#4A6352] text-sm">
                <div className="w-8 h-8 bg-[#EAF5EE] text-[#2D7D52] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <span className="leading-relaxed text-xs">
                  Lightbridge, 6th Floor, Hiranandani Business Park, Powai, Mumbai, Maharashtra 400072
                </span>
              </li>
              <li className="flex items-center gap-3 text-[#4A6352] text-sm">
                <div className="w-8 h-8 bg-[#EAF5EE] text-[#2D7D52] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <a 
                  href="mailto:marketing@dailyfixcare.com" 
                  className="hover:text-[#1B4D31] text-xs font-semibold transition-colors"
                >
                  marketing@dailyfixcare.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Trust Watermark & Copyright */}
        <div className="border-t border-[#1B4D31]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#637D6C] text-xs">
            © {new Date().getFullYear()} DailyFix Grooming Essentials. All rights reserved.
          </p>
          
          <div className="flex items-center gap-3 text-xs text-[#637D6C] font-semibold">
            <span>Ammonia-Free</span>
            <span>•</span>
            <span>Cruelty-Free</span>
            <span>•</span>
            <span>Dermatologist Approved</span>
          </div>

          <div className="flex gap-6 text-xs text-[#637D6C]">
            <Link to="/privacy-policy" className="hover:text-[#143D28] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-[#143D28] transition-colors">
              Terms of Service
            </Link>
            <Link to="/admin/login" className="hover:text-[#143D28] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
