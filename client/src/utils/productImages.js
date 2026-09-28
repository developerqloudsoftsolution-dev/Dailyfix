import nb003 from '../assets/images/NATURAL BLACK/003.jpeg';
import nb004 from '../assets/images/NATURAL BLACK/004.jpeg';
import nb01 from '../assets/images/NATURAL BLACK/01.png';
import nb02 from '../assets/images/NATURAL BLACK/02.png';
import nb04 from '../assets/images/NATURAL BLACK/04.png';
import nb05 from '../assets/images/NATURAL BLACK/05.webp';
import dbl03 from '../assets/images/DARK BROWN/03.jpeg';
import dbl04j from '../assets/images/DARK BROWN/04.jpeg';
import dbl01 from '../assets/images/DARK BROWN/01.png';
import dbl02 from '../assets/images/DARK BROWN/02.png';
import dbl04 from '../assets/images/DARK BROWN/04.png';
import dbl05 from '../assets/images/DARK BROWN/05.webp';
import bb003 from '../assets/images/02 BLACK BROWN/003.jpeg';
import bb004 from '../assets/images/02 BLACK BROWN/004.jpeg';
import bb01 from '../assets/images/02 BLACK BROWN/01.png';
import bb02 from '../assets/images/02 BLACK BROWN/02.png';
import bb04 from '../assets/images/02 BLACK BROWN/04.png';
import bb05 from '../assets/images/02 BLACK BROWN/05.webp';
import genericListing001 from '../assets/images/001 Natural black1.png';
import genericListing002 from '../assets/images/002 Brown black2.png';
import genericListing003 from '../assets/images/003 Drak brown3.png';
import genericProduct from '../assets/images/Dailyfix Beard Colour Product Only.png';
import productVideo from '../assets/Untitled design (3).mp4';
import naturalBlackPoster from '../assets/images/natural-black-poster.jpg';
import threeShadesShowcase from '../assets/images/three-shades-showcase.jpg';

export const listingImageMap = {
  'natural-black': nb01,
  'dark-brown': dbl01,
  'black-brown': bb01,
  'beard-colour-natural-black': nb01,
  'beard-colour-dark-brown': dbl01,
  'beard-colour-black-brown': bb01,
};

const galleryMapNB = [
  { type: 'image', src: nb01 },
  { type: 'image', src: naturalBlackPoster },
  { type: 'image', src: threeShadesShowcase },
  { type: 'image', src: nb02 },
  { type: 'image', src: nb003 },
  { type: 'image', src: nb004 },
  { type: 'image', src: nb04 },
  { type: 'image', src: nb05 },
  { type: 'video', src: productVideo },
];
const galleryMapDBL = [
  { type: 'image', src: dbl01 },
  { type: 'image', src: threeShadesShowcase },
  { type: 'image', src: dbl02 },
  { type: 'image', src: dbl03 },
  { type: 'image', src: dbl04j },
  { type: 'image', src: dbl04 },
  { type: 'image', src: dbl05 },
  { type: 'video', src: productVideo },
];
const galleryMapBB = [
  { type: 'image', src: bb01 },
  { type: 'image', src: threeShadesShowcase },
  { type: 'image', src: bb02 },
  { type: 'image', src: bb003 },
  { type: 'image', src: bb004 },
  { type: 'image', src: bb04 },
  { type: 'image', src: bb05 },
  { type: 'video', src: productVideo },
];

export const galleryImageMap = {
  'natural-black': galleryMapNB,
  'dark-brown': galleryMapDBL,
  'black-brown': galleryMapBB,
  'beard-colour-natural-black': galleryMapNB,
  'beard-colour-dark-brown': galleryMapDBL,
  'beard-colour-black-brown': galleryMapBB,
};

const FALLBACK_LISTING = genericListing001;
const FALLBACK_GALLERY = [
  { type: 'image', src: genericListing001 },
  { type: 'image', src: genericListing002 },
  { type: 'image', src: genericListing003 },
  { type: 'image', src: genericProduct },
  { type: 'video', src: productVideo },
];

const VALID_URL_PREFIXES = ['http://', 'https://', '//', 'data:image/', 'blob:'];
const VITE_ASSET_EXT_RE = /\.(png|jpe?g|webp|gif|svg|mp4|webm)(\?.*)?$/i;

function isLikelyAssetUrl(value) {
  if (!value || typeof value !== 'string') return false;
  const v = value.trim();
  if (!v) return false;
  if (VALID_URL_PREFIXES.some((p) => v.toLowerCase().startsWith(p))) return true;
  if (v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) return true;
  if (VITE_ASSET_EXT_RE.test(v)) return true;
  return false;
}

