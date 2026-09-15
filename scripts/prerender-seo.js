import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://dailyfixcare.com';

export const SEO_ROUTES = [
  {
    route: '/',
    title: 'Dailyfix Beard Colour for Men | Ammonia-Free & Natural',
    description: 'Discover Dailyfix Beard Colour for Men – ammonia-free, natural-looking beard colour for beards & sideburns in Natural Black, Black Brown & Dark Brown shades.',
    h1: 'Dailyfix Beard Colour for Men – Ammonia-Free & Natural Beard Hair Colour',
    ogImage: '/images/dailyfix-beard-colour.png',
    sections: [
      {
        h2: '100% Ammonia-Free Botanical Beard Colour for Indian Men',
        p: 'Dailyfix Beard Colour for Men is an innovative, ammonia-free grooming solution specially formulated to deliver natural-looking grey coverage for beards, moustaches, and sideburns in just ten minutes.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Beard Colour for Men - Ammonia-Free Botanical Formula',
          width: 600,
          height: 600
        }
      },
      {
        h2: 'Engineered Specifically for Coarse Facial Hair and Sensitive Skin',
        p: 'Enriched with organic olive extract, taurine, and vital botanical conditioning agents that actively fortify hair strands while preventing skin burning or itching.',
        img: {
          src: '/images/dailyfix-poster.png',
          alt: 'Dailyfix Botanical Grooming Craft and Heritage',
          width: 500,
          height: 600
        }
      },
      {
        h2: 'Signature Three-Shade Beard Colour Collection',
        p: 'Available in 001 Natural Black, 002 Black Brown, and 003 Dark Brown shades specifically calibrated for Indian undertones.',
        img: {
          src: '/images/dailyfix-shades-collection.png',
          alt: 'Dailyfix 3 Signature Shades Collection',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/about',
    title: 'About Dailyfix | Botanical Men’s Grooming & Ammonia-Free Beard Colour',
    description: 'Learn about Dailyfix – redefining modern men’s grooming with botanical formulas that deliver undetectable gray coverage in 10 minutes without burning skin.',
    h1: 'About Dailyfix – Pure Botanical Men’s Grooming',
    ogImage: '/images/dailyfix-poster.png',
    sections: [
      {
        h2: 'Our Heritage & Purpose: Born to Replace Harsh Boxed Dyes',
        p: 'Dailyfix was created with a singular focus: to redefine modern men’s grooming with botanical formulas that deliver undetectable gray coverage in 10 minutes without burning or staining skin.',
        img: {
          src: '/images/dailyfix-poster.png',
          alt: 'Dailyfix Craft and Purpose Poster',
          width: 500,
          height: 600
        }
      },
      {
        h2: 'Precision Formulation for Coarse Facial Hair',
        p: 'Men’s facial hair follicles are thicker and more resilient than scalp hair. Our micro-pigment formula penetrates deeply without ammonia or harsh odors.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Botanical Formulation for Men',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/shop',
    title: 'Shop Beard Colour for Men | Dailyfix Ammonia-Free Shades',
    description: 'Explore the complete Dailyfix Beard Colour collection. 100% ammonia-free shades in Natural Black, Black Brown & Dark Brown with fast 10-minute action.',
    h1: 'Dailyfix Beard Colour Collection for Men',
    ogImage: '/images/dailyfix-shades-collection.png',
    sections: [
      {
        h2: 'Signature 3-Shade Precision Collection',
        p: 'Explore our dermatologically tested shades engineered for Indian skin undertones and coarse beard textures.',
        img: {
          src: '/images/dailyfix-shades-collection.png',
          alt: 'Dailyfix 3 Signature Beard Colour Shades',
          width: 600,
          height: 400
        }
      },
      {
        h2: '001 Natural Black Beard Colour for Men',
        p: 'Deep, authentic coverage designed for men with naturally jet black facial hair. Zero artificial bluish tint.',
        img: {
          src: '/images/natural-black.png',
          alt: 'Dailyfix 001 Natural Black Beard Colour for Men',
          width: 500,
          height: 500
        }
      },
      {
        h2: '002 Black Brown Beard Colour for Men',
        p: 'Harmonious, softer dark tone ideal for warm undertones and natural daylight vibrancy.',
        img: {
          src: '/images/black-brown.png',
          alt: 'Dailyfix 002 Black Brown Beard Colour for Men',
          width: 500,
          height: 500
        }
      },
      {
        h2: '003 Dark Brown Beard Colour for Men',
        p: 'Rich espresso finish that adds depth, definition, and warm masculine texture to your beard.',
        img: {
          src: '/images/dark-brown.png',
          alt: 'Dailyfix 003 Dark Brown Beard Colour for Men',
          width: 500,
          height: 500
        }
      }
    ]
  },
  {
    route: '/beard-colour-for-men',
    title: 'Beard Colour for Men | Ammonia-Free Natural Shades by Dailyfix',
    description: 'Shop Dailyfix Beard Colour for Men. Undetectable gray coverage in just 10 minutes with botanical olive extract and zero ammonia.',
    h1: 'Natural Beard Colour for Men – 100% Ammonia-Free',
    ogImage: '/images/dailyfix-shades-collection.png',
    sections: [
      {
        h2: 'Professional Salon-Grade Results at Home',
        p: 'Formulated for gentlemen who demand authentic grooming without chemical burns or artificial looks.',
        img: {
          src: '/images/dailyfix-shades-collection.png',
          alt: 'Dailyfix Beard Colour for Men Signature Range',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/product/natural-black',
    title: '001 Natural Black Beard Colour for Men | Dailyfix Ammonia-Free',
    description: 'Buy Dailyfix 001 Natural Black Beard Colour for Men. 100% natural-looking grey coverage in 10 minutes with organic olive extract and zero ammonia.',
    h1: 'Dailyfix 001 Natural Black Beard Colour for Men',
    ogImage: '/images/natural-black.png',
    sections: [
      {
        h2: 'Authentic Jet Black Coverage with Zero Bluish Glare',
        p: 'Dailyfix 001 Natural Black provides deep, masculine coverage engineered specifically for jet black and deep charcoal beard hair textures.',
        img: {
          src: '/images/natural-black.png',
          alt: 'Dailyfix 001 Natural Black Beard Colour Bottle and Packaging',
          width: 600,
          height: 600
        }
      },
      {
        h2: '10-Minute Rapid Gray Fusion Formula',
        p: 'Gentle 1:1 cream mix enriched with taurine and botanical olive extract that protects sensitive skin while locking in permanent colour.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Beard Colour Cream and Developer Application',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/product/black-brown',
    title: '002 Black Brown Beard Colour for Men | Dailyfix Ammonia-Free',
    description: 'Buy Dailyfix 002 Black Brown Beard Colour for Men. Soft charcoal undertone with natural sunlight warmth. Ammonia-free 10-minute application.',
    h1: 'Dailyfix 002 Black Brown Beard Colour for Men',
    ogImage: '/images/black-brown.png',
    sections: [
      {
        h2: 'Subtle Charcoal Undertones with Natural Warmth',
        p: 'Dailyfix 002 Black Brown delivers a refined, natural finish for gentlemen whose facial hair carries warm charcoal notes in daylight.',
        img: {
          src: '/images/black-brown.png',
          alt: 'Dailyfix 002 Black Brown Beard Colour Bottle and Packaging',
          width: 600,
          height: 600
        }
      },
      {
        h2: 'Zero Skin Staining & Botanical Defense',
        p: 'Non-drip consistency adheres strictly to facial hair keratin fibers without staining cheeks or hands.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Black Brown Gentle Formulation',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/product/dark-brown',
    title: '003 Dark Brown Beard Colour for Men | Dailyfix Ammonia-Free',
    description: 'Buy Dailyfix 003 Dark Brown Beard Colour for Men. Rich espresso finish that adds depth and definition. 100% ammonia-free and gentle on skin.',
    h1: 'Dailyfix 003 Dark Brown Beard Colour for Men',
    ogImage: '/images/dark-brown.png',
    sections: [
      {
        h2: 'Rich Espresso Finish for Refined Depth',
        p: 'Dailyfix 003 Dark Brown offers a versatile coffee-toned finish that adds depth and definition without looking flat or artificial.',
        img: {
          src: '/images/dark-brown.png',
          alt: 'Dailyfix 003 Dark Brown Beard Colour Bottle and Packaging',
          width: 600,
          height: 600
        }
      },
      {
        h2: 'Nourishing Olive Extract & Taurine Infusion',
        p: 'Infuses coarse facial hair with conditioning botanicals, leaving your beard soft, lustrous, and impeccably defined.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Dark Brown Botanical Ingredients',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/blog',
    title: 'Men’s Beard Grooming Advice & Style Guides | Dailyfix Journal',
    description: 'Expert beard care tutorials, shade selection advice, and botanical grooming science to keep your beard healthy, sharp, and youthful.',
    h1: 'The Dailyfix Journal – Men’s Beard Grooming Advice',
    ogImage: '/images/dailyfix-poster.png',
    sections: [
      {
        h2: 'Grooming Wisdom, Elevated & Refined',
        p: 'Masterclasses, shade matching guidance, and botanical science designed to help the modern Indian gentleman look and feel his absolute best.',
        img: {
          src: '/images/blog-choose-shade.jpg',
          alt: 'Dailyfix Beard Grooming Masterclass and Advice',
          width: 600,
          height: 400
        }
      },
      {
        h2: 'Popular Beard Care & Colour Tutorials',
        p: 'Explore guides on choosing the right shade, avoiding grooming mistakes, and maintaining natural-looking beard hair.',
        img: {
          src: '/images/blog-how-to-apply.jpg',
          alt: 'How to Apply Dailyfix Beard Colour Guide',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/beard-grooming-advice',
    title: 'Men’s Beard Grooming Advice & Style Guides | Dailyfix Journal',
    description: 'Expert beard care tutorials, shade selection advice, and botanical grooming science from Dailyfix Grooming Essentials.',
    h1: 'Expert Men’s Beard Grooming Advice & Guides',
    ogImage: '/images/dailyfix-poster.png',
    sections: [
      {
        h2: 'Essential Beard Care Guides for Modern Gentlemen',
        p: 'Discover comprehensive articles on beard maintenance, gray hair blending, and skin-friendly colouring rituals.',
        img: {
          src: '/images/blog-choose-shade.jpg',
          alt: 'Dailyfix Beard Care Guides',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/blog/choose-right-beard-colour-shade',
    title: 'How to Choose the Right Beard Colour Shade | Dailyfix Journal',
    description: 'Learn how to select the best beard colour shade for your skin undertone and natural hair colour for an undetectable finish.',
    h1: 'How to Choose the Right Beard Colour Shade for Your Skin Tone',
    ogImage: '/images/blog-choose-shade.jpg',
    sections: [
      {
        h2: 'Match Your Skin Undertones with Confidence',
        p: 'A shade that complements your skin undertone provides a distinguished, authentic look that looks completely natural under sunlight.',
        img: {
          src: '/images/blog-choose-shade.jpg',
          alt: 'Guide to Choosing the Right Beard Colour Shade',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/blog/10-beard-grooming-mistakes',
    title: '10 Beard Grooming Mistakes to Avoid in 2026 | Dailyfix Journal',
    description: 'Common beard grooming mistakes men make and how to correct them for a healthier, softer, and more attractive beard.',
    h1: '10 Beard Grooming Mistakes to Avoid in 2026',
    ogImage: '/images/dailyfix-poster.png',
    sections: [
      {
        h2: 'Fixing Routine Errors for a Better Beard',
        p: 'Learn why trimming wet hair, skipping conditioning oils, and using aggressive box dyes can ruin your facial hair health.',
        img: {
          src: '/images/dailyfix-poster.png',
          alt: '10 Beard Grooming Mistakes Guide',
          width: 500,
          height: 600
        }
      }
    ]
  },
  {
    route: '/blog/grey-beard-not-anymore-black-brown',
    title: 'Grey Beard? Not Anymore with Black Brown | Dailyfix Journal',
    description: 'How Dailyfix Black Brown provides seamless gray coverage with natural charcoal undertones for modern men.',
    h1: 'Grey Beard? Not Anymore: Transform with Black Brown',
    ogImage: '/images/black-brown.png',
    sections: [
      {
        h2: 'Natural Transition for Indian Beard Textures',
        p: 'Black Brown offers a softer, more dimensional alternative to harsh pitch-black box dyes for authentic grey blending.',
        img: {
          src: '/images/black-brown.png',
          alt: 'Dailyfix 002 Black Brown Beard Colour',
          width: 500,
          height: 500
        }
      }
    ]
  },
  {
    route: '/blog/ammonia-free-beard-colour-benefits',
    title: 'Benefits of Ammonia-Free Beard Colour | Dailyfix Journal',
    description: 'Why ammonia-free beard colour is essential for sensitive facial skin, preventing chemical burning and skin irritation.',
    h1: 'The Crucial Benefits of Ammonia-Free Beard Colour',
    ogImage: '/images/dailyfix-beard-colour.png',
    sections: [
      {
        h2: 'Protecting Facial Skin Keratin and Lipids',
        p: 'Ammonia causes swelling and skin irritation. Our ammonia-free formula uses gentle botanical carriers that preserve skin comfort.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Ammonia-Free Beard Colour Benefits',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/blog/how-to-apply-dailyfix-beard-colour',
    title: 'How to Apply Dailyfix Beard Colour in 10 Minutes | Dailyfix Journal',
    description: 'Step-by-step masterclass on mixing and applying Dailyfix Beard Colour for flawless, salon-grade coverage at home.',
    h1: 'How to Apply Dailyfix Beard Colour in Just 10 Minutes',
    ogImage: '/images/blog-how-to-apply.jpg',
    sections: [
      {
        h2: 'Simple 1:1 Mixing and Precision Brush Application',
        p: 'Follow our step-by-step ritual to apply cream colourant evenly across sideburns, moustache, and goatee without staining skin.',
        img: {
          src: '/images/blog-how-to-apply.jpg',
          alt: 'Step by Step Dailyfix Application Guide',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/blog/15-minute-hack-younger-looking-beard',
    title: 'The 15-Minute Hack for a Younger-Looking Beard | Dailyfix Journal',
    description: 'Quick grooming rituals that instantly refresh your facial appearance and restore youthful beard vitality.',
    h1: 'The 15-Minute Ritual for a Younger-Looking Beard',
    ogImage: '/images/blog-younger-looking.jpg',
    sections: [
      {
        h2: 'Quick Grooming Upgrades with Maximum Impact',
        p: 'Combining gentle botanical beard colouring with precision line detailing instantly shaves years off your appearance.',
        img: {
          src: '/images/blog-younger-looking.jpg',
          alt: 'Younger Looking Beard Ritual',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/blog/the-perfect-beard-color-dark-brown',
    title: 'The Perfect Beard Color: Dark Brown | Dailyfix Journal',
    description: 'Why Dark Brown is the gentleman’s choice for versatile, sophisticated, and natural beard styling.',
    h1: 'The Perfect Beard Color: Why Dark Brown Stands Out',
    ogImage: '/images/blog-perfect-color.jpg',
    sections: [
      {
        h2: 'Sophisticated Espresso Depth for Modern Gentlemen',
        p: 'Dark Brown creates a textured, elegant finish that highlights facial bone structure with warmth and dimension.',
        img: {
          src: '/images/blog-perfect-color.jpg',
          alt: 'Dailyfix 003 Dark Brown Beard Colour',
          width: 600,
          height: 400
        }
      }
    ]
  },
  {
    route: '/contact',
    title: 'Contact Us | Dailyfix Grooming Customer Support',
    description: 'Get in touch with Dailyfix Grooming. Reach our support team via email, WhatsApp, or phone for orders and grooming advice.',
    h1: 'Contact Dailyfix Grooming Support',
    ogImage: '/images/dailyfix-beard-colour.png',
    sections: [
      {
        h2: 'We are Here to Assist You',
        p: 'Have questions about shade matching, your shipment, or application techniques? Our grooming concierges are ready to help.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Customer Support Concierge',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/store-locator',
    title: 'Store Locator | Find Dailyfix Beard Colour Near You',
    description: 'Find authorized retail outlets and salon partners stocking Dailyfix Beard Colour across India.',
    h1: 'Dailyfix Authorized Store & Salon Network',
    ogImage: '/images/dailyfix-poster.png',
    sections: [
      {
        h2: 'Find Dailyfix Products at Premium Retail Locations',
        p: 'Locate partner barbershops and grooming stores carrying our complete ammonia-free beard colour range.',
        img: {
          src: '/images/dailyfix-poster.png',
          alt: 'Dailyfix Store Locator',
          width: 500,
          height: 600
        }
      }
    ]
  },
  {
    route: '/beard-oil',
    title: 'Botanical Beard Oil | Dailyfix Facial Hair Care',
    description: 'Discover Dailyfix Botanical Beard Oil formulated with cold-pressed natural oils to hydrate, condition, and strengthen facial hair.',
    h1: 'Dailyfix Botanical Nourishing Beard Oil',
    ogImage: '/images/dailyfix-poster.png',
    sections: [
      {
        h2: 'Deep Hydration for Coarse Facial Hair and Skin',
        p: 'Formulated with lightweight botanical oils to prevent beard itch, eliminate flakes, and impart a healthy, masculine sheen.',
        img: {
          src: '/images/dailyfix-poster.png',
          alt: 'Dailyfix Botanical Beard Care',
          width: 500,
          height: 600
        }
      }
    ]
  },
  {
    route: '/privacy-policy',
    title: 'Privacy Policy | Dailyfix Grooming Essentials',
    description: 'Read the Dailyfix Privacy Policy. Learn how we protect your personal data, ensure secure payments, and maintain privacy.',
    h1: 'Privacy Policy – Dailyfix Grooming Essentials',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Our Commitment to Data Protection and Security',
        p: 'At Dailyfix, we respect your confidentiality and ensure that all customer information is handled strictly in accordance with digital data privacy standards.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Secure Shopping and Privacy',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/terms-of-service',
    title: 'Terms of Service | Dailyfix Grooming Essentials',
    description: 'Review the terms and conditions governing the purchase and use of Dailyfix Grooming Essentials products and services.',
    h1: 'Terms of Service – Dailyfix Grooming Essentials',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Website Terms and Conditions of Sale',
        p: 'Governing user agreements, order processing, warranty representations, and commercial terms for Dailyfix customers.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Terms of Service',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/terms-and-conditions',
    title: 'Terms and Conditions | Dailyfix Grooming Essentials',
    description: 'Official terms and conditions for purchasing from Dailyfix Grooming Essentials.',
    h1: 'Terms and Conditions – Dailyfix Grooming Essentials',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Official Terms of Purchase',
        p: 'Please review these terms before purchasing Dailyfix products.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Terms and Conditions',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/return-policy',
    title: 'Refund & Cancellation Policy | Dailyfix Grooming Essentials',
    description: 'Learn about the Dailyfix returns, cancellation, and refund process. Hassle-free support for all orders.',
    h1: 'Refund, Return & Cancellation Policy',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Customer Satisfaction Guarantee',
        p: 'We strive for 100% satisfaction with every Dailyfix grooming order. Discover our hassle-free return and replacement guidelines.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Customer Satisfaction and Refund Guarantee',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/refund-cancellation-policy',
    title: 'Refund & Cancellation Policy | Dailyfix Grooming Essentials',
    description: 'Learn about the Dailyfix returns, cancellation, and refund process.',
    h1: 'Refund & Cancellation Policy',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Customer Satisfaction Guarantee',
        p: 'Guidelines on cancellations, damaged package replacements, and refunds.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Cancellation and Refund Policy',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/shipping-policy',
    title: 'Shipping & Delivery Policy | Dailyfix Grooming Essentials',
    description: 'Information regarding Dailyfix shipping speeds, nationwide delivery couriers, tracking, and cash on delivery availability.',
    h1: 'Shipping & Delivery Policy – Dailyfix Grooming Essentials',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Nationwide Express Shipping Across India',
        p: 'Dailyfix partners with premier courier networks (Delhivery and Ekart) to ensure prompt delivery across all Indian pin codes.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Nationwide Express Shipping',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/shipping-delivery-policy',
    title: 'Shipping & Delivery Policy | Dailyfix Grooming Essentials',
    description: 'Shipping timelines and courier details for Dailyfix orders.',
    h1: 'Shipping & Delivery Policy',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Express Delivery Guidelines',
        p: 'Orders dispatched within 24 hours with live real-time SMS tracking updates.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Shipping Timelines',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/track-order',
    title: 'Track Your Order | Dailyfix Courier Shipment Status',
    description: 'Track your Dailyfix order in real time. Enter your Order ID or phone number to view live courier status.',
    h1: 'Track Your Dailyfix Shipment & Order Status',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Real-Time Courier Tracking with Delhivery & Ekart',
        p: 'Monitor your package journey from dispatch to doorstep with our integrated live courier tracking.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Order Tracking System',
          width: 600,
          height: 600
        }
      }
    ]
  },
  {
    route: '/return-order',
    title: 'Return Order | Dailyfix Grooming Support',
    description: 'Initiate a return or exchange for your Dailyfix order with our customer concierge.',
    h1: 'Initiate a Return or Exchange – Dailyfix Support',
    ogImage: '/dailyfix-logo.png',
    sections: [
      {
        h2: 'Hassle-Free Returns & Replacements',
        p: 'Submit your order details for prompt evaluation and replacement dispatch.',
        img: {
          src: '/images/dailyfix-beard-colour.png',
          alt: 'Dailyfix Returns Processing',
          width: 600,
          height: 600
        }
      }
    ]
  }
];

export function generatePageHtml(templateHtml, pageData) {
  const canonicalUrl = `${BASE_URL}${pageData.route === '/' ? '/' : pageData.route}`;
  const ogImageUrl = pageData.ogImage.startsWith('http') ? pageData.ogImage : `${BASE_URL}${pageData.ogImage}`;

  let html = templateHtml;

  // 1. Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageData.title}</title>`);

  // 2. Replace Description
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${pageData.description.replace(/"/g, '&quot;')}" />`);

  // 3. Replace Canonical
  html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`);

  // 4. Replace OG Tags
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${pageData.title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${pageData.description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:image" content="${ogImageUrl}" />`);

  // 5. Replace Twitter Tags
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${pageData.title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${pageData.description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:image" content="${ogImageUrl}" />`);

  // 6. Build Content for <div id="root">
  const sectionsHtml = pageData.sections.map((sec, idx) => `
      <section>
        <h2>${sec.h2}</h2>
        <p>${sec.p}</p>
        <img
          src="${sec.img.src}"
          alt="${sec.img.alt.replace(/"/g, '&quot;')}"
          width="${sec.img.width || 600}"
          height="${sec.img.height || 600}"
          ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
        />
      </section>`).join('\n');

  const rootContent = `
  <div id="root">
    <!-- Prerendered Semantic SEO Content for Web Crawlers & Non-JS Clients -->
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">Home</a>
        <a href="/shop">Beard Colour for Men</a>
        <a href="/about">About Us</a>
        <a href="/blog">Men's Beard Grooming Advice</a>
        <a href="/store-locator">Store Locator</a>
        <a href="/track-order">Track Order</a>
        <a href="/contact">Contact Us</a>
      </nav>
    </header>

    <main>
      <section>
        <h1>${pageData.h1}</h1>
        <p>${pageData.description}</p>
      </section>
${sectionsHtml}
    </main>

    <footer>
      <nav aria-label="Customer Care and Policies">
        <a href="/shipping-policy">Shipping &amp; Delivery Policy</a>
        <a href="/return-policy">Refund/Cancellation Policy</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-of-service">Terms &amp; Conditions</a>
      </nav>
      <p>&copy; 2026 Dailyfix Grooming Essentials. All rights reserved.</p>
      <nav aria-label="Official Marketplace Channels">
        <a href="https://www.amazon.in/s?k=dailyfix+beard+colour" target="_blank" rel="noopener noreferrer">Amazon India</a>
        <a href="https://www.flipkart.com/search?q=dailyfix+beard+colour" target="_blank" rel="noopener noreferrer">Flipkart</a>
        <a href="https://www.nykaa.com/search/result/?q=dailyfix" target="_blank" rel="noopener noreferrer">Nykaa</a>
        <a href="https://www.shopsy.in/search?q=dailyfix" target="_blank" rel="noopener noreferrer">Shopsy</a>
      </nav>
      <nav aria-label="Social Media">
        <a href="https://www.instagram.com/dailyfix_care/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.facebook.com/share/1JShp38pJT/" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.youtube.com/channel/UC2OE1pPDCj9cWVJ0k9m_ttQ" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="https://www.linkedin.com/company/daily-fix-care/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </nav>
    </footer>
  </div>`;

  // Replace <div id="root">...</div> with new root content
  const rootStart = html.indexOf('<div id="root">');
  const scriptStart = html.indexOf('<script', rootStart);
  if (rootStart !== -1 && scriptStart !== -1) {
    html = html.substring(0, rootStart) + rootContent + '\n\n  ' + html.substring(scriptStart);
  }

  return html;
}

export function prerenderAll(targetDistDir) {
  const indexHtmlPath = path.join(targetDistDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`Target template not found at ${indexHtmlPath}`);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  console.log(`🚀 Pre-rendering ${SEO_ROUTES.length} static SEO routes into ${targetDistDir}...`);

  let count = 0;
  for (const page of SEO_ROUTES) {
    const pageHtml = generatePageHtml(templateHtml, page);

    if (page.route === '/') {
      fs.writeFileSync(indexHtmlPath, pageHtml, 'utf8');
      count++;
      console.log(`  ✓ Pre-rendered / (dist/index.html)`);
    } else {
      const routeDir = path.join(targetDistDir, page.route.replace(/^\/+/, ''));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      const routeFilePath = path.join(routeDir, 'index.html');
      fs.writeFileSync(routeFilePath, pageHtml, 'utf8');
      count++;
      console.log(`  ✓ Pre-rendered ${page.route} -> ${path.relative(targetDistDir, routeFilePath)}`);
    }
  }

  console.log(`✅ Successfully pre-rendered ${count} SEO pages!`);
}

// Execute directly if run via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const targetDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(projectRoot, 'client', 'dist');

  if (fs.existsSync(targetDir)) {
    prerenderAll(targetDir);
  } else {
    console.warn(`Target directory ${targetDir} does not exist yet. Run vite build first.`);
  }
}
