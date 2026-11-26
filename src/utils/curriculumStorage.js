import { CURRICULUM, DEFAULT_QUESTS } from '../data/curriculum';

const CURRICULUM_STORAGE_KEY = 'toan_dong_hanh_cau_hoi_v1';
const QUESTS_STORAGE_KEY = 'toan_dong_hanh_thu_thach_v1';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
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
        base[gradeKey] = {
          ...base[gradeKey],
          ...saved[gradeKey],
          topics: saved[gradeKey].topics.map((topic) => ({
            ...topic,
            questions: Array.isArray(topic.questions) ? topic.questions : [],
          })),
        };
      }
    }
    return base;
  } catch {
    return base;
  }
}

export function saveCurriculum(nextCurriculum) {
  try {
    localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(nextCurriculum));
  } catch (err) {
    console.warn('Không thể lưu bộ câu hỏi vào trình duyệt:', err);
  }
}

export function resetCurriculum(gradeKey = null) {
  const current = loadCurriculum();
  const defaults = deepClone(CURRICULUM);
  if (gradeKey && defaults[gradeKey]) {
    const updated = { ...current, [gradeKey]: defaults[gradeKey] };
    saveCurriculum(updated);
    return updated;
  }
  localStorage.removeItem(CURRICULUM_STORAGE_KEY);
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
  } catch {
    return base;
  }
}

export function saveQuests(nextQuests) {
  try {
    localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(nextQuests));
  } catch (err) {
    console.warn('Không thể lưu thử thách vào trình duyệt:', err);
  }
}

export function resetQuests() {
  localStorage.removeItem(QUESTS_STORAGE_KEY);
  return deepClone(DEFAULT_QUESTS);
}
