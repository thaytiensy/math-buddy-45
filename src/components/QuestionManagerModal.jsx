import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Save,
  RotateCcw,
  Volume2,
  Download,
  Upload,
  CheckCircle2,
  BookOpen,
  Compass,
  AlertCircle,
  ImagePlus,
  Link2,
  Image as ImageIcon,
} from 'lucide-react';
import VisualHelper from './VisualHelper';
import { sound, speakVietnamese, stopVietnameseSpeech } from '../utils/audio';

const VISUAL_TYPES = [
  { value: 'none', label: 'Không kèm hình minh họa' },
  { value: 'image', label: 'Ảnh minh họa (Tải từ máy hoặc Link URL)' },
  { value: 'place-value', label: 'Bảng cấu tạo số (Triệu - Nghìn - Đơn vị)' },
  { value: 'tip-card', label: 'Thẻ mẹo tính nhanh' },
  { value: 'fraction', label: 'Minh họa phân số' },
  { value: 'parallelogram', label: 'Hình bình hành' },
  { value: 'rhombus', label: 'Hình thoi' },
  { value: 'circle', label: 'Hình tròn' },
  { value: 'motion-car', label: 'Sơ đồ chuyển động đều' },
];

const LEGACY_VISUAL_LABELS = {
  'round-num': 'Minh họa làm tròn số',
  'unit-conv': 'Minh họa đổi đơn vị đo',
  'fraction-math': 'Minh họa phép tính phân số',
  'fraction-word': 'Minh họa bài toán phân số',
  'fraction-div': 'Minh họa chia phân số',
  'clock-angle': 'Minh họa góc đồng hồ',
  'ratio-bars': 'Sơ đồ đoạn thẳng Tổng - Tỉ',
  'sum-diff': 'Sơ đồ Tổng - Hiệu',
  'decimal-place': 'Bảng hàng số thập phân',
  'shift-dot': 'Minh họa dịch dấu phẩy',
  'vertical-math': 'Đặt tính rồi tính',
  'step-div': 'Chia số thập phân',
  'percent-circle': 'Biểu đồ tỉ số phần trăm',
  'discount-tag': 'Minh họa giảm giá phần trăm',
  'reverse-percent': 'Tìm số biết giá trị phần trăm',
  trapezoid: 'Hình thang',
  cuboid: 'Hình hộp chữ nhật',
  'meet-motion': 'Sơ đồ hai xe gặp nhau',
};

const DEFAULT_VISUAL_DATA = {
  fraction: { num: 3, den: 4 },
  parallelogram: { base: 18, height: 10 },
  rhombus: { d1: 16, d2: 12 },
  circle: { r: 5 },
  'motion-car': { s: 135, t: '2,5 giờ', v: 54 },
  'place-value': { millions: 72, thousands: '005', units: '400' },
  'tip-card': { rule: '25 × 4 = 100' },
  image: { imageUrl: '', caption: '' },
};

const QUEST_ICONS = ['🌲', '🌈', '📐', '💧', '🌾', '🏔️', '🚀', '💎', '🦊', '🏆'];

const createEmptyQuestion = () => ({
  id: `cau-${Date.now()}`,
  question: '',
  options: ['', '', '', ''],
  answerIndex: 0,
  hint: '',
  explanation: '',
  visualType: 'none',
  visualData: undefined,
});

const createEmptyQuest = (nextId) => ({
  id: nextId,
  name: '',
  starsNeeded: 0,
  icon: '🌟',
  reward: 'Huy hiệu Chăm Chỉ',
  challenge: '',
  options: ['', '', '', ''],
  answer: '',
});

const estimateDataUrlKB = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') return 0;
  if (!dataUrl.startsWith('data:')) return 0;
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return 0;
  const base64Len = dataUrl.length - commaIdx - 1;
  return Math.max(1, Math.round((base64Len * 3) / 4 / 1024));
};

const compressImageFile = (file, maxDimension = 800, quality = 0.72) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Vui lòng chọn đúng tệp hình ảnh (PNG, JPG, WebP).'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.max(1, Math.round((height * maxDimension) / width));
            width = maxDimension;
          } else {
            width = Math.max(1, Math.round((width * maxDimension) / height));
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Trình duyệt không hỗ trợ xử lý ảnh Canvas.'));
          return;
        }

        // Nền trắng để ảnh PNG trong suốt không bị nền đen khi chuyển JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKB = estimateDataUrlKB(dataUrl);

        // Nếu ảnh quá chi tiết khiến dung lượng > 95KB, hạ thêm chất lượng một mức nhẹ để an toàn localStorage
        if (sizeKB > 95) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.56);
          sizeKB = estimateDataUrlKB(dataUrl);
        }

        URL.revokeObjectURL(objectUrl);
        resolve({ dataUrl, width, height, sizeKB });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không đọc được tệp ảnh này. Vui lòng thử ảnh PNG, JPG hoặc WebP khác.'));
    };

    img.src = objectUrl;
  });

