import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Check, Award, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

const QUESTS = [
  { id: 1, name: 'Rừng Số Tự Nhiên', starsNeeded: 0, icon: '🌲', reward: 'Huy hiệu Mầm Xanh', challenge: 'Tìm giá trị của x: x - 450 = 1 250', answer: 1700, options: [1700, 800, 1600, 1800] },
  { id: 2, name: 'Thung Lũng Phân Số', starsNeeded: 20, icon: '🌈', reward: 'Huy hiệu Thợ Chia Bánh', challenge: 'Phân số 15/20 bằng phân số tối giản nào?', answer: '3/4', options: ['3/4', '5/4', '1/2', '3/5'] },
  { id: 3, name: 'Vực Thẳm Hình Học', starsNeeded: 50, icon: '📐', reward: 'Huy hiệu Kiến Trúc Sư Nhí', challenge: 'Chu vi hình vuông là 36 cm. Diện tích của nó là:', answer: '81 cm²', options: ['81 cm²', '144 cm²', '36 cm²', '72 cm²'] },
  { id: 4, name: 'Hồ Nước Thập Phân', starsNeeded: 80, icon: '💧', reward: 'Huy hiệu Bậc Thầy Dấu Phẩy', challenge: '0,25 viết dưới dạng phân số tối giản là:', answer: '1/4', options: ['1/4', '1/2', '2/5', '1/5'] },
  { id: 5, name: 'Đồi Gió Phần Trăm', starsNeeded: 120, icon: '🌾', reward: 'Huy hiệu Thần Tài Tính Nhẩm', challenge: '25% của 800 kg là:', answer: '200 kg', options: ['200 kg', '400 kg', '150 kg', '250 kg'] },
  { id: 6, name: 'Đỉnh Núi Siêu Chuyển Động', starsNeeded: 160, icon: '🏔️', reward: 'Cúp Nhà Thám Hiểm Hoàng Gia', challenge: 'Vận tốc 60 km/h. Sau 3 giờ đi được quãng đường bao nhiêu?', answer: '180 km', options: ['180 km', '20 km', '120 km', '200 km'] },
];

export default function AdventureMap({ stars, onAddStars, setMascotMood, setMascotMessage }) {
  const [activeQuest, setActiveQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState(() => {
    return JSON.parse(localStorage.getItem('completed_quests') || '[]');
  });

  const handleOpenQuest = (q) => {
    if (stars < q.starsNeeded) {
      sound.playWrong();
      setMascotMood('thinking');
      setMascotMessage(`Ải này cần ${q.starsNeeded} Sao để mở khóa. Bạn hãy làm bài tập để tích lũy thêm sao nhé!`);
      return;
    }
    sound.playClick();
    setActiveQuest(q);
  };

  const handleSolveChallenge = (opt) => {
    if (!activeQuest) return;
    if (opt === activeQuest.answer) {
      sound.playVictory();
      confetti({ particleCount: 70, spread: 70 });
      if (!completedQuests.includes(activeQuest.id)) {
        const updated = [...completedQuests, activeQuest.id];
        setCompletedQuests(updated);
        localStorage.setItem('completed_quests', JSON.stringify(updated));
        onAddStars(25);
      }
      setMascotMood('celebrate');
      setMascotMessage(`Xuất sắc! Bạn đã chinh phục thành công "${activeQuest.name}" và nhận ${activeQuest.reward}!`);
      setActiveQuest(null);
    } else {
      sound.playWrong();
      setMascotMood('encouraging');
      setMascotMessage('Chưa đúng rồi! Hãy suy nghĩ thật kỹ lại trước khi chọn nha!');
    }
  };

  return (
    <div className="math-card p-6 md:p-8 bg-white relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-indigo-100">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 w-max">
            <Compass size={14} /> Chế độ phiêu lưu
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-1">
            Bản Đồ Thám Hiểm Đảo Toán Học
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-bold">Đã chinh phục</span>
          <p className="text-lg font-black text-emerald-600">
            {completedQuests.length} / {QUESTS.length} Ải
          </p>
        </div>
      </div>

      {/* Quest Trail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUESTS.map((q) => {
          const isUnlocked = stars >= q.starsNeeded;
          const isDone = completedQuests.includes(q.id);

          return (
            <div
              key={q.id}
              onClick={() => handleOpenQuest(q)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500 shadow-sm'
                  : isUnlocked
                  ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500 shadow-md hover:scale-[1.02]'
                  : 'bg-slate-100/80 border-slate-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{q.icon}</span>
                {isDone ? (
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Check size={18} />
                  </span>
                ) : isUnlocked ? (
                  <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                    Ải {q.id}
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center">
                    <Lock size={16} />
                  </span>
                )}
              </div>

              <h4 className="font-black text-base text-slate-800">{q.name}</h4>
              <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                <Award size={14} className="text-amber-500" /> Phần thưởng: {q.reward}
              </p>

              {!isUnlocked && (
                <div className="mt-3 text-[11px] font-extrabold text-rose-500 bg-rose-50 p-2 rounded-xl border border-rose-200">
                  Cần tích lũy thêm {q.starsNeeded - stars} ⭐ để mở
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quest Modal */}
      {activeQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border-4 border-amber-300 text-center space-y-4">
            <span className="text-5xl">{activeQuest.icon}</span>
            <h3 className="text-xl font-black text-slate-800">
              Thử Thách Tại {activeQuest.name}
            </h3>
            <p className="text-base font-bold text-indigo-900 bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
              {activeQuest.challenge}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {activeQuest.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSolveChallenge(opt)}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-600 hover:text-white border-2 border-slate-200 hover:border-indigo-600 rounded-2xl font-black text-lg transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveQuest(null)}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 underline"
            >
              Rút lui về bản đồ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
