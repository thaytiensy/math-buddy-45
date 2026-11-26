import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, Play, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export default function SpeedArena({ selectedGrade, onAddStars, setMascotMood, setMascotMessage }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [currentMath, setCurrentMath] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(`speed_high_${selectedGrade}`) || '0', 10);
  });

  const timerRef = useRef(null);

  const generateProblem = () => {
    if (selectedGrade === 'grade4') {
      const types = ['add', 'sub', 'mul', 'fraction'];
      const type = types[Math.floor(Math.random() * types.length)];
      if (type === 'mul') {
        const a = Math.floor(Math.random() * 8) + 12;
        const b = Math.floor(Math.random() * 8) + 3;
        const ans = a * b;
        const fake1 = ans + (Math.random() > 0.5 ? 10 : -10);
        const fake2 = ans + (Math.random() > 0.5 ? 2 : -2);
        const fake3 = ans + 5;
        const opts = Array.from(new Set([ans, fake1, fake2, fake3])).slice(0, 4);
        while (opts.length < 4) opts.push(ans + opts.length * 3);
        return {
          question: `${a} × ${b} = ?`,
          answer: ans,
          options: opts.sort(() => Math.random() - 0.5),
        };
      } else if (type === 'fraction') {
        const den = 6;
        const num1 = Math.floor(Math.random() * 3) + 1;
        const num2 = Math.floor(Math.random() * 2) + 1;
        const sum = num1 + num2;
        return {
          question: `${num1}/${den} + ${num2}/${den} = ?`,
          answer: `${sum}/${den}`,
          options: [
            `${sum}/${den}`,
            `${sum + 1}/${den}`,
            `${sum}/${den * 2}`,
            `${Math.max(1, sum - 1)}/${den}`,
          ].sort(() => Math.random() - 0.5),
        };
      } else {
        const a = Math.floor(Math.random() * 400) + 100;
        const b = Math.floor(Math.random() * 300) + 50;
        const isAdd = type === 'add';
        const ans = isAdd ? a + b : a - b;
        const fake1 = ans + 10;
        const fake2 = ans - 10;
        const fake3 = ans + 20;
        return {
          question: `${a} ${isAdd ? '+' : '-'} ${b} = ?`,
          answer: ans,
          options: [ans, fake1, fake2, fake3].sort(() => Math.random() - 0.5),
        };
      }
    } else {
      const types = ['decimal-add', 'decimal-mul', 'percent'];
      const type = types[Math.floor(Math.random() * types.length)];
      if (type === 'percent') {
        const percents = [10, 20, 50, 25];
        const p = percents[Math.floor(Math.random() * percents.length)];
        const total = (Math.floor(Math.random() * 8) + 2) * 50;
        const ans = (total * p) / 100;
        const fake1 = ans + 10;
        const fake2 = ans - 5;
        const fake3 = ans * 2;
        return {
          question: `${p}% của ${total} là:`,
          answer: ans,
          options: [ans, fake1, fake2, fake3].sort(() => Math.random() - 0.5),
        };
      } else if (type === 'decimal-mul') {
        const a = (Math.floor(Math.random() * 50) + 10) / 10;
        const ans = Math.round(a * 10 * 10) / 10;
        return {
          question: `${a} × 10 = ?`,
          answer: ans,
          options: [ans, ans / 10, ans * 10, a + 10].sort(() => Math.random() - 0.5),
        };
      } else {
        const a = (Math.floor(Math.random() * 50) + 10) / 10;
        const b = (Math.floor(Math.random() * 40) + 5) / 10;
        const ans = Math.round((a + b) * 10) / 10;
        return {
          question: `${a} + ${b} = ?`,
          answer: ans,
          options: [
            ans,
            Math.round((ans + 0.5) * 10) / 10,
            Math.round((ans - 0.3) * 10) / 10,
            ans + 1,
          ].sort(() => Math.random() - 0.5),
        };
      }
    }
  };

  const startGame = () => {
    sound.playClick();
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(60);
    setScore(0);
    setStreakCount(0);
    setCurrentMath(generateProblem());
    setMascotMood('happy');
    setMascotMessage('Sẵn sàng chưa? Hãy bấm thật nhanh và chính xác nha!');
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
      setGameOver(true);
      sound.playVictory();

      const earnedStars = Math.floor(score / 5);
      if (earnedStars > 0) onAddStars(earnedStars);

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(`speed_high_${selectedGrade}`, score.toString());
        confetti({ particleCount: 100, spread: 80 });
        setMascotMood('celebrate');
        setMascotMessage(`Kỷ lục mới! Bạn đạt ${score} điểm trong Đấu trường! Xuất sắc!`);
      } else {
        setMascotMood('encouraging');
        setMascotMessage(`Hết giờ rồi! Bạn đạt ${score} điểm. Luyện tập thêm để phá kỷ lục nhé!`);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  const handleAnswer = (chosenOpt) => {
    if (!isPlaying) return;
    const isCorrect = chosenOpt === currentMath.answer;

    if (isCorrect) {
      sound.playCorrect();
      const nextStreak = streakCount + 1;
      setStreakCount(nextStreak);
      const points = 10 + (nextStreak > 2 ? 5 : 0);
      setScore((prev) => prev + points);
      if (nextStreak % 3 === 0) {
        confetti({ particleCount: 20, spread: 40 });
      }
    } else {
      sound.playWrong();
      setStreakCount(0);
    }
    setCurrentMath(generateProblem());
  };

  return (
    <div className="math-card p-6 md:p-8 bg-white relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-indigo-100">
        <div>
          <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 w-max">
            <Zap size={14} className="fill-rose-500" /> Thử thách phản xạ nhanh 60 Giây
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-1">
            Đấu Trường Tính Nhẩm Siêu Tốc
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-300 px-3 py-1.5 rounded-2xl">
            <Trophy size={18} className="text-yellow-600 fill-yellow-400" />
            <span className="text-xs font-bold text-amber-900">Kỷ lục: {highScore}</span>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-black text-lg ${
              timeLeft <= 10 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Timer size={20} />
            <span>{timeLeft} giây</span>
          </div>
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="text-center py-12 px-4 space-y-6 max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-rose-500 to-amber-500 rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-rose-200 animate-bounce-slow">
            ⚡
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">Sẵn Sàng Thách Đấu?</h3>
            <p className="text-slate-500 text-sm font-semibold mt-2">
              Trả lời đúng càng nhiều câu trong 60 giây để tạo chuỗi liên tiếp nhân điểm thưởng và nhận bão Sao!
            </p>
          </div>
          <button
            onClick={startGame}
            className="btn-fun btn-sunny w-full py-4 text-lg font-black shadow-lg"
          >
            <Play size={22} className="fill-amber-950" /> BẮT ĐẦU NGAY
          </button>
        </div>
      ) : isPlaying ? (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500">Điểm hiện tại</span>
              <p className="text-2xl font-black text-indigo-600">{score}</p>
            </div>
            {streakCount > 1 && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-xl text-xs font-black animate-wiggle flex items-center gap-1 shadow">
                🔥 CHUỖI LIÊN TIẾP x{streakCount} (+5 điểm)
              </div>
            )}
          </div>

          <div className="text-center py-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-200 shadow-inner">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
              Tính nhẩm thật nhanh:
            </span>
            <p className="text-4xl md:text-5xl font-black text-indigo-950 mt-2 font-mono tracking-tight">
              {currentMath?.question}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentMath?.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="p-5 bg-white hover:bg-indigo-600 hover:text-white border-2 border-indigo-200 hover:border-indigo-600 rounded-2xl font-black text-2xl text-slate-800 transition-all shadow-md active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 px-4 space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-yellow-300">
            🏆
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">Tổng Kết Đấu Trường</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">Bạn đã chiến đấu rất cừ khôi!</p>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200 flex justify-around">
            <div>
              <span className="text-xs text-slate-500 font-bold">Điểm đạt được</span>
              <p className="text-3xl font-black text-indigo-700">{score}</p>
            </div>
            <div className="border-r border-indigo-200"></div>
            <div>
              <span className="text-xs text-slate-500 font-bold">Sao nhận thưởng</span>
              <p className="text-3xl font-black text-amber-500">+{Math.floor(score / 5)} ⭐</p>
            </div>
          </div>

          <button onClick={startGame} className="btn-fun btn-primary w-full py-3.5 text-base">
            <RotateCcw size={18} /> Chơi lại lần nữa
          </button>
        </div>
      )}
    </div>
  );
}
