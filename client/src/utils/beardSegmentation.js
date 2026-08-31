/**
 * AI Beard Segmentation & Realistic Color Blending Engine
 * 100% Client-side in browser using MediaPipe Face Mesh & Canvas 2D
 */

// Landmark polygon indices for facial hair areas
export const FACIAL_HAIR_LANDMARKS = {
  // Mustache area between nose base and upper lip
  mustache: [
    164, 393, 165, 326, 2, 97, 98, 167, 37, 39, 40, 185, 61, 76, 62, 0, 292,
    306, 291, 409, 270, 269, 267
  ],

  // Full beard outline (chin, jaw, lower cheeks, sideburns)
  beardJaw: [
    234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389,
    356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176,
    149, 150, 136, 172, 58, 132, 93, 234
  ],

  // Lower cheek & chin area extending to under-lip
  chinCheeks: [
    234, 93, 132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379,
    365, 397, 288, 361, 323, 454, 356, 389, 251, 284, 332, 297, 338, 10, 109,
    67, 103, 54, 21, 162, 127, 234
  ],

  // Mouth & Lips boundary to exclude (never recolor lips or teeth)
  lipsOuter: [
    61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17,
    84, 181, 91, 146, 61
  ]
};

// Dailyfix Product Shades Color Profiles
export const DAILYFIX_SHADES = {
  'natural-black': {
    id: 'natural-black',
    sku: 'DF-NB-001',
    name: 'Natural Black',
    badge: '001 Natural Black',
    tagline: 'Bold, Classic & Naturally Rich Black',
    hex: '#16161a',
    swatch: '#16161a',
    rgb: [22, 22, 26],
    hairDyeFormula: (y) => ({
      r: Math.round(y * 0.16 + 10),
      g: Math.round(y * 0.16 + 10),
      b: Math.round(y * 0.19 + 14)
    })
  },
  'black-brown': {
    id: 'black-brown',
    sku: 'DF-BB-002',
    name: 'Black Brown',
    badge: '002 Black Brown',
    tagline: 'Warm, Distinguished & Natural Tone',
    hex: '#2e2018',
    swatch: '#2e2018',
    rgb: [46, 32, 24],
    hairDyeFormula: (y) => ({
      r: Math.round(y * 0.32 + 20),
      g: Math.round(y * 0.22 + 13),
      b: Math.round(y * 0.16 + 9)
    })
  },
  'dark-brown': {
    id: 'dark-brown',
    sku: 'DF-DB-003',
    name: 'Dark Brown',
    badge: '003 Dark Brown',
    tagline: 'Deep Chocolate with Amber Warmth',
    hex: '#4a2e20',
    swatch: '#4a2e20',
    rgb: [74, 46, 32],
    hairDyeFormula: (y) => ({
      r: Math.round(y * 0.48 + 26),
      g: Math.round(y * 0.28 + 15),
      b: Math.round(y * 0.18 + 9)
    })
  }
};

let faceMeshInstance = null;
let scriptLoadingPromise = null;

/**
 * Dynamically load Google MediaPipe scripts from CDN
 */
