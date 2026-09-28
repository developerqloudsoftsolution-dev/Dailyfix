import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import styles from './ProductShowcaseSlider.module.css';

// Respected images & product packs
import naturalBlackPoster from '../assets/images/natural-black-poster.jpg';
import shadeBlackImg from '../assets/images/001 Natural black1.png';
import shadeBrownBlackImg from '../assets/images/002 Brown black2.png';
import shadeDarkBrownImg from '../assets/images/003 Drak brown3.png';

const PRODUCTS = [
  {
    id: 'prod-001-poster',
    badge: 'BESTSELLER',
    featureBar: '100% AMMONIA-FREE',
    title: '001 Natural Black Beard Colour',
    subtitle: 'Fast 10-min salon grey coverage, no blue tint',
    image: naturalBlackPoster,
    alt: 'Dailyfix 001 Natural Black Beard Colour',
    rating: '4.9',
    reviews: '1,420',
    oldPrice: '₹599',
    price: 450,
    slug: 'natural-black',
    productData: {
      id: 'natural-black',
      slug: 'natural-black',
      name: 'Dailyfix Beard Colour - Natural Black',
      price: 450,
      image: shadeBlackImg
    }
  },
  {
    id: 'prod-002',
    badge: 'BESTSELLER',
    featureBar: 'NATURAL BLEND',
    title: '002 Black Brown Beard Colour',
    subtitle: 'Balanced transition for naturally textured beards',
    image: shadeBrownBlackImg,
    alt: 'Dailyfix 002 Black Brown Beard Colour',
    rating: '4.8',
    reviews: '560',
    oldPrice: '₹599',
    price: 450,
    slug: 'black-brown',
    productData: {
      id: 'black-brown',
      slug: 'black-brown',
      name: 'Dailyfix Beard Colour - Black Brown',
      price: 450,
      image: shadeBrownBlackImg
    }
  },
  {
    id: 'prod-003',
    badge: 'GENTLEMAN’S CHOICE',
    featureBar: 'WARM DEPTH',
    title: '003 Dark Brown Beard Colour',
    subtitle: 'Subtle, stylish colour for everyday confidence',
    image: shadeDarkBrownImg,
    alt: 'Dailyfix 003 Dark Brown Beard Colour',
    rating: '4.9',
    reviews: '890',
    oldPrice: '₹599',
    price: 450,
    slug: 'dark-brown',
    productData: {
      id: 'dark-brown',
      slug: 'dark-brown',
      name: 'Dailyfix Beard Colour - Dark Brown',
      price: 450,
      image: shadeDarkBrownImg
    }
  },
  {
    id: 'prod-001-pack',
    badge: 'HOT DROP',
    featureBar: 'SALON-GRADE',
    title: '001 Natural Black Product Kit',
    subtitle: 'Complete with gloves, mixing tray & dual brush',
    image: shadeBlackImg,
    alt: 'Dailyfix 001 Natural Black Complete Kit',
    rating: '4.9',
    reviews: '1,150',
    oldPrice: '₹599',
    price: 450,
    slug: 'natural-black',
    productData: {
      id: 'natural-black',
      slug: 'natural-black',
      name: 'Dailyfix Beard Colour - Natural Black',
      price: 450,
      image: shadeBlackImg
    }
  }
];

const ProductShowcaseSlider = ({ onAddToCart, onAddTrioToCart }) => {
  const trackRef = useRef(null);
  const { addToCart } = useCart();

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleCardAddToCart = (prod) => {
    if (prod.productData) {
      if (onAddToCart) {
        onAddToCart(prod.productData);
      } else {
        addToCart(prod.productData, 1);
        toast.success(`${prod.productData.name} added to cart!`, {
          style: {
            background: '#143D28',
            color: '#FFFFFF',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 18px'
          },
          iconTheme: {
            primary: '#4EA874',
            secondary: '#143D28'
          }
        });
      }
    }
  };

  return (
    <section id="showcase-slider" className={styles.sectionWrapper}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.pillTag}>
            <i className="fa-solid fa-crown" />
            <span>Signature Collection</span>
          </div>

          <h2 className={styles.sectionTitle}>Our Best Selling Shades</h2>
          <p className={styles.sectionSubtitle}>
            100% ammonia-free beard colour crafted with botanical olive extract for natural, salon-grade coverage.
          </p>
        </div>

        {/* Carousel Container with Floating Navigation Arrows */}
        <div className={styles.carouselWrapper}>
          <button
            type="button"
            onClick={scrollLeft}
            className={styles.navArrowLeft}
            aria-label="Previous products"
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.8} />
          </button>

          {/* Scrollable Track */}
          <div ref={trackRef} className={styles.cardsTrack}>
            {PRODUCTS.map((prod) => (
              <div key={prod.id} className={styles.productCard}>
                {/* Top Image Stage (Square 1:1) */}
                <div className={styles.imageStage}>
                  {/* Top-Right Badge */}
                  <div className={styles.topBadge}>
                    <i className="fa-regular fa-heart" />
                    <span>{prod.badge}</span>
                  </div>

                  <Link to={`/product/${prod.slug}`}>
                    <img
                      src={prod.image}
                      alt={prod.alt}
                      className={styles.productImage}
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Dark Feature Bar */}
                <div className={styles.featureStrip}>
                  <span>{prod.featureBar}</span>
                </div>

                {/* Info Area */}
                <div className={styles.infoArea}>
                  <div className={styles.titleArea}>
                    <Link
                      to={`/product/${prod.slug}`}
                      className="no-underline"
                    >
                      <h3 className={styles.cardTitle}>{prod.title}</h3>
                    </Link>
                    <p className={styles.cardSubtitle}>{prod.subtitle}</p>
                  </div>

                  <div>
                    {/* Rating & Price Row */}
                    <div className={styles.ratingPriceRow}>
                      <div className={styles.ratingBox}>
                        <i className="fa-solid fa-star" />
                        <span>{prod.rating}</span>
                        <span className={styles.reviewCount}>({prod.reviews})</span>
                      </div>

                      <div className={styles.priceBox}>
                        <span className={styles.oldPrice}>{prod.oldPrice}</span>
                        <span className={styles.currentPrice}>₹{prod.price}</span>
                      </div>
                    </div>

                    {/* Full-Width ADD TO CART Button with Dailyfix Colors */}
                    <button
                      type="button"
                      onClick={() => handleCardAddToCart(prod)}
                      className={styles.addToCartBtn}
                    >
                      <span>ADD TO CART</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            className={styles.navArrowRight}
            aria-label="Next products"
          >
            <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.8} />
          </button>
        </div>

        {/* Centered EXPLORE ALL Button (Dailyfix Signature Styling) */}
        <div className={styles.exploreAllWrapper}>
          <Link to="/shop" className={styles.exploreAllBtn}>
            <span>EXPLORE ALL</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSlider;