function pickGenericBySlug(slug = '') {
  const s = String(slug || '').toLowerCase();
  if (s.includes('dark') && s.includes('brown')) return genericListing003;
  if (s.includes('black') && s.includes('brown')) return genericListing002;
  if (s.includes('natural') || s.includes('black')) return genericListing001;
  return FALLBACK_LISTING;
}

function resolveListingOrUrl(value, fallbackSlug) {
  if (!value) {
    if (fallbackSlug && listingImageMap[fallbackSlug]) return listingImageMap[fallbackSlug];
    if (fallbackSlug) return pickGenericBySlug(fallbackSlug);
    return FALLBACK_LISTING;
  }
  if (typeof value !== 'string') {
    if (fallbackSlug && listingImageMap[fallbackSlug]) return listingImageMap[fallbackSlug];
    if (fallbackSlug) return pickGenericBySlug(fallbackSlug);
    return FALLBACK_LISTING;
  }
  if (isLikelyAssetUrl(value)) return value;
  if (listingImageMap[value]) return listingImageMap[value];
  if (fallbackSlug && listingImageMap[fallbackSlug]) return listingImageMap[fallbackSlug];
  const generic = pickGenericBySlug(value);
  if (generic !== FALLBACK_LISTING) return generic;
  if (fallbackSlug) return pickGenericBySlug(fallbackSlug);
  return FALLBACK_LISTING;
}

export function getProductGallery(slug) {
  if (slug && galleryImageMap[slug]) return galleryImageMap[slug];
  return FALLBACK_GALLERY;
}

export function getListingImage(slug) {
  if (slug && listingImageMap[slug]) return listingImageMap[slug];
  if (slug) return pickGenericBySlug(slug);
  return FALLBACK_LISTING;
}

export function getRawListingBySlug(slug) {
  return getListingImage(slug);
}

export function resolveImage(input) {
  if (!input) return FALLBACK_LISTING;
  if (typeof input === 'string') return resolveListingOrUrl(input);
  if (typeof input === 'object' && typeof input.src === 'string') return resolveListingOrUrl(input.src);
  if (typeof input === 'object' && typeof input.url === 'string') return resolveListingOrUrl(input.url);
  if (Array.isArray(input) && input.length) return resolveImage(input[0]);
  return FALLBACK_LISTING;
}

export function getProductImageSrc(product) {
  if (!product) return FALLBACK_LISTING;
  const slug = product.slug;
  const direct = product.image || product.img || product.cover || product.thumbnail;
  if (direct) {
    const resolved =
      typeof direct === 'object'
        ? resolveImage(direct)
        : resolveListingOrUrl(direct, slug);
    if (resolved) return resolved;
  }
  const imgs = product.images || product.gallery || product.media;
  if (Array.isArray(imgs) && imgs.length) return resolveImage(imgs[0]);
  if (slug) return getListingImage(slug);
  return FALLBACK_LISTING;
}

export function getProductGalleryImages(product) {
  if (!product) return FALLBACK_GALLERY;
  if (Array.isArray(product.images) && product.images.length) {
    const normalized = product.images
      .map((m) => {
        if (typeof m === 'string') return { type: 'image', src: m };
        if (m && typeof m === 'object') {
          if (m.type === 'video') return { type: 'video', src: m.src || m.url };
          return { type: m.type || 'image', src: m.src || m.url };
        }
        return null;
      })
      .filter(Boolean);
    if (normalized.length) return normalized;
  }
  if (product.slug) return getProductGallery(product.slug);
  return FALLBACK_GALLERY;
}

export function normalizeProduct(apiProduct) {
  if (!apiProduct) return null;
  const id = apiProduct._id || apiProduct.id;
  const slug = apiProduct.slug || `product-${id}`;
  const image =
    (typeof apiProduct.image === 'string' && apiProduct.image) ||
    getListingImage(slug);
  const images = getProductGalleryImages(apiProduct);
  return {
    ...apiProduct,
    id,
    slug,
    image,
    images,
    name: apiProduct.name || 'Dailyfix Beard Colour',
    price: Number(apiProduct.price || 0),
    desc: apiProduct.desc || apiProduct.tagline || 'Ammonia-Free Formula',
    sku: apiProduct.sku || `DFX-${String(id).slice(-6).toUpperCase()}`,
    stock: Number(apiProduct.stock || 50),
    description: apiProduct.description || '',
    category: apiProduct.category || 'Beard Colour',
    brand: apiProduct.brand || 'Dailyfix',
  };
}

export const FALLBACK_PRODUCT_IMAGE = FALLBACK_LISTING;
export { genericProduct as genericFallback, genericListing001, genericListing002, genericListing003, productVideo };
