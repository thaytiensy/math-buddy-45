import React from 'react';
import { Star, Flame, Edit, Trophy, Compass, Zap, BookOpen, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar({ 
  selectedGrade, 
  setSelectedGrade, 
  activeTab, 
  setActiveTab, 
  stars, 
  streak, 
  onOpenScratchpad, 
  onOpenReport 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm px-4 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-amber-500">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg md:text-xl text-indigo-950 tracking-tight">Toán Đồng Hành Lớp 4, 5</span>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                GDPT 2018
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <span>Chủ nhiệm & Tác giả:</span>
              <span className="font-bold text-indigo-700">Nguyễn Thị Minh Hiền & Nguyễn Thị Thủy Tiên</span>
            </p>
          </div>
        </div>

        {/* Grade Selector Toggle */}
        <div className="bg-indigo-50 p-1 rounded-2xl flex items-center border border-indigo-200">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedGrade('grade4');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              selectedGrade === 'grade4'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-indigo-800 hover:bg-indigo-100/60'
            }`}
          >
            📘 Lớp 4
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedGrade('grade5');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              selectedGrade === 'grade5'
                ? 'bg-amber-500 text-amber-950 shadow-md'
                : 'text-indigo-800 hover:bg-indigo-100/60'
            }`}
          >
            📙 Lớp 5
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => { sound.playClick(); setActiveTab('practice'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'practice'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={16} /> Luyện tập
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('speed'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'speed'
                ? 'bg-white text-rose-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={16} /> Đấu trường 60s
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('adventure'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'adventure'
                ? 'bg-white text-emerald-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass size={16} /> Thám hiểm
          </button>
        </div>

        {/* Action badges: Stars, Scratchpad & Report */}
        <div className="flex items-center gap-2">
          {/* Scratchpad Button */}
          <button
            onClick={() => { sound.playClick(); onOpenScratchpad(); }}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl font-black text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            title="Mở bảng nháp tính toán"
          >
            <Edit size={15} /> Bảng Nháp
          </button>

          {/* Stars */}
          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-300 px-3 py-1 rounded-2xl shadow-sm">
            <Star size={18} className="fill-yellow-400 text-yellow-500" />
            <span className="font-black text-amber-950 text-sm">{stars}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1 bg-orange-50 border border-orange-300 px-3 py-1 rounded-2xl shadow-sm">
            <Flame size={18} className="text-orange-500 fill-orange-400" />
            <span className="font-black text-orange-900 text-sm">{streak}</span>
          </div>

          {/* Report / Achievements */}
          <button
            onClick={() => { sound.playClick(); onOpenReport(); }}
            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-200 transition-transform active:scale-95"
            title="Xem thành tích & Báo cáo học tập"
          >
            <Trophy size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
