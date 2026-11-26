import React from 'react';

export default function VisualHelper({ type, data }) {
  if (!type || type === 'none') return null;

  switch (type) {
    case 'fraction': {
      const num = data?.num ?? 3;
      const den = data?.den ?? 4;
      return (
        <div className="flex items-center justify-center p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200">
          <div className="flex items-center gap-4 text-center">
            <span className="text-sm font-bold text-indigo-700">Hình minh họa phân số:</span>
            <div className="grid grid-cols-4 gap-1 w-32 h-8 border-2 border-indigo-500 rounded-lg p-0.5 bg-white">
              <div className="bg-indigo-500 rounded"></div>
              <div className="bg-indigo-500 rounded"></div>
              <div className="bg-indigo-500 rounded"></div>
              <div className="bg-slate-100 rounded"></div>
            </div>
            <span className="font-black text-indigo-900 text-lg">{num}/{den}</span>
          </div>
        </div>
      );
    }

    case 'parallelogram': {
      const base = data?.base ?? 18;
      const height = data?.height ?? 10;
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
      const d1 = data?.d1 ?? 16;
      const d2 = data?.d2 ?? 12;
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
      const r = data?.r ?? 5;
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
      const s = data?.s ?? 135;
      const t = data?.t ?? '2,5 giờ';
      const v = data?.v ?? 54;
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
            Thời gian: {t} ➔ Vận tốc v = {s} : 2,5 = {v} km/giờ
          </p>
        </div>
      );
    }

    default:
      return null;
  }
}