export function loadMediaPipeFaceMesh() {
  if (faceMeshInstance) {
    return Promise.resolve(faceMeshInstance);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if (window.FaceMesh) {
      initInstance(resolve, reject);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      initInstance(resolve, reject);
    };
    script.onerror = (err) => {
      console.error('Failed to load MediaPipe FaceMesh script:', err);
      reject(new Error('Failed to load AI Face Mesh engine'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

function initInstance(resolve, reject) {
  try {
    const fm = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`
    });

    fm.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMeshInstance = fm;
    resolve(fm);
  } catch (err) {
    console.error('Error initializing FaceMesh instance:', err);
    reject(err);
  }
}

/**
 * Draw a closed polygon path from landmark coordinates
 */
function drawPolygon(ctx, landmarks, indices, width, height) {
  if (!indices || indices.length === 0) return;
  ctx.beginPath();
  const first = landmarks[indices[0]];
  if (!first) return;
  ctx.moveTo(first.x * width, first.y * height);

  for (let i = 1; i < indices.length; i++) {
    const pt = landmarks[indices[i]];
    if (pt) {
      ctx.lineTo(pt.x * width, pt.y * height);
    }
  }
  ctx.closePath();
}

/**
 * Generate high-precision beard & mustache alpha mask
 */
export function generateBeardMask(landmarks, width, height) {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskCtx = maskCanvas.getContext('2d');

  maskCtx.clearRect(0, 0, width, height);

  // 1. Draw Mustache region
  maskCtx.fillStyle = '#ffffff';
  drawPolygon(maskCtx, landmarks, FACIAL_HAIR_LANDMARKS.mustache, width, height);
  maskCtx.fill();

  // 2. Draw Jaw, Chin, and Lower Cheeks
  drawPolygon(maskCtx, landmarks, FACIAL_HAIR_LANDMARKS.beardJaw, width, height);
  maskCtx.fill();

  drawPolygon(maskCtx, landmarks, FACIAL_HAIR_LANDMARKS.chinCheeks, width, height);
  maskCtx.fill();

  // 3. Cut out the Lips & Mouth interior so teeth & lips are never colored
  maskCtx.globalCompositeOperation = 'destination-out';
  drawPolygon(maskCtx, landmarks, FACIAL_HAIR_LANDMARKS.lipsOuter, width, height);
  maskCtx.fill();

  // 4. Create feathered smooth mask with blur
  const featheredCanvas = document.createElement('canvas');
  featheredCanvas.width = width;
  featheredCanvas.height = height;
  const fCtx = featheredCanvas.getContext('2d');

  fCtx.filter = 'blur(6px)';
  fCtx.drawImage(maskCanvas, 0, 0);

  return featheredCanvas;
}

/**
 * Recolor beard using texture-preserving luminance dye algorithm
 */
export function applyBeardColor({
  sourceCanvas,
  maskCanvas,
  shadeKey = 'natural-black',
  intensity = 0.95
}) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const outCtx = outputCanvas.getContext('2d');

  // Draw original image
  outCtx.drawImage(sourceCanvas, 0, 0);

  const srcData = outCtx.getImageData(0, 0, width, height);
  const maskCtx = maskCanvas.getContext('2d');
  const maskData = maskCtx.getImageData(0, 0, width, height);

  const shade = DAILYFIX_SHADES[shadeKey] || DAILYFIX_SHADES['natural-black'];
  const dyeFormula = shade.hairDyeFormula;

  const src = srcData.data;
  const mask = maskData.data;
  const len = src.length;

  for (let i = 0; i < len; i += 4) {
    const maskAlpha = mask[i + 3] / 255;
    if (maskAlpha <= 0.02) continue;

    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];

    // Calculate Perceived Luminance (brightness)
    const y = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply shade formula
    const target = dyeFormula(y);

    // Dynamic blend factor: stronger on lighter/grey hairs, natural on dark
    const greyBoost = Math.min(1.0, (y / 180) * 0.4 + 0.6);
    const blendAlpha = maskAlpha * intensity * greyBoost;

    src[i] = Math.round(r * (1 - blendAlpha) + target.r * blendAlpha);
    src[i + 1] = Math.round(g * (1 - blendAlpha) + target.g * blendAlpha);
    src[i + 2] = Math.round(b * (1 - blendAlpha) + target.b * blendAlpha);
  }

  outCtx.putImageData(srcData, 0, 0);
  return outputCanvas;
}

/**
 * Render Split Before/After Comparison view onto destination canvas
 */
export function renderSplitComparison({
  destCanvas,
  beforeImageCanvas,
  afterImageCanvas,
  splitRatio = 0.5
}) {
  if (!destCanvas || !beforeImageCanvas || !afterImageCanvas) return;

  const width = destCanvas.width;
  const height = destCanvas.height;
  const ctx = destCanvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const splitX = Math.round(width * splitRatio);

  // 1. Draw Before (Original) on Left
  if (splitX > 0) {
    ctx.drawImage(
      beforeImageCanvas,
      0, 0, splitX, height,
      0, 0, splitX, height
    );
  }

  // 2. Draw After (Recolored) on Right
  if (splitX < width) {
    ctx.drawImage(
      afterImageCanvas,
      splitX, 0, width - splitX, height,
      splitX, 0, width - splitX, height
    );
  }

  // 3. Draw Divider Line
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(splitX, 0);
  ctx.lineTo(splitX, height);
  ctx.stroke();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // 4. Draw Center Drag Handle
  const centerY = height / 2;
  ctx.fillStyle = '#10b981'; // Emerald brand color
  ctx.beginPath();
  ctx.arc(splitX, centerY, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Arrows in handle
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('‹ ›', splitX, centerY);
}
