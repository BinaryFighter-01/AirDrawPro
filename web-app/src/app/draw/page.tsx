'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Download,
  Minus,
  Plus,
  Camera,
  CameraOff,
  Hand,
  X,
  Check,
  Eraser,
  PenTool,
  AlertCircle
} from 'lucide-react';

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Brown', value: '#a16207' },
];

interface Point {
  x: number;
  y: number;
}

interface DrawingLine {
  points: Point[];
  color: string;
  width: number;
}

export default function DrawPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#a855f7');
  const [brushSize, setBrushSize] = useState(8);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [gestureInfo, setGestureInfo] = useState('');
  const [drawingMode, setDrawingMode] = useState<'draw' | 'erase'>('draw');
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(true);
  
  // Drawing state
  const drawingLinesRef = useRef<DrawingLine[]>([]);
  const currentLineRef = useRef<Point[]>([]);
  const prevPointRef = useRef<Point | null>(null);
  const erasePointRef = useRef<Point | null>(null);
  
  // Refs for values used in callback (to avoid stale closures)
  const currentColorRef = useRef(currentColor);
  const brushSizeRef = useRef(brushSize);
  const drawingModeRef = useRef(drawingMode);
  
  // Keep refs in sync with state
  useEffect(() => { currentColorRef.current = currentColor; }, [currentColor]);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);
  useEffect(() => { drawingModeRef.current = drawingMode; }, [drawingMode]);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // Initialize MediaPipe Hands
  useEffect(() => {
    const initializeHandTracking = async () => {
      try {
        setIsLoading(true);
        
        // Dynamically import MediaPipe
        const { Hands } = await import('@mediapipe/hands');
        const { Camera } = await import('@mediapipe/camera_utils');
        
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        // Get user media
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: 'user' }
          });
          
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current && videoRef.current) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720,
          });

          cameraRef.current = camera;
          await camera.start();
          setCameraActive(true);
          setIsLoading(false);
          showNotification('Camera started! Point your finger to draw.');
        }
      } catch (err) {
        console.error('Error initializing hand tracking:', err);
        setError('Failed to access camera. Please ensure camera permissions are granted.');
        setIsLoading(false);
      }
    };

    initializeHandTracking();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [showNotification]);

  // Check if hand is open (all fingers extended)
  const isHandOpen = (landmarks: any) => {
    // Check if all fingertips are above their respective PIP joints
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky tips
    const fingerPips = [6, 10, 14, 18]; // Corresponding PIP joints
    
    let extendedFingers = 0;
    for (let i = 0; i < fingerTips.length; i++) {
      if (landmarks[fingerTips[i]].y < landmarks[fingerPips[i]].y) {
        extendedFingers++;
      }
    }
    
    // Check thumb (different axis)
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const thumbExtended = Math.abs(thumbTip.x - thumbIp.x) > 0.04;
    
    if (thumbExtended) extendedFingers++;
    
    // Hand is open if at least 4 fingers are extended
    return extendedFingers >= 4;
  };

  // Handle hand tracking results
  const onResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!canvas || !drawingCanvas) return;

    const ctx = canvas.getContext('2d');
    const drawCtx = drawingCanvas.getContext('2d');
    if (!ctx || !drawCtx) return;

    // Clear overlay canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw camera feed (mirrored)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    let shouldDraw = false;
    let shouldErase = false;
    let drawX = 0, drawY = 0;
    let eraseX = 0, eraseY = 0;

    if (results.multiHandLandmarks && results.multiHandedness) {
      setHandDetected(true);
      
      results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
        const handedness = results.multiHandedness[index].label;
        
        // Draw hand skeleton
        drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height, handedness);
        
        // Get fingertip position (index finger tip = landmark 8)
        const indexTip = landmarks[8];
        const indexPip = landmarks[6];
        
        // Get palm center for erasing (landmark 9 is middle of palm)
        const palmCenter = landmarks[9];
        
        // Mirror the x coordinate
        const x = (1 - indexTip.x) * canvas.width;
        const y = indexTip.y * canvas.height;
        
        const palmX = (1 - palmCenter.x) * canvas.width;
        const palmY = palmCenter.y * canvas.height;
        
        // Due to mirror flip, MediaPipe "Left" is user's RIGHT hand (drawing hand)
        if (handedness === "Left") {
          // Check if index finger is pointing (extended)
          const isPointing = indexTip.y < indexPip.y;
          
          if (isPointing) {
            shouldDraw = true;
            drawX = x;
            drawY = y;
            setGestureInfo('RIGHT HAND: Drawing...');
          } else {
            setGestureInfo('RIGHT HAND: Point finger to draw');
          }
        }
        
        // MediaPipe "Right" is user's LEFT hand (erase hand)
        if (handedness === "Right") {
          // Check if entire left hand is open (palm erase)
          if (isHandOpen(landmarks)) {
            shouldErase = true;
            eraseX = palmX;
            eraseY = palmY;
            setGestureInfo('LEFT HAND: Erasing...');
            setIsErasing(true);
          } else {
            setIsErasing(false);
          }
          
          // Draw erase indicator circle on left hand palm
          ctx.beginPath();
          ctx.arc(palmX, palmY, shouldErase ? 40 : 20, 0, 2 * Math.PI);
          ctx.fillStyle = shouldErase ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)';
          ctx.fill();
          ctx.strokeStyle = shouldErase ? '#ef4444' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        
        // Draw fingertip indicator for right hand
        if (handedness === "Left") {
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, 2 * Math.PI);
          ctx.fillStyle = shouldDraw ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.3)';
          ctx.fill();
          ctx.strokeStyle = shouldDraw ? '#a855f7' : 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
    } else {
      setHandDetected(false);
      setGestureInfo('Show your hands to start');
      setIsErasing(false);
      prevPointRef.current = null;
      erasePointRef.current = null;
    }

    // Handle drawing with RIGHT hand
    if (shouldDraw && !shouldErase) {
      setIsDrawing(true);
      const point = { x: drawX, y: drawY };
      
      if (prevPointRef.current) {
        drawCtx.beginPath();
        drawCtx.moveTo(prevPointRef.current.x, prevPointRef.current.y);
        drawCtx.lineTo(point.x, point.y);
        
        if (drawingModeRef.current === 'erase') {
          drawCtx.globalCompositeOperation = 'destination-out';
          drawCtx.strokeStyle = 'rgba(0,0,0,1)';
          drawCtx.lineWidth = brushSizeRef.current * 3;
        } else {
          drawCtx.globalCompositeOperation = 'source-over';
          drawCtx.strokeStyle = currentColorRef.current;
          drawCtx.lineWidth = brushSizeRef.current;
        }
        
        drawCtx.lineCap = 'round';
        drawCtx.lineJoin = 'round';
        drawCtx.stroke();
        
        currentLineRef.current.push(point);
      } else {
        currentLineRef.current = [point];
      }
      
      prevPointRef.current = point;
    } else {
      if (currentLineRef.current.length > 0) {
        drawingLinesRef.current.push({
          points: [...currentLineRef.current],
          color: currentColorRef.current,
          width: brushSizeRef.current
        });
        currentLineRef.current = [];
      }
      prevPointRef.current = null;
      setIsDrawing(false);
    }

    // Handle erasing with LEFT hand open palm
    if (shouldErase) {
      const erasePoint = { x: eraseX, y: eraseY };
      
      if (erasePointRef.current) {
        // Erase along the path
        drawCtx.globalCompositeOperation = 'destination-out';
        drawCtx.beginPath();
        drawCtx.moveTo(erasePointRef.current.x, erasePointRef.current.y);
        drawCtx.lineTo(erasePoint.x, erasePoint.y);
        drawCtx.strokeStyle = 'rgba(0,0,0,1)';
        drawCtx.lineWidth = 120; // Larger erase area for faster erasing
        drawCtx.lineCap = 'round';
        drawCtx.stroke();
        
        // Also erase a circle at current position for faster clearing
        drawCtx.beginPath();
        drawCtx.arc(erasePoint.x, erasePoint.y, 80, 0, 2 * Math.PI);
        drawCtx.fill();
      }
      
      erasePointRef.current = erasePoint;
    } else {
      erasePointRef.current = null;
    }
  }, []);

  // Draw hand skeleton
  const drawHandSkeleton = (
    ctx: CanvasRenderingContext2D, 
    landmarks: any, 
    width: number, 
    height: number,
    handedness: string
  ) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    // Different colors for each hand
    const color = handedness === "Left" ? 'rgba(168, 85, 247, 0.6)' : 'rgba(239, 68, 68, 0.6)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    connections.forEach(([i, j]) => {
      const x1 = (1 - landmarks[i].x) * width;
      const y1 = landmarks[i].y * height;
      const x2 = (1 - landmarks[j].x) * width;
      const y2 = landmarks[j].y * height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // Draw landmarks
    landmarks.forEach((landmark: any, index: number) => {
      const x = (1 - landmark.x) * width;
      const y = landmark.y * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = index === 8 ? (handedness === "Left" ? '#a855f7' : '#ef4444') : 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    });
  };

  const clearCanvas = useCallback(() => {
    const drawingCanvas = drawingCanvasRef.current;
    if (drawingCanvas) {
      const ctx = drawingCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingLinesRef.current = [];
        currentLineRef.current = [];
        showNotification('Canvas cleared!');
      }
    }
  }, [showNotification]);

  const downloadDrawing = useCallback(() => {
    const drawingCanvas = drawingCanvasRef.current;
    if (drawingCanvas) {
      const link = document.createElement('a');
      link.download = `airdraw-${Date.now()}.png`;
      link.href = drawingCanvas.toDataURL('image/png');
      link.click();
      showNotification('Drawing saved!');
    }
  }, [showNotification]);

  const toggleCamera = useCallback(async () => {
    if (cameraActive && cameraRef.current) {
      cameraRef.current.stop();
      setCameraActive(false);
      showNotification('Camera paused');
    } else if (cameraRef.current) {
      await cameraRef.current.start();
      setCameraActive(true);
      showNotification('Camera resumed');
    }
  }, [cameraActive, showNotification]);

  return (
    <div className="min-h-screen text-white p-4 md:p-6">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto mb-4"
      >
        <div className="glass px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button 
                className="tool-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <span className="text-lg font-semibold hidden sm:inline">AirDraw Pro</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status Indicator */}
            <div className="glass px-3 py-2 flex items-center gap-2 text-sm">
              <div className={`status-dot ${handDetected ? 'active' : 'inactive'}`} />
              <span className="hidden sm:inline">{handDetected ? 'Hand Detected' : 'No Hand'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Bar - Horizontal above canvas */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-7xl mx-auto mb-4"
          >
            <div className="glass px-4 py-2 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <PenTool className="w-4 h-4 text-purple-400" />
                  <span className="text-sm"><span className="text-purple-300 font-medium">Draw:</span> <span className="text-gray-400">Right hand index finger</span></span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Hand className="w-4 h-4 text-red-400" />
                  <span className="text-sm"><span className="text-red-300 font-medium">Erase:</span> <span className="text-gray-400">Open left hand palm</span></span>
                </div>
              </div>
              <button 
                onClick={() => setShowRules(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr,280px] gap-4">
          {/* Canvas Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="glass-card p-2 canvas-container">
              {/* Loading State */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-[20px]"
                  >
                    <div className="text-center">
                      <div className="loader mx-auto mb-4" />
                      <p className="text-white/80">Initializing camera...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-[20px]"
                >
                  <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p className="text-white/80 mb-4">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="glass-button glass-button-primary"
                    >
                      Retry
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Video (hidden but used for processing) */}
              <video 
                ref={videoRef} 
                className="hidden"
                playsInline
                muted
              />
              
              {/* Overlay Canvas (camera + hand skeleton) */}
              <canvas 
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full aspect-video rounded-[18px] bg-black/60"
              />
              
              {/* Drawing Canvas (overlay) */}
              <canvas 
                ref={drawingCanvasRef}
                width={1280}
                height={720}
                className="absolute top-2 left-2 right-2 w-[calc(100%-16px)] aspect-video rounded-[18px] pointer-events-none"
              />

              {/* Gesture Info Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
              >
                <div className="glass px-4 py-2 text-sm flex items-center gap-2">
                  <Hand className="w-4 h-4" />
                  {gestureInfo || 'Ready to draw'}
                </div>
              </motion.div>

              {/* Drawing Indicator */}
              <AnimatePresence>
                {isDrawing && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-6 left-6"
                  >
                    <div className="glass px-3 py-2 flex items-center gap-2 text-green-400">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      Drawing
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Erasing Indicator */}
              <AnimatePresence>
                {isErasing && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-6 right-6"
                  >
                    <div className="glass px-3 py-2 flex items-center gap-2 text-red-400">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      Erasing
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Side Panel */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Tools Panel */}
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-4 text-gray-300">Tools</h3>
              
              {/* Drawing Mode */}
              <div className="flex gap-2 mb-4">
                <motion.button 
                  className={`tool-button flex-1 ${drawingMode === 'draw' ? 'active' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDrawingMode('draw')}
                >
                  <PenTool className="w-5 h-5" />
                </motion.button>

                <motion.button 
                  className={`tool-button flex-1 ${drawingMode === 'erase' ? 'active' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDrawingMode('erase')}
                >
                  <Eraser className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Color</span>
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <motion.button
                      key={color.value}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentColor === color.value 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => {
                        setCurrentColor(color.value);
                        showNotification(`Color: ${color.name}`);
                      }}
                      whileHover={{ scale: currentColor === color.value ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Brush Size</span>
                  <span className="text-sm text-white">{brushSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button 
                    className="tool-button w-10 h-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBrushSize(Math.max(2, brushSize - 2))}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  
                  <div className="flex-1 h-10 glass rounded-lg flex items-center justify-center">
                    <div 
                      className="rounded-full bg-white transition-all"
                      style={{ 
                        width: Math.min(brushSize * 2, 30), 
                        height: Math.min(brushSize * 2, 30) 
                      }}
                    />
                  </div>
                  
                  <motion.button 
                    className="tool-button w-10 h-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBrushSize(Math.min(20, brushSize + 2))}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-4" />

              {/* Actions */}
              <div className="space-y-2">
                <motion.button 
                  className="glass-button w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleCamera}
                >
                  {cameraActive ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                  {cameraActive ? 'Pause Camera' : 'Resume Camera'}
                </motion.button>

                <motion.button 
                  className="glass-button glass-button-danger w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearCanvas}
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Canvas
                </motion.button>

                <motion.button 
                  className="glass-button glass-button-success w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadDrawing}
                >
                  <Download className="w-5 h-5" />
                  Download Drawing
                </motion.button>
              </div>
            </div>

            {/* Show Rules Button (when hidden) */}
            {!showRules && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-button w-full flex items-center justify-center gap-2"
                onClick={() => setShowRules(true)}
              >
                <Hand className="w-5 h-5" />
                Show Controls
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="toast flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
