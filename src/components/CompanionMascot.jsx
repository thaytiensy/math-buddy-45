import React from 'react';
import { Volume2, Sparkles, Award } from 'lucide-react';
import { speakVietnamese } from '../utils/audio';

export default function CompanionMascot({ mood = 'happy', message, onSpeak, extraBadge }) {
  const mascotFaces = {
    happy: '🦉',
    thinking: '🤔',
    celebrate: '🥳',
    encouraging: '💪',
  };

  const speechBubbles = {
    happy: 'Xin chào bạn nhỏ! Cùng Cú Vàng giải toán nhận sao lấp lánh nhé!',
    thinking: 'Hừm... Hãy đọc kĩ từng dữ kiện đề bài cho nha bạn!',
    celebrate: 'Đỉnh quá! Bạn làm đúng rồi, nhận thêm 10 Sao Siêu Đẳng!',
    encouraging: 'Đừng lo lắng, sai một chút là cơ hội để học bài học mới đó!',
  };

  const currentMessage = message || speechBubbles[mood] || speechBubbles.happy;

  return (
    <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 rounded-3xl p-4 md:p-5 border-2 border-amber-300 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-inner border-2 border-amber-500 animate-bounce-slow">
          {mascotFaces[mood] || '🦉'}
        </div>
        <span className="absolute -bottom-2 -right-1 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
          Cú Vàng
        </span>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
            <Sparkles size={14} className="text-amber-600" /> Trợ lý học toán thông minh
          </span>
          {extraBadge && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Award size={12} /> {extraBadge}
            </span>
          )}
        </div>
        <p className="text-sm md:text-base font-bold text-slate-800 leading-snug">
          "{currentMessage}"
        </p>
      </div>

      <button
        onClick={() => {
          if (onSpeak) onSpeak();
          else speakVietnamese(currentMessage);
        }}
        className="p-3 bg-white hover:bg-amber-50 text-amber-600 rounded-2xl shadow-sm border border-amber-200 transition-transform active:scale-90"
        title="Bấm để Cú Vàng đọc to cho bạn nghe"
      >
        <Volume2 size={20} />
      </button>
    </div>
  );
}
