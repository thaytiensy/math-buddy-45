// Bộ tổng hợp âm thanh trò chơi & Trình đọc đề bài chuẩn thuần tiếng Việt

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Lỗi âm thanh bấm nút', e);
    }
  }

  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.25);
      });
    } catch (e) {
      console.warn('Lỗi âm thanh trả lời đúng', e);
    }
  }

  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Lỗi âm thanh trả lời sai', e);
    }
  }

  playVictory() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0, d: 0.15 },
        { f: 659.25, t: 0.15, d: 0.15 },
        { f: 783.99, t: 0.3, d: 0.15 },
        { f: 1046.5, t: 0.45, d: 0.45 },
      ];
      notes.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.2, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch (e) {
      console.warn('Lỗi âm thanh chiến thắng', e);
    }
  }
}

export const sound = new SoundEngine();

/**
 * Chuẩn hóa đề bài toán học và ký hiệu sang câu văn thuần tiếng Việt dễ nghe,
 * tránh hoàn toàn việc đọc nhầm sang tiếng Anh.
 */
export function normalizeVietnameseMathSpeech(rawText) {
  if (!rawText) return '';
  let text = String(rawText);

  // Loại bỏ biểu tượng cảm xúc / ký tự trang trí để không bị đọc bằng tiếng Anh
  text = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ');

  // Thay thế các ký hiệu đơn vị đo & toán học thường gặp
  text = text
    .replace(/km\/giờ|km\/h/gi, ' ki-lô-mét trên giờ ')
    .replace(/km²|km2/gi, ' ki-lô-mét vuông ')
    .replace(/cm²|cm2/gi, ' xăng-ti-mét vuông ')
    .replace(/dm²|dm2/gi, ' đề-xi-mét vuông ')
    .replace(/mm²|mm2/gi, ' mi-li-mét vuông ')
    .replace(/m²|m2/gi, ' mét vuông ')
    .replace(/cm³|cm3/gi, ' xăng-ti-mét khối ')
    .replace(/dm³|dm3/gi, ' đề-xi-mét khối ')
    .replace(/m³|m3/gi, ' mét khối ')
    .replace(/(\d)\s*kg\b/gi, '$1 ki-lô-gam')
    .replace(/(\d)\s*cm\b/gi, '$1 xăng-ti-mét')
    .replace(/(\d)\s*dm\b/gi, '$1 đề-xi-mét')
    .replace(/(\d)\s*mm\b/gi, '$1 mi-li-mét')
    .replace(/(\d)\s*km\b/gi, '$1 ki-lô-mét')
    .replace(/(\d)\s*m\b/gi, '$1 mét')
    .replace(/(\d)\s*g\b/gi, '$1 gam')
    .replace(/(\d)\s*l\b/gi, '$1 lít')
    .replace(/(\d)\s*h\b/gi, '$1 giờ')
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, '$1 phần $2')
    .replace(/(\d)\s*%/g, '$1 phần trăm')
    .replace(/(\d)\s*°/g, '$1 độ')
    .replace(/s\s*=\s*v\s*[×x*]\s*t/gi, 'quãng đường bằng vận tốc nhân thời gian')
    .replace(/=>|➔|→/g, ', suy ra ')
    .replace(/≥/g, ' lớn hơn hoặc bằng ')
    .replace(/≤/g, ' nhỏ hơn hoặc bằng ')
    .replace(/×/g, ' nhân ')
    .replace(/(\d|\))\s*:\s*(\d|\()/g, '$1 chia $2')
    .replace(/(\d|\))\s*\+\s*(\d|\()/g, '$1 cộng $2')
    .replace(/(\d|\)|[a-z])\s*-\s*(\d|\()/gi, '$1 trừ $2')
    .replace(/=\s*\?/g, ' bằng bao nhiêu')
    .replace(/=/g, ' bằng ')
    .replace(/\br\s+bằng/gi, 'bán kính bằng')
    .replace(/\bx\s+trừ/gi, 'ích trừ')
    .replace(/\bx\s+cộng/gi, 'ích cộng')
    .replace(/\bgiá trị của x\b/gi, 'giá trị của ích')
    .replace(/\bGDPT\s*2018\b/gi, 'chương trình giáo dục phổ thông 2018')
    .replace(/["""'']/g, ' ')
    .replace(/[()]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

function splitSpeechChunks(text, maxLen = 170) {
  if (!text) return [];
  if (text.length <= maxLen) return [text];

  const chunks = [];
  const sentences = text.split(/(?<=[.!?;,:])\s+/);
  let current = '';

  for (const part of sentences) {
    if (!part) continue;
    if ((current + ' ' + part).trim().length <= maxLen) {
      current = (current + ' ' + part).trim();
    } else {
      if (current) chunks.push(current);
      if (part.length <= maxLen) {
        current = part;
      } else {
        const words = part.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

let activeSessionId = 0;
let currentAudio = null;
let currentObjectUrl = null;

export function stopVietnameseSpeech() {
  activeSessionId += 1;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = '';
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (currentObjectUrl) {
    try {
      URL.revokeObjectURL(currentObjectUrl);
    } catch {
      // ignore
    }
    currentObjectUrl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

function findStrictVietnameseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === 'vi-vn') ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('vi')) ||
    voices.find((v) => v.name && /vietnam|tiếng việt|hoaimy|namminh|linh/i.test(v.name)) ||
    null
  );
}

function speakWithBrowserVietnameseVoice(normalizedText, sessionId, { onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('Trình duyệt hiện chưa hỗ trợ đọc giọng nói tiếng Việt.');
    return;
  }

  const attemptSpeak = () => {
    if (sessionId !== activeSessionId) return;
    const viVoice = findStrictVietnameseVoice();
    if (!viVoice) {
      onError?.('Không tìm thấy giọng đọc tiếng Việt trên trình duyệt khi ngoại tuyến.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.voice = viVoice;
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onError?.('Không thể phát giọng đọc tiếng Việt.');
    window.speechSynthesis.speak(utterance);
  };

  const existing = window.speechSynthesis.getVoices();
  if (existing && existing.length > 0) {
    attemptSpeak();
    return;
  }

  let handled = false;
  const onVoicesReady = () => {
    if (handled) return;
    handled = true;
    window.speechSynthesis.removeEventListener?.('voiceschanged', onVoicesReady);
    attemptSpeak();
  };
  window.speechSynthesis.addEventListener?.('voiceschanged', onVoicesReady);
  setTimeout(onVoicesReady, 350);
}

/**
 * Đọc văn bản thuần tiếng Việt qua máy chủ âm thanh /api/tts (đảm bảo mọi trình duyệt đều đọc đúng tiếng Việt),
 * chỉ dùng Web Speech khi trình duyệt thực sự có gói giọng vi-VN (tuyệt đối không fallback sang tiếng Anh).
 */
export async function speakVietnamese(text, callbacks = {}) {
  const { onStart, onEnd, onError } = callbacks;
  stopVietnameseSpeech();

  const normalized = normalizeVietnameseMathSpeech(text);
  if (!normalized) {
    onEnd?.();
    return;
  }

  const sessionId = activeSessionId;
  const chunks = splitSpeechChunks(normalized, 170);

  try {
    onStart?.();
    for (let i = 0; i < chunks.length; i += 1) {
      if (sessionId !== activeSessionId) return;
      const chunk = chunks[i];
      const res = await fetch(`/api/tts?text=${encodeURIComponent(chunk)}`);
      if (!res.ok) {
        throw new Error(`TTS HTTP ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('audio')) {
        throw new Error('Phản hồi không phải âm thanh');
      }
      const blob = await res.blob();
      if (sessionId !== activeSessionId) return;

      const objUrl = URL.createObjectURL(blob);
      currentObjectUrl = objUrl;

      await new Promise((resolve, reject) => {
        if (sessionId !== activeSessionId) {
          resolve();
          return;
        }
        const audio = new Audio(objUrl);
        currentAudio = audio;
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Lỗi phát âm thanh tiếng Việt'));
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(reject);
        }
      });

      if (currentObjectUrl === objUrl) {
        URL.revokeObjectURL(objUrl);
        currentObjectUrl = null;
      }
      currentAudio = null;
    }

    if (sessionId === activeSessionId) {
      onEnd?.();
    }
  } catch {
    if (sessionId !== activeSessionId) return;
    // Chỉ fallback nếu máy thực sự có giọng tiếng Việt (không bao giờ đọc tiếng Anh)
    speakWithBrowserVietnameseVoice(normalized, sessionId, { onStart, onEnd, onError });
  }
}
