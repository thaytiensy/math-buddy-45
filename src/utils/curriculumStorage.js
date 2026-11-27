import { CURRICULUM, DEFAULT_QUESTS } from '../data/curriculum';

const CURRICULUM_STORAGE_KEY = 'toan_dong_hanh_cau_hoi_v1';
const QUESTS_STORAGE_KEY = 'toan_dong_hanh_thu_thach_v1';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isQuotaExceeded(err) {
  if (!err) return false;
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014
  );
}

export function getStorageUsageInfo() {
  try {
    let totalChars = 0;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        totalChars += key.length + val.length;
      }
    }
    const approxKB = Math.round((totalChars * 2) / 1024);
    return { approxKB, approxMB: Number((approxKB / 1024).toFixed(2)) };
  } catch {
    return { approxKB: 0, approxMB: 0 };
  }
}

export function loadCurriculum() {
  const base = deepClone(CURRICULUM);
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return base;

    for (const gradeKey of ['grade4', 'grade5']) {
      if (saved[gradeKey]?.topics && Array.isArray(saved[gradeKey].topics)) {
        const savedTopics = saved[gradeKey].topics.map((topic) => ({
          ...topic,
          questions: Array.isArray(topic.questions)
            ? topic.questions.map((q) => ({
                ...q,
                options: Array.isArray(q.options) ? q.options.map(String) : ['', ''],
                answerIndex: Number.isInteger(q.answerIndex) ? q.answerIndex : 0,
              }))
            : [],
        }));

        const savedIds = new Set(savedTopics.map((t) => t.id));
        const missingDefaultTopics = (base[gradeKey]?.topics || []).filter(
          (t) => !savedIds.has(t.id)
        );

        base[gradeKey] = {
          ...base[gradeKey],
          ...saved[gradeKey],
          topics: [...savedTopics, ...missingDefaultTopics],
        };
      }
    }
    return base;
  } catch (err) {
    console.warn('Không thể đọc bộ câu hỏi từ trình duyệt:', err);
    return base;
  }
}

export function saveCurriculum(nextCurriculum) {
  try {
    const serialized = JSON.stringify(nextCurriculum);
    localStorage.setItem(CURRICULUM_STORAGE_KEY, serialized);
    const verified = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!verified) {
      return {
        ok: false,
        errorType: 'VERIFY_FAILED',
        message: 'Trình duyệt không ghi nhận được dữ liệu vừa lưu. Vui lòng thử lại.',
      };
    }
    const approxKB = Math.max(1, Math.round((serialized.length * 2) / 1024));
    return { ok: true, approxKB };
  } catch (err) {
    console.warn('Không thể lưu bộ câu hỏi vào trình duyệt:', err);
    if (isQuotaExceeded(err)) {
      return {
        ok: false,
        errorType: 'QUOTA_EXCEEDED',
        message:
          'Bộ nhớ trình duyệt đã đầy (vượt giới hạn lưu trữ). Vui lòng xóa bớt ảnh tải lên cũ hoặc thay bằng link ảnh URL rồi lưu lại.',
      };
    }
    return {
      ok: false,
      errorType: 'STORAGE_ERROR',
      message:
        'Không thể lưu câu hỏi vào trình duyệt. Vui lòng kiểm tra chế độ riêng tư/ẩn danh và thử lại.',
    };
  }
}

export function resetCurriculum(gradeKey = null) {
  const current = loadCurriculum();
  const defaults = deepClone(CURRICULUM);
  try {
    if (gradeKey && defaults[gradeKey]) {
      const updated = { ...current, [gradeKey]: defaults[gradeKey] };
      saveCurriculum(updated);
      return updated;
    }
    localStorage.removeItem(CURRICULUM_STORAGE_KEY);
  } catch (err) {
    console.warn('Không thể khôi phục bộ câu hỏi:', err);
  }
  return defaults;
}

export function loadQuests() {
  const base = deepClone(DEFAULT_QUESTS);
  try {
    const raw = localStorage.getItem(QUESTS_STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) return base;
    return saved;
  } catch (err) {
    console.warn('Không thể đọc danh sách thử thách:', err);
    return base;
  }
}

export function saveQuests(nextQuests) {
  try {
    const serialized = JSON.stringify(nextQuests);
    localStorage.setItem(QUESTS_STORAGE_KEY, serialized);
    return { ok: true };
  } catch (err) {
    console.warn('Không thể lưu thử thách vào trình duyệt:', err);
    if (isQuotaExceeded(err)) {
      return {
        ok: false,
        errorType: 'QUOTA_EXCEEDED',
        message: 'Bộ nhớ trình duyệt đã đầy, không thể lưu thử thách mới.',
      };
    }
    return {
      ok: false,
      errorType: 'STORAGE_ERROR',
      message: 'Không thể lưu thử thách vào trình duyệt. Vui lòng thử lại.',
    };
  }
}

export function resetQuests() {
  try {
    localStorage.removeItem(QUESTS_STORAGE_KEY);
  } catch (err) {
    console.warn('Không thể khôi phục thử thách:', err);
  }
  return deepClone(DEFAULT_QUESTS);
}
