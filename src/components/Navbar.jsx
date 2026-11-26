import React from 'react';
import {
  Star,
  Flame,
  Edit,
  Trophy,
  Compass,
  Zap,
  BookOpen,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { OWNERSHIP_AUTHORS } from '../data/appDocsContent';

export default function Navbar({
  selectedGrade,
  setSelectedGrade,
  activeTab,
  setActiveTab,
  stars,
  streak,
  onOpenScratchpad,
  onOpenReport,
  onOpenQuestionManager,
  onOpenDocs,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm px-4 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Thương hiệu */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-amber-500">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg md:text-xl text-indigo-950 tracking-tight">
                Toán Đồng Hành Lớp 4, 5
              </span>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                GDPT 2018
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-1">
              <span>Chủ nhiệm & Tác giả:</span>
              <span className="font-bold text-indigo-700">{OWNERSHIP_AUTHORS}</span>
            </p>
          </div>
        </div>

        {/* Bộ chọn khối lớp */}
        <div className="bg-indigo-50 p-1 rounded-2xl flex items-center border border-indigo-200">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedGrade('grade4');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
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
            className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              selectedGrade === 'grade5'
                ? 'bg-amber-500 text-amber-950 shadow-md'
                : 'text-indigo-800 hover:bg-indigo-100/60'
            }`}
          >
            📙 Lớp 5
          </button>
        </div>

        {/* Các chế độ học tập */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('practice');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'practice'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={15} /> Luyện tập
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('speed');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'speed'
                ? 'bg-white text-rose-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={15} /> Đấu trường 60 giây
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('adventure');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeTab === 'adventure'
                ? 'bg-white text-emerald-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass size={15} /> Thám hiểm
          </button>
        </div>

        {/* Nút tiện ích & Thành tích */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenQuestionManager();
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            title="Chỉnh sửa hoặc thêm câu hỏi và đáp án"
          >
            <SlidersHorizontal size={14} /> Sửa câu hỏi
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenDocs();
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            title="Xem Slide hướng dẫn và Bản mô tả ứng dụng"
          >
            <FileText size={14} /> Tài liệu
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenScratchpad();
            }}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl font-black text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            title="Mở bảng nháp tính toán"
          >
            <Edit size={14} /> Bảng Nháp
          </button>

          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-300 px-2.5 py-1 rounded-2xl shadow-sm">
            <Star size={16} className="fill-yellow-400 text-yellow-500" />
            <span className="font-black text-amber-950 text-sm">{stars}</span>
          </div>

          <div className="flex items-center gap-1 bg-orange-50 border border-orange-300 px-2.5 py-1 rounded-2xl shadow-sm">
            <Flame size={16} className="text-orange-500 fill-orange-400" />
            <span className="font-black text-orange-900 text-sm">{streak}</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenReport();
            }}
            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-200 transition-transform active:scale-95"
            title="Xem thành tích và Báo cáo học tập"
          >
            <Trophy size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
