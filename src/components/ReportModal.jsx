import React from 'react';
import { X, Award, Star, Flame, CheckCircle, Printer, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function ReportModal({ isOpen, onClose, stars, streak }) {
  if (!isOpen) return null;

  const getRank = (s) => {
    if (s >= 200) return { title: 'Thần Đồng Toán Học Đại Tài', badge: '👑 Kim Cương', color: 'from-amber-400 to-yellow-500' };
    if (s >= 100) return { title: 'Kiện Tướng Tính Nhẩm Lớp 4-5', badge: '🥇 Vàng', color: 'from-yellow-400 to-amber-500' };
    if (s >= 50) return { title: 'Nhà Thám Hiểm Toán Học Tri Thức', badge: '🥈 Bạc', color: 'from-sky-400 to-blue-500' };
    return { title: 'Tập Sự Chăm Chỉ Đồng Hành', badge: '🥉 Đồng', color: 'from-emerald-400 to-teal-500' };
  };

  const rank = getRank(stars);

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-indigo-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <h3 className="font-black text-xl">Báo Cáo Học Tập & Vinh Danh</h3>
              <p className="text-xs text-indigo-100 font-semibold">Theo dõi sự tiến bộ từng ngày của bạn nhỏ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Certificate Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto bg-amber-400 text-amber-950 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-amber-500 mb-3">
              🦉
            </div>
            <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
              Danh hiệu danh dự hiện tại
            </span>
            <h4 className="text-2xl font-black text-amber-950 mt-1">{rank.title}</h4>
            <div className="inline-block mt-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-black px-3 py-1 rounded-full shadow">
              Hạng: {rank.badge}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <Star size={24} className="mx-auto text-amber-500 fill-amber-400 mb-1" />
              <span className="text-xs text-slate-500 font-bold">Tổng số Sao</span>
              <p className="text-2xl font-black text-slate-800">{stars} ⭐</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <Flame size={24} className="mx-auto text-orange-500 fill-orange-400 mb-1" />
              <span className="text-xs text-slate-500 font-bold">Chuỗi chuyên cần</span>
              <p className="text-2xl font-black text-slate-800">{streak} Ngày</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
              <Award size={24} className="mx-auto text-indigo-500 mb-1" />
              <span className="text-xs text-slate-500 font-bold">Khung chuẩn</span>
              <p className="text-lg font-black text-indigo-700">GDPT 2018</p>
            </div>
          </div>

          {/* Skill Progress Bars */}
          <div className="space-y-3">
            <h5 className="font-black text-sm text-slate-700 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-600" /> Kỹ năng toán trọng tâm đã rèn luyện
            </h5>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Số tự nhiên & 4 phép tính lớn</span>
                  <span className="text-indigo-600">Thành thạo 90%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[90%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Phân số & Số thập phân</span>
                  <span className="text-blue-600">Thành thạo 85%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[85%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Hình học & Đo lường (Diện tích, thể tích)</span>
                  <span className="text-amber-600">Thành thạo 75%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[75%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Toán có lời văn & Chuyển động đều</span>
                  <span className="text-emerald-600">Thành thạo 80%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer size={16} /> In phiếu khen thưởng
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
