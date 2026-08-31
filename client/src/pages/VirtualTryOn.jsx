import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  User,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Split,
  Eye,
  Zap,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  DAILYFIX_SHADES,
  loadMediaPipeFaceMesh,
  generateBeardMask,
  applyBeardColor,
  renderSplitComparison
} from '../utils/beardSegmentation';
import { getListingImage } from '../utils/productImages';
import toast from 'react-hot-toast';

const DEMO_MODELS = [
  {
    id: 'model-1',
    name: 'Model 1 (Salt & Pepper)',
    src: '/demo-models/model-1.jpg',
    thumb: '/demo-models/model-1.jpg',
    desc: 'Medium trimmed beard with grey highlights on chin & jaw'
  },
  {
    id: 'model-2',
    name: 'Model 2 (Full Grey Beard)',
    src: '/demo-models/model-2.jpg',
    thumb: '/demo-models/model-2.jpg',
    desc: 'Thick beard with silver & grey salt-and-pepper coverage'
  }
];

const VirtualTryOn = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Mode: 'demo' | 'upload' | 'camera'
  const [activeTab, setActiveTab] = useState('demo');
  const [selectedModel, setSelectedModel] = useState(DEMO_MODELS[0].id);

  // Selected Shade Key
  const [selectedShade, setSelectedShade] = useState('natural-black');
  const [intensity, setIntensity] = useState(0.95);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'after' | 'before'

  // Processing & AI States
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Uploaded Image URL
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);

  // Canvas Refs & Stored Offscreens
  const viewportCanvasRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const rawImageCanvasRef = useRef(null);
  const beardMaskCanvasRef = useRef(null);
  const coloredCanvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isDraggingSplitRef = useRef(false);

  // Initialize MediaPipe AI on mount
  useEffect(() => {
    let mounted = true;
    setIsLoadingModel(true);

    loadMediaPipeFaceMesh()
      .then((fm) => {
        if (!mounted) return;
        faceMeshRef.current = fm;
        setIsLoadingModel(false);
        // Load default demo model once AI is ready
        processImageFromSrc(DEMO_MODELS[0].src);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('AI initialization failed:', err);
        setIsLoadingModel(false);
        setErrorMessage('Unable to initialize AI engine. Please check your internet connection.');
      });

    return () => {
      mounted = false;
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /**
   * Process a static image source (Demo or Upload) through FaceMesh
   */
  const processImageFromSrc = useCallback(
    (imageSrc) => {
      if (!imageSrc) return;
      setIsProcessing(true);
      setErrorMessage(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Standardize canvas size to reasonable processing dimensions (max 800px)
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        const maxDim = 800;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const rawCanvas = document.createElement('canvas');
        rawCanvas.width = w;
        rawCanvas.height = h;
        const rCtx = rawCanvas.getContext('2d');
        rCtx.drawImage(img, 0, 0, w, h);
        rawImageCanvasRef.current = rawCanvas;

        if (faceMeshRef.current) {
          faceMeshRef.current.onResults((results) => {
            handleFaceMeshResults(results, rawCanvas);
          });
          faceMeshRef.current.send({ image: rawCanvas });
        } else {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        setErrorMessage('Failed to load image. Please try another photo.');
      };
      img.src = imageSrc;
    },
    []
  );

  /**
   * Handle FaceMesh landmarks detection result
   */
  const handleFaceMeshResults = (results, sourceCanvas) => {
    setIsProcessing(false);

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setFaceDetected(false);
      setErrorMessage('No face detected. Please ensure your face and beard are clearly visible and well-lit.');
      // Draw original image on viewport
      if (viewportCanvasRef.current && sourceCanvas) {
        const dest = viewportCanvasRef.current;
        dest.width = sourceCanvas.width;
        dest.height = sourceCanvas.height;
        const ctx = dest.getContext('2d');
        ctx.drawImage(sourceCanvas, 0, 0);
      }
      return;
    }

    setFaceDetected(true);
    setErrorMessage(null);
    const landmarks = results.multiFaceLandmarks[0];

    // Generate precision feathered mask
    const mask = generateBeardMask(landmarks, sourceCanvas.width, sourceCanvas.height);
    beardMaskCanvasRef.current = mask;

    // Apply color and update view
    updateRecoloredCanvas();
  };

  /**
   * Update the colored canvas when shade or intensity changes
   */
  const updateRecoloredCanvas = useCallback(() => {
    if (!rawImageCanvasRef.current || !beardMaskCanvasRef.current) return;

    const colored = applyBeardColor({
      sourceCanvas: rawImageCanvasRef.current,
      maskCanvas: beardMaskCanvasRef.current,
      shadeKey: selectedShade,
      intensity: intensity
    });

    coloredCanvasRef.current = colored;
    drawViewport();
  }, [selectedShade, intensity]);

  // Re-run color when shade or intensity changes
  useEffect(() => {
    if (rawImageCanvasRef.current && beardMaskCanvasRef.current) {
      updateRecoloredCanvas();
    }
  }, [selectedShade, intensity, updateRecoloredCanvas]);

  /**
   * Redraw the visible viewport canvas based on view mode and split position
   */
  const drawViewport = useCallback(() => {
    const dest = viewportCanvasRef.current;
    if (!dest || !rawImageCanvasRef.current) return;

    const raw = rawImageCanvasRef.current;
    const colored = coloredCanvasRef.current || raw;

    dest.width = raw.width;
    dest.height = raw.height;
    const ctx = dest.getContext('2d');

    if (viewMode === 'before') {
      ctx.drawImage(raw, 0, 0);
    } else if (viewMode === 'after') {
      ctx.drawImage(colored, 0, 0);
    } else {
      // Split mode
      renderSplitComparison({
        destCanvas: dest,
        beforeImageCanvas: raw,
        afterImageCanvas: colored,
        splitRatio: splitRatio
      });
    }
  }, [viewMode, splitRatio]);

  useEffect(() => {
    drawViewport();
  }, [drawViewport, splitRatio, viewMode]);

  // Handle Demo Model Selection
  const handleSelectDemoModel = (model) => {
    stopCamera();
    setActiveTab('demo');
    setSelectedModel(model.id);
    processImageFromSrc(model.src);
  };

  // Handle User Photo Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPG or PNG)');
      return;
    }

    stopCamera();
    setActiveTab('upload');
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      setUploadedImageSrc(src);
      processImageFromSrc(src);
    };
    reader.readAsDataURL(file);
  };

  // Start Live Webcam
  const startCamera = async () => {
    stopCamera();
    setActiveTab('camera');
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsProcessing(false);
          startCameraLoop();
        };
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setIsProcessing(false);
      setErrorMessage('Camera access was denied or not supported on this device. Please use photo upload or demo models.');
      toast.error('Unable to access camera');
    }
  };

  // Stop Live Webcam
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Process live camera stream continuously
  const startCameraLoop = () => {
    const processFrame = async () => {
      if (!videoRef.current || !isCameraActive || videoRef.current.paused || videoRef.current.ended) {
        return;
      }

      const video = videoRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const ctx = tempCanvas.getContext('2d');

        // Mirror video for natural selfie feel
        ctx.translate(tempCanvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        rawImageCanvasRef.current = tempCanvas;

        if (faceMeshRef.current) {
          faceMeshRef.current.onResults((results) => {
            handleFaceMeshResults(results, tempCanvas);
          });
          await faceMeshRef.current.send({ image: tempCanvas });
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  // Snapshot from live camera to static mode
  const captureSnapshot = () => {
    if (rawImageCanvasRef.current) {
      stopCamera();
      setActiveTab('upload');
      toast.success('Snapshot captured! Adjust shades and intensity below.');
    }
  };

  // Drag interaction for Split comparison divider
  const handleCanvasMouseDown = (e) => {
    if (viewMode !== 'split') return;
    isDraggingSplitRef.current = true;
    updateSplitFromEvent(e);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDraggingSplitRef.current || viewMode !== 'split') return;
    updateSplitFromEvent(e);
  };

  const handleCanvasMouseUp = () => {
    isDraggingSplitRef.current = false;
  };

  const updateSplitFromEvent = (e) => {
    const canvas = viewportCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const ratio = Math.max(0.05, Math.min(0.95, x / rect.width));
    setSplitRatio(ratio);
  };

  // Download transformed photo
  const handleDownload = () => {
    if (!viewportCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `dailyfix-tryon-${selectedShade}.jpg`;
    link.href = viewportCanvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
    toast.success('Image downloaded successfully!');
  };

  // Active Shade Object
  const currentShadeObj = DAILYFIX_SHADES[selectedShade];

  // Add active shade to cart
  const handleAddToCart = () => {
    const productData = {
      id: currentShadeObj.id,
      name: `Dailyfix Men's Beard Colour – ${currentShadeObj.name}`,
      slug: currentShadeObj.id,
      sku: currentShadeObj.sku,
      price: 450,
      image: getListingImage(currentShadeObj.id)
    };

    addToCart(productData, 1);
    toast.success(`${currentShadeObj.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* =====================================================
            HEADER & HERO BADGE
        ====================================================== */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            AI Virtual Fitting Room
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-stone-200 to-emerald-400 bg-clip-text text-transparent">
            Try Dailyfix Beard Colour Live on Your Face
          </h1>

          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Experience our 3 ammonia-free shades in real-time. Powered by on-device computer vision — no photos or videos are ever uploaded to any server.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-stone-400 bg-stone-900/60 px-4 py-1.5 rounded-full border border-stone-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Private & On-Device Processing</span>
          </div>
        </div>

        {/* =====================================================
            MAIN TRY-ON INTERACTION GRID
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: INTERACTIVE CANVAS VIEWPORT (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Input Selection Tabs */}
            <div className="flex items-center justify-between bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800">
              <button
                onClick={() => {
                  stopCamera();
                  setActiveTab('demo');
                  processImageFromSrc(DEMO_MODELS.find((m) => m.id === selectedModel)?.src || DEMO_MODELS[0].src);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'demo'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                Demo Models
              </button>

              <button
                onClick={() => {
                  stopCamera();
                  fileInputRef.current?.click();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>

              <button
                onClick={startCamera}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'camera'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                Live Camera
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Hidden Video for Camera Stream */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="hidden"
            />

            {/* Demo Models Selector Bar */}
            {activeTab === 'demo' && (
              <div className="flex items-center gap-3 p-3 bg-stone-900/50 rounded-2xl border border-stone-800 overflow-x-auto">
                <span className="text-xs font-semibold text-stone-400 flex-shrink-0">Choose Model:</span>
                {DEMO_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelectDemoModel(model)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedModel === model.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <img
                      src={model.thumb}
                      alt={model.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{model.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Canvas Viewport Box */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900/90 border border-stone-800 aspect-square sm:aspect-[4/3] flex items-center justify-center shadow-2xl group select-none">
              
              {/* Main Viewport Canvas */}
              <canvas
                ref={viewportCanvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onTouchStart={handleCanvasMouseDown}
                onTouchMove={handleCanvasMouseMove}
                onTouchEnd={handleCanvasMouseUp}
                className="w-full h-full object-contain cursor-ew-resize"
              />

              {/* Top Floating Pill: Before & After labels */}
              {viewMode === 'split' && faceDetected && !isProcessing && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs font-bold tracking-wider uppercase">
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-stone-300 border border-white/10 shadow">
                    Original
                  </span>
                  <span className="bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-white border border-emerald-400/30 shadow">
                    {currentShadeObj.name}
                  </span>
                </div>
              )}

              {/* Live Camera Snapshot Button */}
              {isCameraActive && (
                <div className="absolute bottom-6 inset-x-0 flex justify-center">
                  <button
                    onClick={captureSnapshot}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 transition-transform active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    Capture & Customize
                  </button>
                </div>
              )}

              {/* Loading AI / Processing Overlay */}
              <AnimatePresence>
                {(isLoadingModel || isProcessing) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-stone-200">
                      {isLoadingModel ? 'Initializing AI Engine...' : 'Analyzing Beard & Hair Strands...'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Notice */}
              {errorMessage && !isProcessing && (
                <div className="absolute inset-x-6 top-6 bg-red-950/90 border border-red-500/50 text-red-200 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Face Detection Notice</p>
                    <p className="text-red-300 mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/60 p-3 rounded-2xl border border-stone-800">
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'split'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Split className="w-3.5 h-3.5 inline mr-1" />
                  Split
                </button>
                <button
                  onClick={() => setViewMode('after')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'after'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Result
                </button>
                <button
                  onClick={() => setViewMode('before')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'before'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Original
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSplitRatio(0.5);
                    setIntensity(0.95);
                    toast.success('Reset slider & intensity');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Photo
                </button>
              </div>
            </div>

            {/* Split Drag Hint */}
            {viewMode === 'split' && faceDetected && (
              <p className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Drag the divider on the image left or right to compare Before and After
              </p>
            )}
          </div>

          {/* RIGHT: SHADE SELECTOR & BUY WIDGET (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Shade Picker Box */}
            <div className="bg-stone-900/80 rounded-3xl p-6 border border-stone-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Select Beard Colour Shade
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Click any shade to test instant grey hair transformation.
                </p>
              </div>

              {/* 3 Shades Interactive Cards */}
              <div className="space-y-3">
                {Object.values(DAILYFIX_SHADES).map((shade) => {
                  const isSelected = selectedShade === shade.id;
                  return (
                    <button
                      key={shade.id}
                      onClick={() => setSelectedShade(shade.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                          : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Swatch Circle */}
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white/20 shadow-inner flex-shrink-0"
                          style={{ backgroundColor: shade.swatch }}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm sm:text-base">
                              {shade.name}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                              {shade.sku}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {shade.tagline}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Intensity / Coverage Slider */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Coverage Intensity:
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {Math.round(intensity * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                  <span>Natural Blend (40%)</span>
                  <span>Full Coverage (100%)</span>
                </div>
              </div>
            </div>

            {/* Product Quick-Buy Card */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 rounded-3xl p-6 border border-emerald-500/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={getListingImage(currentShadeObj.id)}
                  alt={currentShadeObj.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-white p-1.5 border border-stone-700 flex-shrink-0"
                />

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Selected Product
                  </span>
                  <h4 className="font-bold text-white text-base mt-1 line-clamp-1">
                    Dailyfix Beard Colour – {currentShadeObj.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-400">₹450</span>
                    <span className="text-xs text-stone-400">All Taxes Included</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-300 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Ammonia-Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>15-Minute Easy Action</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No Skin Stains</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lasts 4–6 Weeks</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  Buy This Shade Now (₹450)
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-stone-700"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <Link
                    to={`/product/${currentShadeObj.id}`}
                    className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-700 text-center"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            HOW IT WORKS & PRIVACY EXPLAINER SECTION
        ====================================================== */}
        <div className="pt-10 border-t border-stone-900">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-white">
              How the AI Try-On Room Works
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm">
              State-of-the-art browser machine learning delivers authentic results while keeping your data 100% confidential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900/60 p-6 rounded-3xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                1
              </div>
              <h4 className="font-bold text-white text-base">
                Facial Landmark Tracking
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                468 high-precision 3D landmarks map your jawline, mustache, cheeks, and soul patch in real time.
              </p>
            </div>

            <div className="bg-stone-900/60 p-6 rounded-3xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                2
              </div>
              <h4 className="font-bold text-white text-base">
                Precise Lip & Teeth Exclusion
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Our mask engine cleanly excludes lips, teeth, and skin to ensure only your facial hair strands receive color.
              </p>
            </div>

            <div className="bg-stone-900/60 p-6 rounded-3xl border border-stone-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                3
              </div>
              <h4 className="font-bold text-white text-base">
                Texture-Preserving Dye Blend
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Luminance-aware pigment shading tints grey and silver hairs while preserving natural hair highlights and shine.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VirtualTryOn;
