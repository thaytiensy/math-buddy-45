import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CompanionMascot from './components/CompanionMascot';
import PracticeMode from './components/PracticeMode';
import SpeedArena from './components/SpeedArena';
import AdventureMap from './components/AdventureMap';
import ScratchpadModal from './components/ScratchpadModal';
import ReportModal from './components/ReportModal';
import { CURRICULUM } from './data/curriculum';
import { sound, speakVietnamese } from './utils/audio';

export default function App() {
  const [selectedGrade, setSelectedGrade] = useState('grade4');
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'speed' | 'adventure'
  
  const [stars, setStars] = useState(() => {
    return parseInt(localStorage.getItem('math_stars') || '25', 10);
  });
  
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('math_streak') || '3', 10);
  });

  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [mascotMood, setMascotMood] = useState('happy');
  const [mascotMessage, setMascotMessage] = useState(
    'Chào bạn nhỏ! Cùng Cú Vàng Poki giải toán nhận sao lấp lánh nhé!'
  );

  const currentCurriculum = CURRICULUM[selectedGrade];

  const handleAddStars = (count) => {
    setStars(prev => {
      const next = prev + count;
      localStorage.setItem('math_stars', next.toString());
      return next;
    });
  };

  const handleSpeakMascot = () => {
    speakVietnamese(mascotMessage);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stars={stars}
        streak={streak}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Banner with Companion Mascot */}
        <CompanionMascot
          mood={mascotMood}
          message={mascotMessage}
          onSpeak={handleSpeakMascot}
          extraBadge={currentCurriculum.title}
        />

        {/* Tab Content */}
        {activeTab === 'practice' && (
          <PracticeMode
            key={selectedGrade}
            curriculum={currentCurriculum}
            onAddStars={handleAddStars}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            setMascotMood={setMascotMood}
            setMascotMessage={setMascotMessage}
          />
        )}

        {activeTab === 'speed' && (
          <SpeedArena
            key={selectedGrade}
            selectedGrade={selectedGrade}
            onAddStars={handleAddStars}
            setMascotMood={setMascotMood}
            setMascotMessage={setMascotMessage}
          />
        )}

        {activeTab === 'adventure' && (
          <AdventureMap
            stars={stars}
            onAddStars={handleAddStars}
            setMascotMood={setMascotMood}
            setMascotMessage={setMascotMessage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-indigo-100 py-5 text-center text-xs text-slate-500 font-semibold space-y-1">
        <p className="font-bold text-slate-700">
          Toán Đồng Hành Lớp 4, 5 © 2026 • Chuẩn chương trình GDPT 2018
        </p>
        <p className="text-slate-500">
          Chủ nhiệm & Tác giả xây dựng: <span className="text-indigo-600 font-bold">Nguyễn Thị Minh Hiền</span> & <span className="text-indigo-600 font-bold">Nguyễn Thị Thủy Tiên</span>
        </p>
      </footer>

      {/* Modals */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stars={stars}
        streak={streak}
      />
    </div>
  );
}
