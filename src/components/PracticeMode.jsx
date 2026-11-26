import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Square,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Edit,
  Pencil,
} from 'lucide-react';
import VisualHelper from './VisualHelper';
import { sound, speakVietnamese, stopVietnameseSpeech } from '../utils/audio';

export default function PracticeMode({
  curriculum,
  onAddStars,
  onOpenScratchpad,
  onOpenQuestionManager,
  setMascotMood,
  setMascotMessage,
}) {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const safeTopicIndex = Math.min(
    selectedTopicIndex,
    Math.max(0, (curriculum.topics?.length || 1) - 1)
  );
  const currentTopic = curriculum.topics[safeTopicIndex] || curriculum.topics[0];
  const questions = currentTopic.questions || [];
  const safeQuestionIndex = Math.min(
    currentQuestionIndex,
    Math.max(0, questions.length - 1)
  );
  const currentQ = questions[safeQuestionIndex] || questions[0];

  useEffect(() => {
    if (currentQuestionIndex !== safeQuestionIndex) {
      setCurrentQuestionIndex(safeQuestionIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [questions.length, currentQuestionIndex, safeQuestionIndex]);

  useEffect(() => {
    return () => {
      stopVietnameseSpeech();
    };
  }, []);

  const handleToggleSpeak = (text) => {
    if (isSpeaking) {
      stopVietnameseSpeech();
      setIsSpeaking(false);
      return;
    }
    speakVietnamese(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSelectAnswer = (idx) => {
    if (isAnswered || !currentQ) return;
    sound.playClick();
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answerIndex;
    if (isCorrect) {
      sound.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      onAddStars(10);
      setMascotMood('celebrate');
      setMascotMessage('Tuyệt vời lắm! Bạn đã tìm ra đáp án chính xác rồi!');
    } else {
      sound.playWrong();
      setMascotMood('encouraging');
      setMascotMessage('Đừng nản lòng nhé! Xem ngay lời giải chi tiết bên dưới để hiểu bài nha!');
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    stopVietnameseSpeech();
    setIsSpeaking(false);
    if (safeQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
      setMascotMood('happy');
      setMascotMessage('Cùng tiếp tục chinh phục câu tiếp theo nào!');
    } else {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
      sound.playVictory();
      setMascotMood('celebrate');
      setMascotMessage('Hoan hô! Bạn đã hoàn thành xuất sắc toàn bộ chủ đề này!');
    }
  };

  if (!currentQ) {
    return (
      <div className="math-card p-8 bg-white text-center space-y-3">
        <p className="font-bold text-slate-600">Chủ đề này chưa có câu hỏi nào.</p>
        {onOpenQuestionManager && (
          <button
            onClick={() => onOpenQuestionManager(safeTopicIndex)}
            className="btn-fun btn-primary mx-auto px-5 py-2.5 text-sm"
          >
            <Pencil size={16} /> Thêm câu hỏi ngay
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thanh chọn chủ đề */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {curriculum.topics.map((topic, idx) => (
          <button
            key={topic.id}
            onClick={() => {
              sound.playClick();
              stopVietnameseSpeech();
              setIsSpeaking(false);
              setSelectedTopicIndex(idx);
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setShowHint(false);
            }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 border ${
              safeTopicIndex === idx
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                : 'bg-white text-slate-700 border-indigo-100 hover:bg-indigo-50'
            }`}
          >
            <span>📌</span>
            <span>{topic.name}</span>
          </button>
        ))}
      </div>

      {/* Thẻ câu hỏi chính */}
      <div className="math-card p-6 md:p-8 bg-white relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-indigo-50">
          <div>
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
              {currentTopic.name}
            </span>
            <h2 className="text-sm font-semibold text-slate-500">
              Câu hỏi {safeQuestionIndex + 1} / {questions.length}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleToggleSpeak(currentQ.question)}
              className={`p-2.5 rounded-2xl border transition-transform active:scale-90 flex items-center gap-1.5 text-xs font-bold ${
                isSpeaking
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
              }`}
              title="Đọc to đề bài bằng giọng tiếng Việt"
            >
              {isSpeaking ? <Square size={15} /> : <Volume2 size={16} />}
              <span>{isSpeaking ? 'Dừng đọc' : 'Nghe đề'}</span>
            </button>
            <button
              onClick={onOpenScratchpad}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-2xl border border-amber-200 transition-transform active:scale-90 flex items-center gap-1.5 text-xs font-bold"
              title="Mở bảng nháp"
            >
              <Edit size={16} /> Bảng nháp
            </button>
            {onOpenQuestionManager && (
              <button
                onClick={() => onOpenQuestionManager(safeTopicIndex)}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200 transition-transform active:scale-90 flex items-center gap-1.5 text-xs font-bold"
                title="Tự chỉnh sửa câu hỏi và đáp án"
              >
                <Pencil size={15} /> Sửa câu hỏi
              </button>
            )}
          </div>
        </div>

        {/* Nội dung đề bài */}
        <div className="my-4">
          <p className="text-lg md:text-xl font-black text-slate-800 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* Hình minh họa */}
        {currentQ.visualType && (
          <div className="my-4">
            <VisualHelper type={currentQ.visualType} data={currentQ.visualData} />
          </div>
        )}

        {/* Gợi ý */}
        {showHint && (
          <div className="my-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 animate-fade-in">
            <Lightbulb size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-black text-amber-900 uppercase">Gợi ý cách làm:</span>
              <p className="text-sm text-amber-950 font-semibold mt-0.5">{currentQ.hint}</p>
            </div>
          </div>
        )}

        {/* 4 phương án trả lời */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 text-slate-800';
            if (isAnswered) {
              if (idx === currentQ.answerIndex) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-[1.02]';
              } else if (idx === selectedAnswer) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-md';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(idx)}
                className={`p-4 rounded-2xl border-2 font-black text-base md:text-lg flex items-center justify-between text-left transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                      isAnswered && idx === currentQ.answerIndex
                        ? 'bg-white text-emerald-600'
                        : 'bg-white/80 text-slate-700 shadow-sm'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswered && idx === currentQ.answerIndex && (
                  <CheckCircle2 size={22} className="text-white flex-shrink-0" />
                )}
                {isAnswered && idx === selectedAnswer && idx !== currentQ.answerIndex && (
                  <XCircle size={22} className="text-white flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Điều khiển gợi ý & chuyển câu */}
        <div className="pt-4 border-t border-indigo-50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
            className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-amber-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle size={16} /> {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý tư duy'}
          </button>

          {isAnswered && (
            <button onClick={handleNextQuestion} className="btn-fun btn-primary px-6 py-2.5 text-sm">
              <span>
                {safeQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành chủ đề'}
              </span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Lời giải chi tiết */}
        {isAnswered && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                <span className="text-xs font-black text-indigo-900 uppercase">
                  Lời giải chi tiết chuẩn phương pháp:
                </span>
              </div>
              <button
                onClick={() => speakVietnamese(currentQ.explanation)}
                className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold flex items-center gap-1"
              >
                <Volume2 size={14} /> Nghe lời giải
              </button>
            </div>
            <p className="text-sm font-bold text-indigo-950 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
