import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductImageSrc } from '../utils/productImages';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleImageError = (e) => {
    if (e.target && !e.target.dataset.fallbackApplied) {
      e.target.dataset.fallbackApplied = '1';
      e.target.src = getProductImageSrc(product);
    }
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group block h-full">
      <div className="bg-white rounded-[28px] border border-[#1B4D31]/12 p-6 sm:p-7 shadow-[0_14px_40px_rgba(27,77,49,0.06)] hover:shadow-[0_22px_52px_rgba(27,77,49,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
          {/* Top Badge & Swatch Indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-[#EAF5EE] text-[#1B4D31]">
              {product.badge || 'Ammonia-Free'}
            </span>
            <div 
              className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
              style={{
                backgroundColor:
                  product.slug?.includes('black-brown') || product.slug?.includes('brown-black')
                    ? '#271D18'
                    : product.slug?.includes('dark-brown')
                    ? '#3E2723'
                    : '#18181B'
              }}
              title={product.name}
            />
          </div>

          {/* Image container */}
          <div className="w-full h-64 sm:h-72 rounded-[22px] bg-gradient-to-b from-[#F7F5EE] to-white border border-[#1B4D31]/5 flex items-center justify-center p-6 mb-5 overflow-hidden">
            <img
              src={getProductImageSrc(product)}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
              className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] group-hover:scale-108 transition-transform duration-500"
            />
          </div>
          
          {/* Content container */}
          <div className="space-y-3 mb-6">
            {/* Star rating snippet */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={13} className="fill-[#2D7D52] text-[#2D7D52]" />
                ))}
              </div>
              <span className="text-xs font-black text-[#143D28]">4.9</span>
              <span className="text-[11px] text-[#637D6C] font-medium">(1,200+ reviews)</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] group-hover:text-[#2D7D52] transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
            
            <p className="font-sans text-[#4A6352] text-xs sm:text-sm leading-relaxed line-clamp-2">
              {product.desc || '10-minute natural gray coverage with olive and taurine nourishment.'}
            </p>
            
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-serif text-2xl font-bold text-[#143D28]">
                ₹{product.price}
              </span>
              <span className="font-sans text-[11px] text-[#637D6C]">
                M.R.P. (Incl. of all taxes)
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#EAF5EE] text-[#143D28] border border-[#2D7D52]/25 hover:bg-[#2D7D52] hover:text-white font-bold py-3.5 px-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xs hover:shadow-[0_6px_20px_rgba(45,125,82,0.25)] text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Bag • ₹{product.price}</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
