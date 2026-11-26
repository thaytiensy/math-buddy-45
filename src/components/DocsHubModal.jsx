import React, { useState, useEffect } from 'react';
import {
  X,
  Presentation,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Square,
  Printer,
  CheckCircle2,
  UserCheck,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import {
  OWNERSHIP_AUTHORS,
  DOC_PATHS,
  SLIDE_DECK,
  APP_DESCRIPTION_DOC,
} from '../data/appDocsContent';
import { sound, speakVietnamese, stopVietnameseSpeech } from '../utils/audio';

export default function DocsHubModal({ isOpen, onClose, initialTab = 'slides' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setZoomedImage(null);
    } else {
      stopVietnameseSpeech();
      setIsSpeaking(false);
      setZoomedImage(null);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'slides') return;
    const handleKey = (e) => {
      if (e.key === 'Escape' && zoomedImage) {
        setZoomedImage(null);
        return;
      }
      if (e.key === 'ArrowRight') {
        setSlideIndex((prev) => Math.min(SLIDE_DECK.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, activeTab, zoomedImage]);

  if (!isOpen) return null;

  const currentSlide = SLIDE_DECK[slideIndex] || SLIDE_DECK[0];

  const handleToggleSpeakSlide = () => {
    if (isSpeaking) {
      stopVietnameseSpeech();
      setIsSpeaking(false);
      return;
    }
    const content = [
      currentSlide.title,
      currentSlide.subtitle,
      currentSlide.highlight,
      ...currentSlide.bullets,
      currentSlide.tip,
    ]
      .filter(Boolean)
      .join('. ');

    speakVietnamese(content, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleClose = () => {
    stopVietnameseSpeech();
    setIsSpeaking(false);
    setZoomedImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden border-4 border-indigo-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 px-5 md:px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl">
              📚
            </div>
            <div>
              <h3 className="font-black text-lg md:text-xl leading-tight">
                Tài Liệu Hướng Dẫn & Mô Tả Ứng Dụng
              </h3>
              <p className="text-xs text-indigo-100 font-semibold flex items-center gap-1.5 mt-0.5">
                <UserCheck size={14} />
                <span>Chủ nhiệm & Tác giả: {OWNERSHIP_AUTHORS}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Đóng cửa sổ tài liệu"
            className="p-2 bg-white/15 hover:bg-white/25 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sub-nav & Download Actions */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => {
                sound.playClick();
                stopVietnameseSpeech();
                setIsSpeaking(false);
                setActiveTab('slides');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 transition-all ${
                activeTab === 'slides'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Presentation size={16} /> Slide Hướng Dẫn ({SLIDE_DECK.length} trang)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                stopVietnameseSpeech();
                setIsSpeaking(false);
                setActiveTab('word');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 transition-all ${
                activeTab === 'word'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={16} /> Bản Mô Tả Ứng Dụng
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={DOC_PATHS.pptx}
              download={DOC_PATHS.pptxFileName}
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Download size={15} /> Tải Slide (.pptx)
            </a>
            <a
              href={DOC_PATHS.docx}
              download={DOC_PATHS.docxFileName}
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Download size={15} /> Tải Bản Mô Tả (.docx)
            </a>
          </div>
        </div>

        {/* Main Viewer Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/70">
          {activeTab === 'slides' ? (
            <div className="space-y-4 max-w-5xl mx-auto">
              {/* Slide Canvas */}
              <div className="bg-white rounded-3xl shadow-lg border-2 border-indigo-100 overflow-hidden">
                <div className={`bg-gradient-to-r ${currentSlide.accent} px-6 py-4 text-white`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="bg-white/20 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wide">
                      Trang {currentSlide.id} / {SLIDE_DECK.length} • {currentSlide.tag}
                    </span>
                    <button
                      onClick={handleToggleSpeakSlide}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {isSpeaking ? <Square size={14} /> : <Volume2 size={14} />}
                      <span>{isSpeaking ? 'Dừng đọc' : 'Nghe thuyết minh trang này'}</span>
                    </button>
                  </div>
                  <h4 className="text-xl md:text-2xl font-black leading-snug">
                    {currentSlide.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/90 font-semibold mt-0.5">
                    {currentSlide.subtitle}
                  </p>
                </div>

                <div className="p-5 md:p-6 space-y-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-2.5 text-indigo-900 font-black text-xs md:text-sm">
                    <Sparkles size={17} className="text-indigo-600 flex-shrink-0" />
                    <span>{currentSlide.highlight}</span>
                  </div>

                  {/* Nội dung 2 cột: Hướng dẫn chữ + Hình ảnh thật có chú thích */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-span-5 space-y-3">
                      <ul className="space-y-2.5">
                        {currentSlide.bullets.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs md:text-sm font-bold text-slate-800 leading-relaxed"
                          >
                            <CheckCircle2
                              size={17}
                              className="text-emerald-600 flex-shrink-0 mt-0.5"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950">
                        💡 Ghi chú sử dụng: {currentSlide.tip}
                      </div>
                    </div>

                    {currentSlide.image && (
                      <div className="lg:col-span-7 bg-slate-50 rounded-2xl border-2 border-indigo-100 p-2.5 space-y-2">
                        <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <img
                            src={currentSlide.image}
                            alt={currentSlide.imageCaption || currentSlide.title}
                            onClick={() => setZoomedImage({ src: currentSlide.image, caption: currentSlide.imageCaption })}
                            className="w-full h-auto object-contain cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.01]"
                          />
                          <button
                            type="button"
                            onClick={() => setZoomedImage({ src: currentSlide.image, caption: currentSlide.imageCaption })}
                            className="absolute bottom-2 right-2 px-2.5 py-1.5 bg-slate-900/75 hover:bg-slate-900 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow"
                          >
                            <ZoomIn size={13} /> Phóng to ảnh
                          </button>
                        </div>
                        {currentSlide.imageCaption && (
                          <p className="text-center text-xs font-bold text-slate-600 px-2">
                            {currentSlide.imageCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-bold">
                  <span>Toán Đồng Hành Lớp 4, 5</span>
                  <span>Chủ nhiệm & Tác giả: {OWNERSHIP_AUTHORS}</span>
                </div>
              </div>

              {/* Slide Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => {
                    sound.playClick();
                    stopVietnameseSpeech();
                    setIsSpeaking(false);
                    setSlideIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={slideIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 disabled:opacity-40 text-slate-700 font-black text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft size={16} /> Trang trước
                </button>

                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {SLIDE_DECK.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        sound.playClick();
                        stopVietnameseSpeech();
                        setIsSpeaking(false);
                        setSlideIndex(idx);
                      }}
                      title={`Trang ${s.id}: ${s.tag}`}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                        slideIndex === idx
                          ? 'bg-indigo-600 text-white shadow-sm scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-indigo-100'
                      }`}
                    >
                      {s.id}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    stopVietnameseSpeech();
                    setIsSpeaking(false);
                    setSlideIndex((prev) => Math.min(SLIDE_DECK.length - 1, prev + 1));
                  }}
                  disabled={slideIndex === SLIDE_DECK.length - 1}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5"
                >
                  Trang tiếp <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Word-like App Description Preview */
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-indigo-100">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-700">
                    {APP_DESCRIPTION_DOC.title}
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black text-indigo-950">
                    {APP_DESCRIPTION_DOC.appName}
                  </h4>
                  <p className="text-sm text-slate-600 font-semibold">
                    {APP_DESCRIPTION_DOC.subtitle}
                  </p>
                  <p className="text-xs font-black text-amber-800 pt-1">
                    Chủ nhiệm & Tác giả xây dựng: {APP_DESCRIPTION_DOC.authors} • Năm{' '}
                    {APP_DESCRIPTION_DOC.year}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    window.print();
                  }}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-indigo-200"
                >
                  <Printer size={15} /> In bản mô tả
                </button>
              </div>

              <div className="space-y-6">
                {APP_DESCRIPTION_DOC.sections.map((sec, idx) => (
                  <section key={idx} className="space-y-3">
                    <h5 className="text-base md:text-lg font-black text-indigo-800">
                      {sec.heading}
                    </h5>

                    {sec.paragraphs?.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm md:text-[15px] text-slate-700 font-semibold leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}

                    {sec.bullets && (
                      <ul className="space-y-2 pl-1">
                        {sec.bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-sm md:text-[15px] text-slate-700 font-semibold leading-relaxed"
                          >
                            <span className="text-indigo-600 font-black mt-0.5">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sec.table && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-blue-50 text-blue-950">
                              {sec.table.headers.map((h, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="px-4 py-3 font-black border-b border-slate-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-4 py-2.5 border-b border-slate-100 ${
                                      cIdx === 0
                                        ? 'font-black text-indigo-700 whitespace-nowrap'
                                        : 'font-semibold text-slate-700'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hộp thoại phóng to ảnh hướng dẫn */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20"
          >
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between gap-3">
              <span className="text-xs md:text-sm font-bold">{zoomedImage.caption}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-black flex items-center gap-1"
              >
                <X size={15} /> Đóng ảnh
              </button>
            </div>
            <img
              src={zoomedImage.src}
              alt={zoomedImage.caption}
              className="w-full max-h-[82vh] object-contain bg-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