export default function QuestionManagerModal({
  isOpen,
  onClose,
  curriculum,
  onUpdateCurriculum,
  onResetCurriculum,
  quests,
  onUpdateQuests,
  onResetQuests,
  initialScope = 'practice',
  initialGrade = 'grade4',
  initialTopicIndex = 0,
  initialQuestionIndex = null,
}) {
  const [scope, setScope] = useState(initialScope); // 'practice' | 'adventure'
  const [gradeKey, setGradeKey] = useState(initialGrade);
  const [topicIndex, setTopicIndex] = useState(initialTopicIndex);

  const [editingQuestionIdx, setEditingQuestionIdx] = useState(null); // null | -1 (new) | number
  const [qForm, setQForm] = useState(createEmptyQuestion());
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [previewImgError, setPreviewImgError] = useState(false);

  const [editingQuestIdx, setEditingQuestIdx] = useState(null); // null | -1 (new) | number
  const [questForm, setQuestForm] = useState(createEmptyQuest(1));

  const [statusNotice, setStatusNotice] = useState(null); // { type: 'success'|'error', text }
  const [confirmReset, setConfirmReset] = useState(false);

  const fileInputRef = useRef(null);
  const imageUploadInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setScope(initialScope);
      setGradeKey(initialGrade);
      setTopicIndex(initialTopicIndex);
      setEditingQuestionIdx(null);
      setEditingQuestIdx(null);
      setStatusNotice(null);
      setConfirmReset(false);
      setPreviewImgError(false);

      // Nếu mở trực tiếp từ câu hỏi đang làm ở Luyện tập, tự mở sẵn form sửa câu đó nếu hợp lệ
      if (
        initialScope === 'practice' &&
        Number.isInteger(initialQuestionIndex) &&
        initialQuestionIndex >= 0
      ) {
        const targetTopic = curriculum?.[initialGrade]?.topics?.[initialTopicIndex];
        const targetQuestion = targetTopic?.questions?.[initialQuestionIndex];
        if (targetQuestion) {
          const opts = Array.isArray(targetQuestion.options)
            ? [...targetQuestion.options]
            : ['', '', '', ''];
          while (opts.length < 4) opts.push('');
          setQForm({
            id: targetQuestion.id || `cau-${Date.now()}`,
            question: targetQuestion.question || '',
            options: opts.slice(0, 4).map((o) => String(o)),
            answerIndex: Number.isInteger(targetQuestion.answerIndex)
              ? targetQuestion.answerIndex
              : 0,
            hint: targetQuestion.hint || '',
            explanation: targetQuestion.explanation || '',
            visualType: targetQuestion.visualType || 'none',
            visualData: targetQuestion.visualData
              ? { ...targetQuestion.visualData }
              : undefined,
          });
          setEditingQuestionIdx(initialQuestionIndex);
        }
      }
    } else {
      stopVietnameseSpeech();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    }
  }, [isOpen, initialScope, initialGrade, initialTopicIndex, initialQuestionIndex]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const gradeData = curriculum[gradeKey] || curriculum.grade4;
  const topics = gradeData.topics || [];
  const safeTopicIndex = Math.min(topicIndex, Math.max(0, topics.length - 1));
  const currentTopic = topics[safeTopicIndex] || { name: '', questions: [] };
  const currentQuestions = currentTopic.questions || [];

  const showToast = (type, text) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setStatusNotice({ type, text });
    if (type === 'success') {
      toastTimerRef.current = setTimeout(() => {
        setStatusNotice(null);
      }, 5000);
    }
  };

  const handleClose = () => {
    stopVietnameseSpeech();
    onClose();
  };

  // --- Practice Question Handlers ---
  const openEditQuestion = (idx) => {
    sound.playClick();
    setConfirmReset(false);
    setStatusNotice(null);
    setPreviewImgError(false);
    if (idx === -1) {
      setQForm(createEmptyQuestion());
      setEditingQuestionIdx(-1);
    } else {
      const target = currentQuestions[idx];
      const opts = Array.isArray(target.options) ? [...target.options] : ['', '', '', ''];
      while (opts.length < 4) opts.push('');
      setQForm({
        id: target.id || `cau-${Date.now()}`,
        question: target.question || '',
        options: opts.slice(0, 4).map((o) => String(o)),
        answerIndex: Number.isInteger(target.answerIndex) ? target.answerIndex : 0,
        hint: target.hint || '',
        explanation: target.explanation || '',
        visualType: target.visualType || 'none',
        visualData: target.visualData ? { ...target.visualData } : undefined,
      });
      setEditingQuestionIdx(idx);
    }
  };

  const handleVisualTypeChange = (nextType) => {
    setPreviewImgError(false);
    if (nextType === 'none') {
      setQForm((prev) => ({
        ...prev,
        visualType: 'none',
        visualData: undefined,
      }));
      return;
    }

    const defaultData = DEFAULT_VISUAL_DATA[nextType];
    setQForm((prev) => ({
      ...prev,
      visualType: nextType,
      visualData:
        nextType === prev.visualType && prev.visualData
          ? prev.visualData
          : defaultData
          ? { ...defaultData }
          : prev.visualData,
    }));
  };

  const updateVisualDataField = (field, value) => {
    setQForm((prev) => ({
      ...prev,
      visualData: {
        ...(DEFAULT_VISUAL_DATA[prev.visualType] || {}),
        ...(prev.visualData || {}),
        [field]: value,
      },
    }));
  };

  const handleUploadImageFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsCompressingImage(true);
    setPreviewImgError(false);
    try {
      const { dataUrl, width, height, sizeKB } = await compressImageFile(file, 800, 0.72);
      setQForm((prev) => ({
        ...prev,
        visualType: 'image',
        visualData: {
          ...(prev.visualData || {}),
          imageUrl: dataUrl,
          caption: prev.visualData?.caption || '',
        },
      }));
      sound.playClick();
      showToast(
        'success',
        `Đã tải và nén ảnh tự động (${width}×${height}px, còn ${sizeKB} KB). Bấm "Lưu câu hỏi" để lưu lại!`
      );
    } catch (err) {
      showToast('error', err?.message || 'Không thể xử lý ảnh. Vui lòng chọn tệp PNG, JPG hoặc WebP.');
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleImageUrlChange = (urlValue) => {
    setPreviewImgError(false);
    setQForm((prev) => ({
      ...prev,
      visualType: urlValue.trim() ? 'image' : prev.visualType === 'image' ? 'image' : prev.visualType,
      visualData: {
        ...(prev.visualData || {}),
        imageUrl: urlValue,
      },
    }));
  };

  const handleClearImage = () => {
    sound.playClick();
    setPreviewImgError(false);
    setQForm((prev) => ({
      ...prev,
      visualType: 'none',
      visualData: undefined,
    }));
    showToast('success', 'Đã xóa ảnh minh họa khỏi câu hỏi này.');
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    const cleanedQuestion = qForm.question.trim();

    if (!cleanedQuestion) {
      showToast('error', 'Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    // Cho phép 2, 3 hoặc 4 phương án (hỗ trợ câu hỏi Đúng/Sai 2 lựa chọn)
    const nonEmptyEntries = qForm.options
      .map((opt, origIdx) => ({ text: String(opt).trim(), origIdx }))
      .filter((item) => item.text !== '');

    if (nonEmptyEntries.length < 2) {
      showToast(
        'error',
        'Vui lòng nhập ít nhất 2 phương án trả lời (ví dụ: Đúng / Sai hoặc đầy đủ A, B, C, D).'
      );
      return;
    }

    const mappedAnswerIndex = nonEmptyEntries.findIndex(
      (item) => item.origIdx === qForm.answerIndex
    );
    if (mappedAnswerIndex === -1) {
      showToast(
        'error',
        'Đáp án đúng đang chọn bị bỏ trống. Vui lòng điền nội dung cho phương án đó hoặc chọn đáp án đúng khác.'
      );
      return;
    }

    if (qForm.visualType === 'image') {
      const imgUrl = (qForm.visualData?.imageUrl || '').trim();
      if (!imgUrl) {
        showToast(
          'error',
          'Bạn đang chọn "Ảnh minh họa" nhưng chưa tải ảnh hoặc nhập link URL. Vui lòng thêm ảnh hoặc chọn "Không kèm hình minh họa".'
        );
        return;
      }
    }

    const cleanedOptions = nonEmptyEntries.map((item) => item.text);
    const cleanedVisualType = qForm.visualType === 'none' ? undefined : qForm.visualType;

    let cleanedVisualData;
    if (cleanedVisualType === 'image') {
      cleanedVisualData = {
        imageUrl: qForm.visualData.imageUrl.trim(),
        ...(qForm.visualData?.caption?.trim() ? { caption: qForm.visualData.caption.trim() } : {}),
      };
    } else if (cleanedVisualType) {
      cleanedVisualData = qForm.visualData;
    }

    const updatedItem = {
      id: qForm.id || `cau-${Date.now()}`,
      question: cleanedQuestion,
      options: cleanedOptions,
      answerIndex: mappedAnswerIndex,
      hint: qForm.hint.trim() || 'Hãy đọc kỹ dữ kiện đề bài và đặt tính cẩn thận nhé.',
      explanation:
        qForm.explanation.trim() ||
        `Đáp án đúng là ${String.fromCharCode(65 + mappedAnswerIndex)}: ${cleanedOptions[mappedAnswerIndex]}.`,
      ...(cleanedVisualType ? { visualType: cleanedVisualType } : {}),
      ...(cleanedVisualData ? { visualData: cleanedVisualData } : {}),
    };

    const nextCurriculum = JSON.parse(JSON.stringify(curriculum));
    const targetQuestions = nextCurriculum[gradeKey].topics[safeTopicIndex].questions;

    if (editingQuestionIdx === -1) {
      targetQuestions.push(updatedItem);
    } else {
      targetQuestions[editingQuestionIdx] = updatedItem;
    }

    const saveResult = onUpdateCurriculum(nextCurriculum);
    if (saveResult && saveResult.ok === false) {
      sound.playWrong();
      showToast('error', saveResult.message || 'Không thể lưu dữ liệu vào trình duyệt.');
      return;
    }

    sound.playCorrect();
    showToast(
      'success',
      editingQuestionIdx === -1
        ? 'Đã thêm câu hỏi mới, lưu an toàn và cập nhật ngay lên màn hình Luyện tập!'
        : 'Đã cập nhật câu hỏi, hình minh họa và đáp án thành công!'
    );
    setEditingQuestionIdx(null);
  };

  const handleDeleteQuestion = (idx) => {
    if (currentQuestions.length <= 1) {
      showToast('error', 'Mỗi chủ đề cần giữ lại ít nhất 1 câu hỏi để học sinh luyện tập.');
      return;
    }
    sound.playClick();
    const nextCurriculum = JSON.parse(JSON.stringify(curriculum));
    nextCurriculum[gradeKey].topics[safeTopicIndex].questions.splice(idx, 1);
    const saveResult = onUpdateCurriculum(nextCurriculum);
    if (saveResult && saveResult.ok === false) {
      showToast('error', saveResult.message || 'Không thể lưu thay đổi.');
      return;
    }
    if (editingQuestionIdx === idx) setEditingQuestionIdx(null);
    showToast('success', 'Đã xóa câu hỏi khỏi chủ đề.');
  };

  // --- Adventure Quest Handlers ---
  const openEditQuest = (idx) => {
    sound.playClick();
    setConfirmReset(false);
    setStatusNotice(null);
    if (idx === -1) {
      const maxId = quests.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
      setQuestForm(createEmptyQuest(maxId + 1));
      setEditingQuestIdx(-1);
    } else {
      const target = quests[idx];
      const opts = Array.isArray(target.options) ? target.options.map(String) : ['', '', '', ''];
      while (opts.length < 4) opts.push('');
      setQuestForm({
        ...target,
        options: opts.slice(0, 4),
        answer: String(target.answer ?? opts[0] ?? ''),
      });
      setEditingQuestIdx(idx);
    }
  };

  const handleSaveQuest = (e) => {
    e.preventDefault();
    const cleanedName = questForm.name.trim();
    const cleanedChallenge = questForm.challenge.trim();
    const cleanedOpts = questForm.options.map((o) => String(o).trim()).filter(Boolean);

    if (!cleanedName || !cleanedChallenge) {
      showToast('error', 'Vui lòng nhập tên ải và nội dung thử thách.');
      return;
    }
    if (cleanedOpts.length < 2) {
      showToast('error', 'Vui lòng nhập ít nhất 2 lựa chọn cho thử thách.');
      return;
    }

    const chosenIdx = cleanedOpts.findIndex((o) => o === String(questForm.answer).trim());
    const finalAnswer = chosenIdx >= 0 ? cleanedOpts[chosenIdx] : cleanedOpts[0];

    const updatedQuest = {
      ...questForm,
      name: cleanedName,
      challenge: cleanedChallenge,
      reward: questForm.reward.trim() || 'Huy hiệu Thám Hiểm',
      starsNeeded: Math.max(0, Number(questForm.starsNeeded) || 0),
      options: cleanedOpts,
      answer: finalAnswer,
    };

    const nextQuests = [...quests];
    if (editingQuestIdx === -1) {
      nextQuests.push(updatedQuest);
    } else {
      nextQuests[editingQuestIdx] = updatedQuest;
    }

    const saveResult = onUpdateQuests(nextQuests);
    if (saveResult && saveResult.ok === false) {
      sound.playWrong();
      showToast('error', saveResult.message || 'Không thể lưu thử thách vào trình duyệt.');
      return;
    }

    sound.playCorrect();
    showToast(
      'success',
      editingQuestIdx === -1
        ? 'Đã thêm ải thử thách mới thành công!'
        : 'Đã cập nhật thử thách thành công!'
    );
    setEditingQuestIdx(null);
  };

  const handleDeleteQuest = (idx) => {
    if (quests.length <= 1) {
      showToast('error', 'Cần giữ lại ít nhất 1 ải trên bản đồ thám hiểm.');
      return;
    }
    sound.playClick();
    const nextQuests = quests.filter((_, i) => i !== idx);
    const saveResult = onUpdateQuests(nextQuests);
    if (saveResult && saveResult.ok === false) {
      showToast('error', saveResult.message || 'Không thể lưu thay đổi.');
      return;
    }
    if (editingQuestIdx === idx) setEditingQuestIdx(null);
    showToast('success', 'Đã xóa ải thử thách.');
  };

  // --- Export / Import / Reset ---
  const handleExportJson = () => {
    sound.playClick();
    const payload = {
      appName: 'Toán Đồng Hành Lớp 4, 5',
      exportedAt: new Date().toISOString(),
      curriculum,
      quests,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bo_Cau_Hoi_Toan_Dong_Hanh_4_5.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Đã xuất tệp sao lưu câu hỏi (.json) thành công!');
  };

  const handleImportJson = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      let importedSomething = false;
      if (parsed.curriculum?.grade4?.topics && parsed.curriculum?.grade5?.topics) {
        const res = onUpdateCurriculum(parsed.curriculum);
        if (res && res.ok === false) {
          showToast('error', res.message || 'Tệp dữ liệu vượt quá giới hạn lưu trữ của trình duyệt.');
          return;
        }
        importedSomething = true;
      }
      if (Array.isArray(parsed.quests) && parsed.quests.length > 0) {
        const res = onUpdateQuests(parsed.quests);
        if (res && res.ok === false) {
          showToast('error', res.message || 'Không thể lưu danh sách thử thách từ tệp.');
          return;
        }
        importedSomething = true;
      }
      if (!importedSomething) {
        showToast('error', 'Tệp không đúng định dạng bộ câu hỏi của Toán Đồng Hành.');
        return;
      }
      sound.playVictory();
      setEditingQuestionIdx(null);
      setEditingQuestIdx(null);
      showToast('success', 'Đã nhập bộ câu hỏi từ tệp thành công!');
    } catch {
      showToast('error', 'Không đọc được tệp dữ liệu. Vui lòng kiểm tra lại tệp sao lưu.');
    }
  };

  const handleExecuteReset = () => {
    sound.playClick();
    if (scope === 'practice') {
      onResetCurriculum();
      setEditingQuestionIdx(null);
      showToast('success', 'Đã khôi phục toàn bộ câu hỏi Luyện tập về mặc định ban đầu.');
    } else {
      onResetQuests();
      setEditingQuestIdx(null);
      showToast('success', 'Đã khôi phục các ải Thám hiểm về mặc định ban đầu.');
    }
    setConfirmReset(false);
  };

  const currentImageUrl = qForm.visualData?.imageUrl || '';
  const compressedSizeKB = estimateDataUrlKB(currentImageUrl);
  const isLegacyVisualType =
    qForm.visualType &&
    qForm.visualType !== 'none' &&
    !VISUAL_TYPES.some((vt) => vt.value === qForm.visualType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border-4 border-emerald-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 md:px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl">
              ✏️
            </div>
            <div>
              <h3 className="font-black text-lg md:text-xl leading-tight">
                Quản Lý & Tự Sửa Câu Hỏi — Hình Minh Họa
              </h3>
              <p className="text-xs text-emerald-50 font-semibold">
                Chỉnh sửa đề bài, tải ảnh hoặc dán link ảnh, sửa đáp án và lời giải; tự động lưu trên trình duyệt
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Đóng trình sửa câu hỏi"
            className="p-2 bg-white/15 hover:bg-white/25 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scope & Backup Controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setScope('practice');
                setEditingQuestIdx(null);
                setConfirmReset(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                scope === 'practice'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen size={15} /> Câu Hỏi Luyện Tập
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setScope('adventure');
                setEditingQuestionIdx(null);
                setConfirmReset(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                scope === 'adventure'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Compass size={15} /> Thử Thách Thám Hiểm
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Download size={14} /> Xuất dữ liệu
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Upload size={14} /> Nhập dữ liệu
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportJson}
              className="hidden"
            />
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Khôi phục mặc định
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-300">
                <span className="text-[11px] font-black text-rose-900">Xác nhận khôi phục?</span>
                <button
                  onClick={handleExecuteReset}
                  className="px-2 py-0.5 bg-rose-600 text-white rounded-lg text-[11px] font-black"
                >
                  Đồng ý
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 bg-white text-slate-700 rounded-lg text-[11px] font-bold"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Toast nổi bật */}
        {statusNotice && (
          <div
            role="alert"
            className={`mx-4 md:mx-6 mt-3 px-4 py-3 rounded-2xl border-2 text-xs md:text-sm font-black flex items-center justify-between gap-3 shadow-sm animate-fade-in ${
              statusNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusNotice.type === 'success' ? (
                <CheckCircle2 size={19} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle size={19} className="text-rose-600 flex-shrink-0" />
              )}
              <span>{statusNotice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              aria-label="Đóng thông báo"
              className="p-1 rounded-lg hover:bg-black/5 flex-shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {scope === 'practice' ? (
            <>
              {/* Grade & Topic Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setGradeKey('grade4');
                      setTopicIndex(0);
                      setEditingQuestionIdx(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black ${
                      gradeKey === 'grade4'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    📘 Lớp 4
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setGradeKey('grade5');
                      setTopicIndex(0);
                      setEditingQuestionIdx(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black ${
                      gradeKey === 'grade5'
                        ? 'bg-amber-500 text-amber-950 shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    📙 Lớp 5
                  </button>

                  <select
                    aria-label="Chọn chủ đề chỉnh sửa"
                    value={safeTopicIndex}
                    onChange={(e) => {
                      setTopicIndex(Number(e.target.value));
                      setEditingQuestionIdx(null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-white text-xs md:text-sm font-bold text-slate-800"
                  >
                    {topics.map((t, idx) => (
                      <option key={t.id} value={idx}>
                        {t.name} ({t.questions?.length || 0} câu)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => openEditQuestion(-1)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={16} /> Thêm câu hỏi mới
                </button>
              </div>

              {/* Form Editor when editing or creating */}
              {editingQuestionIdx !== null && (
                <form
                  onSubmit={handleSaveQuestion}
                  className="p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-300 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-black text-base text-amber-950">
                      {editingQuestionIdx === -1
                        ? `Thêm câu hỏi mới vào chủ đề "${currentTopic.name}"`
                        : `Chỉnh sửa Câu hỏi ${editingQuestionIdx + 1}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        speakVietnamese(
                          `${qForm.question}. Phương án A: ${qForm.options[0]}. Phương án B: ${qForm.options[1]}.`
                        )
                      }
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Volume2 size={14} /> Nghe thử tiếng Việt
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Nội dung câu hỏi *
                    </label>
                    <textarea
                      rows={2}
                      value={qForm.question}
                      onChange={(e) => setQForm({ ...qForm, question: e.target.value })}
                      placeholder="Nhập đề bài toán học bằng tiếng Việt..."
                      className="w-full p-3 rounded-2xl border border-slate-300 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Khối Hình minh họa & Ảnh đề bài */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <ImageIcon size={16} className="text-indigo-600" />
                        Hình minh họa & Ảnh bài toán
                      </label>

                      <select
                        aria-label="Loại hình minh họa"
                        value={qForm.visualType || 'none'}
                        onChange={(e) => handleVisualTypeChange(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-xs font-bold text-slate-800"
                      >
                        {VISUAL_TYPES.map((vt) => (
                          <option key={vt.value} value={vt.value}>
                            {vt.label}
                          </option>
                        ))}
                        {isLegacyVisualType && (
                          <option value={qForm.visualType}>
                            {LEGACY_VISUAL_LABELS[qForm.visualType] || qForm.visualType}
                          </option>
                        )}
                      </select>
                    </div>

                    {/* Nút tải ảnh từ máy & Ô nhập URL luôn sẵn sàng */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                      <div className="md:col-span-4 flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isCompressingImage}
                          onClick={() => imageUploadInputRef.current?.click()}
                          className="w-full px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <ImagePlus size={16} />
                          <span>{isCompressingImage ? 'Đang nén ảnh...' : 'Tải ảnh từ máy'}</span>
                        </button>
                        <input
                          ref={imageUploadInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/*"
                          onChange={handleUploadImageFile}
                          className="hidden"
                        />
                      </div>

                      <div className="md:col-span-8 flex items-center gap-2">
                        <div className="relative flex-1">
                          <Link2
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="text"
                            value={currentImageUrl.startsWith('data:') ? '' : currentImageUrl}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            placeholder={
                              currentImageUrl.startsWith('data:')
                                ? 'Đã tải ảnh từ máy (hoặc dán link URL mới tại đây để thay thế)'
                                : 'Hoặc nhập link ảnh URL (https://...)'
                            }
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        {(currentImageUrl || qForm.visualType === 'image') && (
                          <button
                            type="button"
                            onClick={handleClearImage}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black flex items-center gap-1 flex-shrink-0"
                            title="Xóa ảnh minh họa"
                          >
                            <Trash2 size={14} /> Xóa ảnh
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Khung xem trước ảnh hoặc tùy chỉnh thông số hình */}
                    {qForm.visualType === 'image' && (
                      <div className="space-y-2.5 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Chú thích dưới ảnh (không bắt buộc)
                          </label>
                          <input
                            type="text"
                            value={qForm.visualData?.caption || ''}
                            onChange={(e) => updateVisualDataField('caption', e.target.value)}
                            placeholder="Ví dụ: Hình vẽ thửa ruộng hình chữ nhật..."
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                          />
                        </div>

                        {currentImageUrl ? (
                          <div className="p-3 rounded-2xl bg-slate-50 border border-dashed border-indigo-300 flex flex-col items-center gap-2">
                            <div className="w-full flex items-center justify-between text-[11px] font-bold text-indigo-800">
                              <span>Khung xem trước ảnh minh họa:</span>
                              <span className="bg-indigo-100 px-2 py-0.5 rounded-full">
                                {compressedSizeKB > 0
                                  ? `Đã nén tự động: ~${compressedSizeKB} KB`
                                  : 'Ảnh từ Link URL'}
                              </span>
                            </div>
                            {!previewImgError ? (
                              <img
                                src={currentImageUrl}
                                alt="Xem trước ảnh minh họa"
                                onError={() => setPreviewImgError(true)}
                                className="max-h-56 w-auto max-w-full rounded-xl shadow border border-slate-200 object-contain bg-white"
                              />
                            ) : (
                              <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                                Không hiển thị được ảnh từ đường dẫn này. Vui lòng kiểm tra lại link URL hoặc dùng nút "Tải ảnh từ máy".
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                            Hãy bấm <strong>"Tải ảnh từ máy"</strong> (tự động nén gọn nhẹ) hoặc dán <strong>link ảnh URL</strong> vào ô phía trên.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Chỉnh thông số trực tiếp cho các hình học / bảng số / mẹo */}
                    {qForm.visualType === 'fraction' && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Tử số
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={qForm.visualData?.num ?? 3}
                            onChange={(e) => updateVisualDataField('num', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Mẫu số
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.den ?? 4}
                            onChange={(e) => updateVisualDataField('den', Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {qForm.visualType === 'parallelogram' && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Độ dài đáy a (cm)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.base ?? 18}
                            onChange={(e) => updateVisualDataField('base', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Chiều cao h (cm)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.height ?? 10}
                            onChange={(e) => updateVisualDataField('height', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {qForm.visualType === 'rhombus' && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Đường chéo m (cm)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.d1 ?? 16}
                            onChange={(e) => updateVisualDataField('d1', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Đường chéo n (cm)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.d2 ?? 12}
                            onChange={(e) => updateVisualDataField('d2', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {qForm.visualType === 'circle' && (
                      <div className="pt-1 max-w-xs">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Bán kính r (cm)
                        </label>
                        <input
                          type="number"
                          min={1}
                          step="0.1"
                          value={qForm.visualData?.r ?? 5}
                          onChange={(e) => updateVisualDataField('r', Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                        />
                      </div>
                    )}

                    {qForm.visualType === 'motion-car' && (
                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Quãng đường (km)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.s ?? 135}
                            onChange={(e) => updateVisualDataField('s', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Thời gian
                          </label>
                          <input
                            type="text"
                            value={qForm.visualData?.t ?? '2,5 giờ'}
                            onChange={(e) => updateVisualDataField('t', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Vận tốc (km/giờ)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qForm.visualData?.v ?? 54}
                            onChange={(e) => updateVisualDataField('v', Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {qForm.visualType === 'place-value' && (
                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Lớp triệu
                          </label>
                          <input
                            type="text"
                            value={qForm.visualData?.millions ?? '72'}
                            onChange={(e) => updateVisualDataField('millions', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Lớp nghìn
                          </label>
                          <input
                            type="text"
                            value={qForm.visualData?.thousands ?? '005'}
                            onChange={(e) => updateVisualDataField('thousands', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Lớp đơn vị
                          </label>
                          <input
                            type="text"
                            value={qForm.visualData?.units ?? '400'}
                            onChange={(e) => updateVisualDataField('units', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {qForm.visualType === 'tip-card' && (
                      <div className="pt-1">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Công thức / Mẹo tính nhanh
                        </label>
                        <input
                          type="text"
                          value={qForm.visualData?.rule ?? '25 × 4 = 100'}
                          onChange={(e) => updateVisualDataField('rule', e.target.value)}
                          placeholder="Ví dụ: 25 × 4 = 100 hoặc 125 × 8 = 1000"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                        />
                      </div>
                    )}

                    {/* Xem trước các hình minh họa built-in */}
                    {qForm.visualType &&
                      qForm.visualType !== 'none' &&
                      qForm.visualType !== 'image' && (
                        <div className="pt-1">
                          <VisualHelper type={qForm.visualType} data={qForm.visualData} />
                        </div>
                      )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2">
                      Các phương án trả lời (Nhập ít nhất 2 phương án cho câu Đúng/Sai, hoặc 3–4 phương án; bấm chọn Đáp án đúng) *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {qForm.options.map((opt, idx) => {
                        const isCorrect = qForm.answerIndex === idx;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 transition-colors ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-500'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setQForm({ ...qForm, answerIndex: idx })}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 flex-shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + idx)}</span>
                              {isCorrect && <span>✓ Đúng</span>}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const nextOpts = [...qForm.options];
                                nextOpts[idx] = e.target.value;
                                setQForm({ ...qForm, options: nextOpts });
                              }}
                              placeholder={
                                idx < 2
                                  ? `Đáp án ${String.fromCharCode(65 + idx)} (bắt buộc)`
                                  : `Đáp án ${String.fromCharCode(65 + idx)} (có thể bỏ trống nếu chỉ dùng ${idx} lựa chọn)`
                              }
                              className="flex-1 text-sm font-bold text-slate-800 bg-transparent focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Gợi ý tư duy
                      </label>
                      <textarea
                        rows={2}
                        value={qForm.hint}
                        onChange={(e) => setQForm({ ...qForm, hint: e.target.value })}
                        placeholder="Nhập gợi ý giúp học sinh suy luận..."
                        className="w-full p-2.5 rounded-2xl border border-slate-300 bg-white text-xs md:text-sm font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Lời giải chi tiết
                      </label>
                      <textarea
                        rows={2}
                        value={qForm.explanation}
                        onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })}
                        placeholder="Nhập lời giải mẫu từng bước..."
                        className="w-full p-2.5 rounded-2xl border border-slate-300 bg-white text-xs md:text-sm font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingQuestionIdx(null)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isCompressingImage}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-sm"
                    >
                      <Save size={15} /> Lưu câu hỏi
                    </button>
                  </div>
                </form>
              )}

              {/* Questions List */}
              <div className="space-y-3">
                {currentQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className={`p-4 rounded-2xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      editingQuestionIdx === idx
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                          Câu {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          Đáp án đúng: {String.fromCharCode(65 + (q.answerIndex ?? 0))} (
                          {q.options?.[q.answerIndex ?? 0]})
                        </span>
                        {q.visualType === 'image' && q.visualData?.imageUrl && (
                          <span className="text-[11px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                            🖼️ Có ảnh minh họa
                          </span>
                        )}
                        {q.visualType && q.visualType !== 'none' && q.visualType !== 'image' && (
                          <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            📐 Có hình/sơ đồ
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-black text-slate-800">{q.question}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => speakVietnamese(q.question)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200"
                        title="Nghe đọc câu hỏi này"
                      >
                        <Volume2 size={15} />
                      </button>
                      <button
                        onClick={() => openEditQuestion(idx)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 text-xs font-black flex items-center gap-1"
                      >
                        <Pencil size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Adventure Quests Management */
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-50/70 p-3.5 rounded-2xl border border-teal-100">
                <div>
                  <h4 className="font-black text-sm text-teal-950">
                    Danh sách ải thử thách trên Bản Đồ Thám Hiểm ({quests.length} ải)
                  </h4>
                  <p className="text-xs text-teal-800 font-semibold">
                    Tùy chỉnh tên vùng đất, số Sao mở khóa, huy hiệu phần thưởng và câu hỏi thử thách
                  </p>
                </div>
                <button
                  onClick={() => openEditQuest(-1)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={16} /> Thêm ải mới
                </button>
              </div>

              {editingQuestIdx !== null && (
                <form
                  onSubmit={handleSaveQuest}
                  className="p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-300 space-y-4"
                >
                  <h4 className="font-black text-base text-amber-950">
                    {editingQuestIdx === -1
                      ? 'Thêm ải thử thách mới'
                      : `Chỉnh sửa ải: ${questForm.name}`}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Tên ải *
                      </label>
                      <input
                        type="text"
                        value={questForm.name}
                        onChange={(e) => setQuestForm({ ...questForm, name: e.target.value })}
                        placeholder="Ví dụ: Rừng Số Tự Nhiên"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Phần thưởng huy hiệu
                      </label>
                      <input
                        type="text"
                        value={questForm.reward}
                        onChange={(e) => setQuestForm({ ...questForm, reward: e.target.value })}
                        placeholder="Ví dụ: Huy hiệu Mầm Xanh"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Số Sao để mở khóa
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={questForm.starsNeeded}
                        onChange={(e) =>
                          setQuestForm({ ...questForm, starsNeeded: Number(e.target.value) })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-700">Biểu tượng:</span>
                    {QUEST_ICONS.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setQuestForm({ ...questForm, icon: ic })}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border ${
                          questForm.icon === ic
                            ? 'bg-amber-200 border-amber-500 scale-110'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Câu hỏi thử thách *
                    </label>
                    <textarea
                      rows={2}
                      value={questForm.challenge}
                      onChange={(e) => setQuestForm({ ...questForm, challenge: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-slate-300 bg-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2">
                      Phương án (từ 2 đến 4 lựa chọn) và chọn đáp án đúng *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questForm.options.map((opt, idx) => {
                        const isAns =
                          String(questForm.answer).trim() !== '' &&
                          String(questForm.answer).trim() === String(opt).trim();
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 ${
                              isAns
                                ? 'bg-emerald-50 border-emerald-500'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setQuestForm({ ...questForm, answer: opt })}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex-shrink-0 ${
                                isAns
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {isAns ? '✓ Đúng' : `Chọn ${String.fromCharCode(65 + idx)}`}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const val = e.target.value;
                                const nextOpts = [...questForm.options];
                                const wasAns = isAns;
                                nextOpts[idx] = val;
                                setQuestForm({
                                  ...questForm,
                                  options: nextOpts,
                                  answer: wasAns ? val : questForm.answer,
                                });
                              }}
                              className="flex-1 text-sm font-bold bg-transparent focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingQuestIdx(null)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs flex items-center gap-1.5"
                    >
                      <Save size={15} /> Lưu thử thách
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {quests.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-3xl">{q.icon}</span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-sm text-slate-800">{q.name}</span>
                          <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            Mở từ {q.starsNeeded} ⭐
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            Đáp án: {q.answer}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-slate-600">
                          {q.challenge}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => speakVietnamese(q.challenge)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200"
                        title="Nghe thử thử thách"
                      >
                        <Volume2 size={15} />
                      </button>
                      <button
                        onClick={() => openEditQuest(idx)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 text-xs font-black flex items-center gap-1"
                      >
                        <Pencil size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteQuest(idx)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200"
                        title="Xóa ải"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
