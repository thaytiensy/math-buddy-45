import React, { useState, useEffect } from 'react';
import { Lightbulb, ZoomIn, X, ImageOff } from 'lucide-react';

export default function VisualHelper({ type, data }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl = data?.imageUrl || data?.url || data?.src || '';

  useEffect(() => {
    setImgError(false);
    setIsZoomed(false);
  }, [type, imageUrl]);

  if (!type || type === 'none') return null;

  switch (type) {
    case 'image': {
      if (!imageUrl) return null;
      const caption = data?.caption || '';
      return (
        <>
          <div className="p-3 md:p-4 bg-gradient-to-br from-indigo-50/80 to-sky-50/80 rounded-2xl border border-indigo-200 flex flex-col items-center gap-2">
            {!imgError ? (
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="group relative inline-block focus:outline-none"
                title="Bấm vào ảnh để phóng to xem rõ nét"
              >
                <img
                  src={imageUrl}
                  alt={caption || 'Hình minh họa bài toán'}
                  onError={() => setImgError(true)}
                  className="max-h-64 w-auto max-w-full rounded-2xl shadow-md border-2 border-white object-contain bg-white transition-transform group-hover:scale-[1.01]"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-slate-900/75 text-white text-[11px] font-bold flex items-center gap-1 shadow">
                  <ZoomIn size={13} /> Phóng to
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                <ImageOff size={16} className="flex-shrink-0" />
                <span>Không tải được hình ảnh từ đường dẫn này. Vui lòng kiểm tra lại link ảnh hoặc tải ảnh từ máy.</span>
              </div>
            )}
            {caption && (
              <p className="text-xs font-bold text-indigo-900 text-center">{caption}</p>
            )}
          </div>

          {isZoomed && !imgError && (
            <div
              onClick={() => setIsZoomed(false)}
              className="fixed inset-0 z-[70] bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full flex flex-col items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  aria-label="Đóng xem ảnh phóng to"
                  className="self-end px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-lg hover:bg-slate-100"
                >
                  <X size={16} /> Đóng ảnh
                </button>
                <img
                  src={imageUrl}
                  alt={caption || 'Hình minh họa phóng to'}
                  className="max-h-[82vh] max-w-full rounded-2xl shadow-2xl border-4 border-white bg-white object-contain"
                />
                {caption && (
                  <p className="text-sm font-bold text-white bg-slate-900/70 px-4 py-1.5 rounded-full">
                    {caption}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      );
    }

    case 'place-value': {
      const millions = String(data?.millions ?? '72');
      const thousands = String(data?.thousands ?? '005');
      const units = String(data?.units ?? '400');
      return (
        <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-2.5">
          <p className="text-xs font-black text-indigo-900 uppercase text-center tracking-wide">
            Bảng phân tích cấu tạo số theo các lớp
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm">
              <span className="block text-[11px] font-bold uppercase opacity-90">Lớp triệu</span>
              <span className="block text-xl md:text-2xl font-black tracking-widest mt-0.5">
                {millions}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <span className="block text-[11px] font-bold uppercase opacity-90">Lớp nghìn</span>
              <span className="block text-xl md:text-2xl font-black tracking-widest mt-0.5">
                {thousands}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm">
              <span className="block text-[11px] font-bold uppercase opacity-90">Lớp đơn vị</span>
              <span className="block text-xl md:text-2xl font-black tracking-widest mt-0.5">
                {units}
              </span>
            </div>
          </div>
          <p className="text-xs font-bold text-indigo-800 text-center">
            Mẹo đọc/viết: Tách số thành từng nhóm 3 chữ số từ phải sang trái (Đơn vị → Nghìn → Triệu).
          </p>
        </div>
      );
    }

    case 'tip-card': {
      const rule = data?.rule || 'Nhóm các số tròn chục, tròn trăm để tính nhẩm thật nhanh!';
      return (
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 flex flex-wrap items-center justify-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm">
              <Lightbulb size={18} />
            </span>
            <span className="text-xs md:text-sm font-black uppercase">Mẹo tính nhanh:</span>
          </div>
          <span className="px-4 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-black text-base md:text-lg shadow-inner font-mono">
            {rule}
          </span>
        </div>
      );
    }

    case 'fraction': {
      const num = Math.max(0, Number(data?.num ?? 3));
      const den = Math.max(1, Number(data?.den ?? 4));
      const filled = Math.min(num, den);
      return (
        <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-center">
          <span className="text-sm font-bold text-indigo-700">Hình minh họa phân số:</span>
          {den <= 16 ? (
            <div
              className="grid gap-1 min-w-28 max-w-xs h-8 border-2 border-indigo-500 rounded-lg p-0.5 bg-white"
              style={{ gridTemplateColumns: `repeat(${den}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: den }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded ${i < filled ? 'bg-indigo-500' : 'bg-slate-100'}`}
                />
              ))}
            </div>
          ) : (
            <div className="w-40 h-6 border-2 border-indigo-500 rounded-lg p-0.5 bg-white overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded"
                style={{ width: `${Math.min(100, Math.round((filled / den) * 100))}%` }}
              />
            </div>
          )}
          <span className="font-black text-indigo-900 text-lg">
            {num}/{den}
          </span>
        </div>
      );
    }

    case 'parallelogram': {
      const base = Number(data?.base ?? 18);
      const height = Number(data?.height ?? 10);
      return (
        <div className="flex flex-col items-center justify-center p-3 bg-sky-50 rounded-2xl border border-sky-200">
          <svg className="w-56 h-28" viewBox="0 0 200 100">
            <polygon points="50,15 190,15 150,85 10,85" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
            <line x1="50" y1="15" x2="50" y2="85" stroke="#e11d48" strokeWidth="2" strokeDasharray="4" />
            <text x="75" y="98" fill="#0369a1" fontWeight="bold" fontSize="12">Đáy a = {base} cm</text>
            <text x="55" y="55" fill="#e11d48" fontWeight="bold" fontSize="12">h = {height} cm</text>
          </svg>
          <span className="text-xs font-bold text-sky-800 mt-1">
            Công thức: S = a × h = {base} × {height} = {base * height} cm²
          </span>
        </div>
      );
    }

    case 'rhombus': {
      const d1 = Number(data?.d1 ?? 16);
      const d2 = Number(data?.d2 ?? 12);
      return (
        <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-2xl border border-amber-200">
          <svg className="w-48 h-28" viewBox="0 0 200 100">
            <polygon points="100,10 180,50 100,90 20,50" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
            <line x1="20" y1="50" x2="180" y2="50" stroke="#2563eb" strokeWidth="2" strokeDasharray="3" />
            <line x1="100" y1="10" x2="100" y2="90" stroke="#16a34a" strokeWidth="2" strokeDasharray="3" />
            <text x="70" y="45" fill="#2563eb" fontWeight="bold" fontSize="11">m = {d1} cm</text>
            <text x="105" y="75" fill="#16a34a" fontWeight="bold" fontSize="11">n = {d2} cm</text>
          </svg>
          <span className="text-xs font-bold text-amber-800 mt-1">
            Công thức: S = (m × n) : 2 = ({d1} × {d2}) : 2 = {(d1 * d2) / 2} cm²
          </span>
        </div>
      );
    }

    case 'circle': {
      const r = Number(data?.r ?? 5);
      const area = Math.round(r * r * 3.14 * 100) / 100;
      return (
        <div className="flex items-center justify-center gap-4 p-3 bg-rose-50 rounded-2xl border border-rose-200">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#fecdd3" stroke="#e11d48" strokeWidth="3" />
            <line x1="50" y1="50" x2="90" y2="50" stroke="#be123c" strokeWidth="2" strokeDasharray="3" />
            <circle cx="50" cy="50" r="3" fill="#be123c" />
            <text x="60" y="45" fill="#be123c" fontWeight="bold" fontSize="11">r = {r} cm</text>
          </svg>
          <div className="text-left text-xs font-bold text-rose-900">
            <p>Bán kính r = {r} cm</p>
            <p className="text-rose-600 font-extrabold text-sm">
              S = r × r × 3,14 = {String(area).replace('.', ',')} cm²
            </p>
          </div>
        </div>
      );
    }

    case 'motion-car': {
      const s = Number(data?.s ?? 135);
      const t = data?.t ?? '2,5 giờ';
      const v = Number(data?.v ?? 54);
      return (
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
            <span>Khởi hành (A)</span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full">Quãng đường: {s} km</span>
            <span>Đến nơi (B)</span>
          </div>
          <div className="relative h-6 bg-slate-200 rounded-full flex items-center px-1">
            <div className="absolute left-1/2 -translate-x-1/2 text-2xl -top-3">
              🚗💨
            </div>
          </div>
          <p className="text-center text-xs font-bold text-emerald-700 mt-2">
            Thời gian: {t} ➔ Vận tốc v = s : t = {v} km/giờ
          </p>
        </div>
      );
    }

    default:
      return null;
  }
}
