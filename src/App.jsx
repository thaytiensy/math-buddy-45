import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CompanionMascot from './components/CompanionMascot';
import PracticeMode from './components/PracticeMode';
import SpeedArena from './components/SpeedArena';
import AdventureMap from './components/AdventureMap';
import ScratchpadModal from './components/ScratchpadModal';
import ReportModal from './components/ReportModal';
import QuestionManagerModal from './components/QuestionManagerModal';
import DocsHubModal from './components/DocsHubModal';
import {
  loadCurriculum,
  saveCurriculum,
  resetCurriculum,
  loadQuests,
  saveQuests,
  resetQuests,
} from './utils/curriculumStorage';
import { speakVietnamese } from './utils/audio';
import { OWNERSHIP_AUTHORS } from './data/appDocsContent';

export default function App() {
  const [selectedGrade, setSelectedGrade] = useState('grade4');
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'speed' | 'adventure'

  const [curriculum, setCurriculum] = useState(() => loadCurriculum());
  const [curriculumRevision, setCurriculumRevision] = useState(0);
  const [quests, setQuests] = useState(() => loadQuests());

  const [stars, setStars] = useState(() => {
    return parseInt(localStorage.getItem('math_stars') || '25', 10);
  });

  const [streak] = useState(() => {
    return parseInt(localStorage.getItem('math_streak') || '3', 10);
  });

  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [questionManagerOpts, setQuestionManagerOpts] = useState({
    scope: 'practice',
    grade: 'grade4',
    topicIndex: 0,
    questionIndex: null,
  });

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [docsInitialTab, setDocsInitialTab] = useState('slides');

  const [mascotMood, setMascotMood] = useState('happy');
  const [mascotMessage, setMascotMessage] = useState(
    'Chào bạn nhỏ! Cùng Cú Vàng giải toán nhận sao lấp lánh nhé!'
  );

  const currentCurriculum = curriculum[selectedGrade] || curriculum.grade4;

  const handleAddStars = (count) => {
    setStars((prev) => {
      const next = prev + count;
      localStorage.setItem('math_stars', next.toString());
      return next;
    });
  };

  const handleSpeakMascot = () => {
    speakVietnamese(mascotMessage);
  };

  const handleUpdateCurriculum = (nextCurriculum) => {
    const result = saveCurriculum(nextCurriculum);
    if (!result.ok) {
      return result;
    }
    setCurriculum(nextCurriculum);
    setCurriculumRevision((prev) => prev + 1);
    return result;
  };

  const handleResetCurriculum = () => {
    const restored = resetCurriculum();
    setCurriculum(restored);
    setCurriculumRevision((prev) => prev + 1);
  };

  const handleUpdateQuests = (nextQuests) => {
    const result = saveQuests(nextQuests);
    if (!result.ok) {
      return result;
    }
    setQuests(nextQuests);
    return result;
  };

  const handleResetQuests = () => {
    const restored = resetQuests();
    setQuests(restored);
  };

  const handleOpenQuestionManager = ({
    scope = 'practice',
    grade = selectedGrade,
    topicIndex = 0,
    questionIndex = null,
  } = {}) => {
    setQuestionManagerOpts({ scope, grade, topicIndex, questionIndex });
    setIsQuestionManagerOpen(true);
  };

  const handleOpenDocs = (tab = 'slides') => {
    setDocsInitialTab(tab);
    setIsDocsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Thanh điều hướng trên cùng */}
      <Navbar
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stars={stars}
        streak={streak}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenQuestionManager={() =>
          handleOpenQuestionManager({
            scope: activeTab === 'adventure' ? 'adventure' : 'practice',
            grade: selectedGrade,
            topicIndex: 0,
          })
        }
        onOpenDocs={() => handleOpenDocs('slides')}
      />

      {/* Khung nội dung chính */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6">
        <CompanionMascot
          mood={mascotMood}
          message={mascotMessage}
          onSpeak={handleSpeakMascot}
          extraBadge={currentCurriculum.title}
        />

        {activeTab === 'practice' && (
          <PracticeMode
            key={selectedGrade}
            curriculum={currentCurriculum}
            curriculumRevision={curriculumRevision}
            onAddStars={handleAddStars}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            onOpenQuestionManager={(topicIndex, questionIndex = null) =>
              handleOpenQuestionManager({
                scope: 'practice',
                grade: selectedGrade,
                topicIndex,
                questionIndex,
              })
            }
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
            quests={quests}
            stars={stars}
            onAddStars={handleAddStars}
            onOpenQuestionManager={() =>
              handleOpenQuestionManager({ scope: 'adventure' })
            }
            setMascotMood={setMascotMood}
            setMascotMessage={setMascotMessage}
          />
        )}
      </main>

      {/* Chân trang */}
      <footer className="bg-white border-t border-indigo-100 py-5 px-4 text-center text-xs text-slate-500 font-semibold space-y-1.5">
        <p className="font-bold text-slate-700">
          Toán Đồng Hành Lớp 4, 5 © 2026 • Chuẩn Chương trình Giáo dục phổ thông 2018
        </p>
        <p className="text-slate-500">
          Chủ nhiệm & Tác giả xây dựng:{' '}
          <span className="text-indigo-600 font-bold">{OWNERSHIP_AUTHORS}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() => handleOpenDocs('slides')}
            className="text-indigo-600 hover:underline font-bold"
          >
            Xem Slide hướng dẫn sử dụng
          </button>
          <span>•</span>
          <button
            onClick={() => handleOpenDocs('word')}
            className="text-blue-600 hover:underline font-bold"
          >
            Xem Bản mô tả ứng dụng
          </button>
          <span>•</span>
          <button
            onClick={() =>
              handleOpenQuestionManager({ scope: 'practice', grade: selectedGrade, topicIndex: 0 })
            }
            className="text-emerald-700 hover:underline font-bold"
          >
            Quản lý & Sửa câu hỏi
          </button>
        </div>
      </footer>

      {/* Cửa sổ chức năng */}
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

      <QuestionManagerModal
        isOpen={isQuestionManagerOpen}
        onClose={() => setIsQuestionManagerOpen(false)}
        curriculum={curriculum}
        onUpdateCurriculum={handleUpdateCurriculum}
        onResetCurriculum={handleResetCurriculum}
        quests={quests}
        onUpdateQuests={handleUpdateQuests}
        onResetQuests={handleResetQuests}
        initialScope={questionManagerOpts.scope}
        initialGrade={questionManagerOpts.grade}
        initialTopicIndex={questionManagerOpts.topicIndex}
        initialQuestionIndex={questionManagerOpts.questionIndex}
      />

      <DocsHubModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        initialTab={docsInitialTab}
      />
    </div>
  );
}
