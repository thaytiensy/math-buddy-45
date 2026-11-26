import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Trash2, Edit3, Palette } from 'lucide-react';

export default function ScratchpadModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal resolution matching display
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen]);

  if (!isOpen) return null;

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 3 : lineWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#0f172a'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border-4 border-amber-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-black text-lg md:text-xl text-amber-950">Bảng Nháp Thông Minh Của Bé</h3>
              <p className="text-xs text-amber-900 font-semibold">Tự do đặt tính, vẽ sơ đồ đoạn thẳng, tính nhẩm nhé!</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-amber-600/30 hover:bg-amber-600/50 rounded-full transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
              <Palette size={16} /> Màu bút:
            </span>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c && !isEraser ? 'scale-125 ring-2 ring-offset-2 ring-blue-500 shadow-md' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEraser(false)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                !isEraser ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Edit3 size={15} /> Bút vẽ
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                isEraser ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Eraser size={15} /> Tẩy chì
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 transition-all"
            >
              <Trash2 size={15} /> Xóa sạch nháp
            </button>
          </div>
        </div>

        {/* Canvas Workspace */}
        <div className="flex-1 relative bg-white touch-none cursor-crosshair">
          <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            className="w-full h-full block bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
          />
          <div className="absolute bottom-3 left-4 pointer-events-none text-xs text-slate-400 font-medium">
            💡 Mẹo: Bé có thể dùng bút cảm ứng hoặc chuột vẽ sơ đồ đoạn thẳng để giải toán có lời văn!
          </div>
        </div>
      </div>
    </div>
  );
}
