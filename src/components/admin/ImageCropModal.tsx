import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Crop, ZoomIn, ZoomOut, Check, RefreshCw, Sparkles, 
  Move, Image as ImageIcon, Sliders, Maximize2
} from 'lucide-react';

export interface CropTargetSpecs {
  title: string;
  recommendedWidth: number;
  recommendedHeight: number;
  aspectRatioLabel: string;
}

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  targetSpecs: CropTargetSpecs;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  targetSpecs,
  onConfirm,
  onCancel,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Target aspect ratio (width / height)
  const targetRatio = targetSpecs.recommendedWidth / targetSpecs.recommendedHeight;

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      // Reset zoom & pan
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Mouse / Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Crop & Export Canvas logic
  const handleApplyCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const targetW = targetSpecs.recommendedWidth;
    const targetH = targetSpecs.recommendedHeight;

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    // Calculate scaling to cover canvas
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let baseDrawW: number;
    let baseDrawH: number;

    if (imgRatio > targetRatio) {
      // Image is wider than target frame
      baseDrawH = targetH;
      baseDrawW = targetH * imgRatio;
    } else {
      // Image is taller than target frame
      baseDrawW = targetW;
      baseDrawH = targetW / imgRatio;
    }

    const scaledW = baseDrawW * zoom;
    const scaledH = baseDrawH * zoom;

    // Center offset + user drag offset scaled to target dimensions
    const previewBoxSize = 340; // width of interactive preview box
    const scaleFactor = targetW / previewBoxSize;

    const drawX = (targetW - scaledW) / 2 + offset.x * scaleFactor;
    const drawY = (targetH - scaledH) / 2 + offset.y * scaleFactor;

    ctx.drawImage(img, drawX, drawY, scaledW, scaledH);

    // Export high-quality JPEG / PNG
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onConfirm(croppedDataUrl);
  };

  // Smart Auto-Center Fit Reset
  const handleSmartFit = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#082C6C] via-[#0A2D6F] to-[#163E87] text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-serif-luxury">
                  Fotoğraf Kırpma & Boyutlandırma
                </h3>
                <p className="text-xs text-blue-200 font-light">
                  {targetSpecs.title}
                </p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="İptal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Specs Info Banner */}
          <div className="bg-amber-50 px-5 py-3 border-b border-amber-200/80 flex flex-wrap items-center justify-between text-xs gap-2 shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Hedef Önerilen Boyut:</span>
              <span className="bg-amber-200 px-2 py-0.5 rounded-md font-mono text-amber-950">
                {targetSpecs.recommendedWidth} x {targetSpecs.recommendedHeight} px ({targetSpecs.aspectRatioLabel})
              </span>
            </div>

            {naturalDimensions.width > 0 && (
              <span className="text-[11px] text-slate-500 font-medium">
                Yüklenen: {naturalDimensions.width} x {naturalDimensions.height} px
              </span>
            )}
          </div>

          {/* Interactive Workspace Area */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 flex flex-col items-center">
            
            <p className="text-xs text-slate-500 text-center flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-amber-600" />
              <span>Fotoğrafı fare ile sürükleyerek hizalayabilir veya zoom ile yaklaştırabilirsiniz.</span>
            </p>

            {/* Crop Preview Box */}
            <div 
              className="relative bg-slate-900 rounded-2xl overflow-hidden border-2 border-dashed border-amber-400/80 shadow-inner cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
              style={{
                width: '340px',
                height: `${340 / targetRatio}px`,
                maxHeight: '360px',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Image Transform Layer */}
              {imageSrc && (
                <div
                  className="absolute transition-transform duration-75 origin-center pointer-events-none"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Kırpılacak Görsel"
                    className="max-w-none pointer-events-none"
                    style={{
                      maxHeight: '360px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}

              {/* Grid Overlay Lines for Rule of Thirds */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20 opacity-30">
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div></div>
              </div>

              {/* Aspect Ratio Badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-amber-300 border border-white/10 pointer-events-none">
                {targetSpecs.aspectRatioLabel} Kadrajı
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="w-full max-w-md bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              
              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                    Yakınlaştır / Uzaklaştır (Zoom)
                  </span>
                  <span className="font-mono text-slate-500">%{Math.round(zoom * 100)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                    title="Uzaklaştır"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#082C6C]"
                  />

                  <button
                    onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                    title="Yakınlaştır"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                <button
                  onClick={handleSmartFit}
                  className="text-slate-600 hover:text-[#082C6C] font-semibold flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ortala & Sıfırla</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  Otomatik ideal boyuta boyutlandırılacaktır
                </span>
              </div>

            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              İptal
            </button>

            <button
              onClick={handleApplyCrop}
              className="px-5 py-2.5 rounded-xl bg-[#082C6C] hover:bg-[#163E87] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>Boyutlandır ve Kaydet</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
