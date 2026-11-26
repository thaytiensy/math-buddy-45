import fs from 'fs';
import path from 'path';
import net from 'net';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outImgDir = path.join(rootDir, 'public', 'tai-lieu', 'anh-huong-dan');
const rawDir = '/tmp/math_buddy_raw_slides';

fs.mkdirSync(outImgDir, { recursive: true });
fs.mkdirSync(rawDir, { recursive: true });

const VIEWPORT_W = 1360;
const VIEWPORT_H = 820;

function findFreePort(start = 4356, end = 4398) {
  return new Promise((resolve, reject) => {
    let port = start;
    const tryNext = () => {
      if (port > end) return reject(new Error('Không tìm thấy cổng trống'));
      const srv = net.createServer();
      srv.once('error', () => {
        port += 1;
        tryNext();
      });
      srv.once('listening', () => {
        srv.close(() => resolve(port));
      });
      srv.listen(port, '127.0.0.1');
    };
    tryNext();
  });
}

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Hết thời gian chờ máy chủ ${url}`);
}

async function main() {
  const port = await findFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: rootDir,
    stdio: 'ignore',
  });

  const chromeProfile = `/tmp/chrome-slides-${Date.now()}`;
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${VIEWPORT_W},${VIEWPORT_H}`,
    '--remote-debugging-port=9235',
    `--user-data-dir=${chromeProfile}`,
    'about:blank',
  ]);

  try {
    await waitForHttp(baseUrl);
    await new Promise((r) => setTimeout(r, 1500));

    const targets = await (await fetch('http://127.0.0.1:9235/json')).json();
    const pageTarget = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const cdp = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (ev) => {
          const data = JSON.parse(ev.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(new Error(JSON.stringify(data.error)));
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });

    await new Promise((r) => ws.addEventListener('open', r));
    await cdp('Page.enable');
    await cdp('Runtime.enable');
    await cdp('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT_W,
      height: VIEWPORT_H,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const evalJS = async (expression) => {
      const res = await cdp('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      return res.result?.value;
    };

    const getRectByText = async (selector, textIncludes) =>
      evalJS(`(() => {
        const els = Array.from(document.querySelectorAll(${JSON.stringify(selector)}));
        const el = els.find(e => e.textContent && e.textContent.includes(${JSON.stringify(textIncludes)}));
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
      })()`);

    const getRectBySelector = async (selector) =>
      evalJS(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
      })()`);

    const clickByText = async (selector, textIncludes) => {
      const ok = await evalJS(`(() => {
        const els = Array.from(document.querySelectorAll(${JSON.stringify(selector)}));
        const el = els.find(e => e.textContent && e.textContent.includes(${JSON.stringify(textIncludes)}));
        if (!el) return false;
        el.click();
        return true;
      })()`);
      await new Promise((r) => setTimeout(r, 350));
      return ok;
    };

    const captureRaw = async (filename) => {
      const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(rawDir, filename);
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      return filePath;
    };

    // 1. Mở trang chủ và dọn localStorage sạch
    await cdp('Page.navigate', { url: baseUrl });
    await new Promise((r) => setTimeout(r, 1800));
    await evalJS('localStorage.clear()');
    await cdp('Page.reload', {});
    await new Promise((r) => setTimeout(r, 1500));

    // --- CAPTURE 1 & 4: Trang chủ & Thanh công cụ (Lớp 4 - Hình học) ---
    await clickByText('button', 'Hình Học & Đo Lường Lớp 4');
    await new Promise((r) => setTimeout(r, 350));
    const rawHomePath = await captureRaw('raw_home.png');
    const rGrade = await getRectByText('button', 'Lớp 4');
    const rTabs = await getRectByText('button', 'Đấu trường 60 giây');
    const rEditBtn = await getRectByText('button', 'Sửa câu hỏi');
    const rDocsBtn = await getRectByText('button', 'Tài liệu');
    const rScratchNav = await getRectByText('button', 'Bảng Nháp');
    const rMascotSpeak = await getRectBySelector('button[title*="Cú Vàng"]');
    const rReportBtn = await getRectBySelector('button[title*="Báo cáo học tập"]');

    // --- CAPTURE 3: Lớp 5 - Toán chuyển động đều ---
    await clickByText('button', 'Lớp 5');
    await new Promise((r) => setTimeout(r, 250));
    await clickByText('button', 'Toán Chuyển Động Đều');
    await new Promise((r) => setTimeout(r, 350));
    const rawGrade5Path = await captureRaw('raw_grade5.png');
    const rG5Btn = await getRectByText('button', 'Lớp 5');
    const rMotionTopic = await getRectByText('button', 'Toán Chuyển Động Đều');
    const rHearQ = await getRectByText('button', 'Nghe đề');

    // --- CAPTURE 5: Chế độ Luyện tập đã bật Gợi ý + trả lời đúng + Lời giải ---
    await clickByText('button', 'Xem gợi ý tư duy');
    await clickByText('button', '54 km/giờ');
    await new Promise((r) => setTimeout(r, 500));
    const rawPracticeSolvedPath = await captureRaw('raw_practice_solved.png');
    const rHearSolved = await getRectByText('button', 'Nghe đề');
    const rHintBox = await getRectByText('span', 'Gợi ý cách làm');
    const rExplainVoice = await getRectByText('button', 'Nghe lời giải');
    const rNextQ = await getRectByText('button', 'Câu tiếp theo');

    // --- CAPTURE 6: Bảng Nháp Thông Minh ---
    await clickByText('button', 'Bảng Nháp');
    await new Promise((r) => setTimeout(r, 350));
    // Vẽ mẫu phép tính minh họa lên canvas
    await evalJS(`(() => {
      const c = document.querySelector('canvas');
      if (!c) return;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3.5;
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText('v = s : t = 135 : 2,5 = 54 (km/giờ)', 70, 90);
      ctx.fillStyle = '#b45309';
      ctx.fillText('Đặt tính:   1350  |  25', 70, 165);
      ctx.fillText('             100  |------', 70, 205);
      ctx.fillText('               0  |  54', 70, 245);
      // Vẽ sơ đồ đoạn thẳng
      ctx.beginPath();
      ctx.strokeStyle = '#dc2626';
      ctx.moveTo(70, 315);
      ctx.lineTo(420, 315);
      ctx.moveTo(70, 305);
      ctx.lineTo(70, 325);
      ctx.moveTo(420, 305);
      ctx.lineTo(420, 325);
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Quãng đường s = 135 km (t = 2,5 giờ)', 95, 298);
    })()`);
    await new Promise((r) => setTimeout(r, 200));
    const rawScratchpadPath = await captureRaw('raw_scratchpad.png');
    const rPenTool = await getRectByText('button', 'Bút vẽ');
    const rEraserTool = await getRectByText('button', 'Tẩy chì');
    const rClearTool = await getRectByText('button', 'Xóa sạch nháp');
    const rCanvas = await getRectBySelector('canvas');
    await evalJS(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.closest('.border-amber-300') && b.querySelector('svg') && b.className.includes('rounded-full'));
      closeBtn?.click();
    })()`);
    await new Promise((r) => setTimeout(r, 250));

    // --- CAPTURE 7: Đấu Trường Tính Nhẩm 60 Giây ---
    await clickByText('button', 'Đấu trường 60 giây');
    await clickByText('button', 'BẮT ĐẦU NGAY');
    await new Promise((r) => setTimeout(r, 350));
    const rawSpeedPath = await captureRaw('raw_speed.png');
    const rTimer = await getRectByText('div', 'giây');
    const rScore = await getRectByText('span', 'Điểm hiện tại');

    // --- CAPTURE 8: Bản Đồ Thám Hiểm Đảo Toán Học ---
    await clickByText('button', 'Thám hiểm');
    await new Promise((r) => setTimeout(r, 300));
    const rawAdventurePath = await captureRaw('raw_adventure.png');
    const rQuest1 = await getRectByText('h4', 'Rừng Số Tự Nhiên');
    const rQuestEdit = await getRectByText('button', 'Tùy chỉnh ải thử thách');

    // --- CAPTURE 9: Quản Lý & Tự Sửa Câu Hỏi — Đáp Án ---
    await clickByText('button', 'Sửa câu hỏi');
    await new Promise((r) => setTimeout(r, 300));
    await clickByText('button', 'Sửa');
    await new Promise((r) => setTimeout(r, 300));
    const rawEditorPath = await captureRaw('raw_editor.png');
    const rScopePrac = await getRectByText('button', 'Câu Hỏi Luyện Tập');
    const rScopeAdv = await getRectByText('button', 'Thử Thách Thám Hiểm');
    const rTestVoice = await getRectByText('button', 'Nghe thử tiếng Việt');
    const rSaveQ = await getRectByText('button', 'Lưu câu hỏi');
    await evalJS(`document.querySelector('button[aria-label="Đóng trình sửa câu hỏi"]')?.click()`);
    await new Promise((r) => setTimeout(r, 250));

    // --- CAPTURE 10: Phiếu Vinh Danh & Báo Cáo Học Tập ---
    await evalJS(`document.querySelector('button[title*="Báo cáo học tập"]')?.click()`);
    await new Promise((r) => setTimeout(r, 350));
    const rawReportPath = await captureRaw('raw_report.png');
    const rPrintBtn = await getRectByText('button', 'In phiếu khen thưởng');

    // --- COMPOSITOR: Vẽ chú thích trực tiếp lên từng ảnh thật ---
    const renderAnnotated = async (rawImagePath, outFilename, annotations) => {
      const b64 = fs.readFileSync(rawImagePath).toString('base64');
      const dataUrl = `data:image/png;base64,${b64}`;

      const boxesHtml = annotations
        .map((a) => {
          const rectHtml = a.rect
            ? `<div style="position:absolute;left:${a.rect.x - 4}px;top:${a.rect.y - 4}px;width:${a.rect.w + 8}px;height:${a.rect.h + 8}px;border:3.5px solid ${a.color};border-radius:14px;box-shadow:0 0 0 3px rgba(255,255,255,0.85), 0 4px 14px rgba(0,0,0,0.22);background:${a.tint || 'transparent'};pointer-events:none;"></div>
               <div style="position:absolute;left:${a.rect.x - 14}px;top:${a.rect.y - 14}px;width:28px;height:28px;border-radius:999px;background:${a.color};color:#fff;font-weight:900;font-size:15px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.3);">${a.num}</div>`
            : '';

          const calloutHtml = `<div style="position:absolute;left:${a.box.x}px;top:${a.box.y}px;max-width:${a.box.w || 330}px;background:rgba(255,255,255,0.97);border:2.5px solid ${a.color};border-radius:14px;padding:8px 12px;box-shadow:0 10px 24px rgba(15,23,42,0.22);display:flex;align-items:flex-start;gap:8px;">
            <span style="flex-shrink:0;width:24px;height:24px;border-radius:999px;background:${a.color};color:#fff;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;margin-top:1px;">${a.num}</span>
            <div style="font-size:13.5px;line-height:1.35;color:#0f172a;font-weight:800;">
              <div style="color:${a.color};font-size:13px;font-weight:900;margin-bottom:2px;">${a.title}</div>
              <div style="font-weight:700;color:#334155;font-size:12.5px;">${a.desc}</div>
            </div>
          </div>`;

          let arrowHtml = '';
          if (a.rect && a.arrow !== false) {
            const tx = a.rect.x + a.rect.w / 2;
            const ty = a.rect.y + a.rect.h / 2;
            const bx = a.box.x + (a.box.w || 300) / 2;
            const by = a.box.y + 26;
            const sx = bx < a.rect.x ? a.box.x + (a.box.w || 300) : bx > a.rect.x + a.rect.w ? a.box.x : bx;
            const sy = by < a.rect.y ? a.box.y + 54 : by > a.rect.y + a.rect.h ? a.box.y : by;
            const ex = sx < a.rect.x ? a.rect.x - 6 : sx > a.rect.x + a.rect.w ? a.rect.x + a.rect.w + 6 : tx;
            const ey = sy < a.rect.y ? a.rect.y - 6 : sy > a.rect.y + a.rect.h ? a.rect.y + a.rect.h + 6 : ty;
            arrowHtml = `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${a.color}" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#arrow-${a.num})" />`;
          }

          return { rectHtml, calloutHtml, arrowHtml, num: a.num, color: a.color };
        });

      const defsHtml = boxesHtml
        .map(
          (b) =>
            `<marker id="arrow-${b.num}" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><polygon points="0 0, 8 3.5, 0 7" fill="${b.color}" /></marker>`
        )
        .join('');

      const html = `<!doctype html><html><head><meta charset="utf-8"><style>
        * { box-sizing: border-box; font-family: 'DejaVu Sans', Arial, sans-serif; }
        body { margin:0; padding:0; width:${VIEWPORT_W}px; height:${VIEWPORT_H}px; position:relative; overflow:hidden; background:#f8fafc; }
      </style></head><body>
        <img src="${dataUrl}" style="width:${VIEWPORT_W}px;height:${VIEWPORT_H}px;display:block;" />
        <svg width="${VIEWPORT_W}" height="${VIEWPORT_H}" style="position:absolute;left:0;top:0;pointer-events:none;">
          <defs>${defsHtml}</defs>
          ${boxesHtml.map((b) => b.arrowHtml).join('')}
        </svg>
        ${boxesHtml.map((b) => b.rectHtml).join('')}
        ${boxesHtml.map((b) => b.calloutHtml).join('')}
      </body></html>`;

      await cdp('Page.setDocumentContent', {
        frameId: pageTarget.id,
        html,
      });
      await new Promise((r) => setTimeout(r, 300));
      const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(outImgDir, outFilename);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log('Đã xuất ảnh chú thích:', outFilename);
    };

    // 1. Ảnh Tổng quan giao diện
    await renderAnnotated(rawHomePath, 'slide-01-tong-quan.png', [
      {
        num: 1,
        color: '#2563EB',
        rect: rGrade,
        box: { x: 24, y: 120, w: 300 },
        title: 'Bước 1: Chọn khối Lớp 4 hoặc Lớp 5',
        desc: 'Chuyển nhanh bộ chuyên đề và câu hỏi phù hợp khối lớp.',
      },
      {
        num: 2,
        color: '#E11D48',
        rect: rTabs,
        box: { x: 350, y: 120, w: 320 },
        title: 'Bước 2: Chọn chế độ học tập',
        desc: 'Gồm Luyện tập, Đấu trường 60 giây và Thám hiểm Đảo Toán Học.',
      },
      {
        num: 3,
        color: '#059669',
        rect: rEditBtn,
        box: { x: 960, y: 120, w: 370 },
        title: 'Bước 3: Tùy biến nội dung & Tài liệu',
        desc: 'Mở Sửa câu hỏi, xem Tài liệu (Slide/Word) hoặc mở Bảng Nháp.',
      },
      {
        num: 4,
        color: '#D97706',
        rect: rMascotSpeak,
        box: { x: 960, y: 245, w: 370 },
        title: 'Bước 4: Nghe Cú Vàng đọc tiếng Việt',
        desc: 'Bấm biểu tượng loa để nghe trợ lý Cú Vàng đọc lời nhắn cổ vũ.',
      },
    ]);

    // 2. Ảnh Lớp 5 & Chuyên đề Chuyển động đều
    await renderAnnotated(rawGrade5Path, 'slide-03-chuyen-de-lop-5.png', [
      {
        num: 1,
        color: '#D97706',
        rect: rG5Btn,
        box: { x: 24, y: 120, w: 300 },
        title: 'Chọn khối Lớp 5',
        desc: 'Tải 4 chuyên đề Lớp 5: Thập phân, Phần trăm, Hình khối và Chuyển động.',
      },
      {
        num: 2,
        color: '#4F46E5',
        rect: rMotionTopic,
        box: { x: 890, y: 195, w: 430 },
        title: 'Chọn chủ đề muốn luyện tập',
        desc: 'Mỗi chủ đề gồm các bài toán chuẩn GDPT 2018 kèm công thức minh họa.',
      },
      {
        num: 3,
        color: '#0284C7',
        rect: rHearQ,
        box: { x: 930, y: 420, w: 390 },
        title: 'Đọc đề chuẩn đơn vị đo tiếng Việt',
        desc: 'Tự động đọc "ki-lô-mét trên giờ", "mét khối", không đọc nhầm tiếng Anh.',
      },
    ]);

    // 3. Ảnh Thanh điều hướng chi tiết
    await renderAnnotated(rawHomePath, 'slide-04-thanh-dieu-huong.png', [
      {
        num: 1,
        color: '#059669',
        rect: rEditBtn,
        box: { x: 520, y: 115, w: 280 },
        title: 'Nút Sửa câu hỏi',
        desc: 'Tự chỉnh sửa, thêm mới đề bài và đáp án.',
      },
      {
        num: 2,
        color: '#4F46E5',
        rect: rDocsBtn,
        box: { x: 815, y: 115, w: 255 },
        title: 'Nút Tài liệu',
        desc: 'Xem và tải Slide (.pptx) + Mô tả (.docx).',
      },
      {
        num: 3,
        color: '#D97706',
        rect: rScratchNav,
        box: { x: 1085, y: 115, w: 255 },
        title: 'Bảng Nháp & Vinh danh',
        desc: 'Mở bảng vẽ nháp hoặc bấm Cúp xem báo cáo.',
      },
      {
        num: 4,
        color: '#E11D48',
        rect: rReportBtn,
        box: { x: 1020, y: 215, w: 315 },
        title: 'Phiếu Vinh Danh Học Tập',
        desc: 'Xem Sao thưởng, xếp hạng và in phiếu khen.',
      },
    ]);

    // 4. Ảnh Chế độ Luyện tập từng bước
    await renderAnnotated(rawPracticeSolvedPath, 'slide-05-luyen-tap.png', [
      {
        num: 1,
        color: '#2563EB',
        rect: rHearSolved,
        box: { x: 24, y: 230, w: 300 },
        title: '① Bấm Nghe đề (Thuần Việt)',
        desc: 'Nghe giọng đọc tiếng Việt rõ ràng từng dữ kiện và đơn vị toán.',
      },
      {
        num: 2,
        color: '#D97706',
        rect: rHintBox,
        box: { x: 960, y: 465, w: 375 },
        title: '② Xem gợi ý tư duy',
        desc: 'Bật gợi ý từng bước nếu bé cần định hướng cách giải trước khi chọn.',
      },
      {
        num: 3,
        color: '#059669',
        rect: rExplainVoice,
        box: { x: 960, y: 600, w: 375 },
        title: '③ Chọn đáp án & Nghe lời giải',
        desc: 'Trả lời đúng nhận +10 Sao và bấm Nghe lời giải chi tiết.',
      },
      {
        num: 4,
        color: '#4F46E5',
        rect: rNextQ,
        box: { x: 30, y: 660, w: 310 },
        title: '④ Chuyển sang câu tiếp theo',
        desc: 'Tiếp tục làm các câu còn lại để hoàn thành chủ đề.',
      },
    ]);

    // 5. Ảnh Bảng Nháp Thông Minh
    await renderAnnotated(rawScratchpadPath, 'slide-06-bang-nhap.png', [
      {
        num: 1,
        color: '#2563EB',
        rect: rPenTool,
        box: { x: 760, y: 205, w: 365 },
        title: '① Chọn màu bút & Bút vẽ',
        desc: 'Hỗ trợ 6 màu bút để phân biệt số liệu khi đặt tính hoặc vẽ sơ đồ.',
      },
      {
        num: 2,
        color: '#E11D48',
        rect: rEraserTool,
        box: { x: 760, y: 310, w: 365 },
        title: '② Tẩy chì sửa nét vẽ',
        desc: 'Xóa nhẹ những nét nhầm mà không mất phần bài đã viết đúng.',
      },
      {
        num: 3,
        color: '#DC2626',
        rect: rClearTool,
        box: { x: 760, y: 415, w: 365 },
        title: '③ Xóa sạch nháp',
        desc: 'Làm mới toàn bộ mặt bảng chỉ với một lần bấm khi chuyển bài mới.',
      },
      {
        num: 4,
        color: '#059669',
        rect: rCanvas ? { x: rCanvas.x + 40, y: rCanvas.y + 30, w: 470, h: 310 } : null,
        box: { x: 760, y: 520, w: 365 },
        title: '④ Vùng nháp đặt tính & vẽ sơ đồ',
        desc: 'Dùng chuột, màn hình cảm ứng hoặc bút cảm ứng thoải mái như giấy nháp.',
      },
    ]);

    // 6. Ảnh Đấu Trường 60 Giây
    await renderAnnotated(rawSpeedPath, 'slide-07-dau-truong.png', [
      {
        num: 1,
        color: '#E11D48',
        rect: rTimer,
        box: { x: 960, y: 265, w: 365 },
        title: '① Đồng hồ đếm ngược 60 giây',
        desc: 'Trả lời liên tục nhiều câu tính nhẩm trong 60 giây để lập kỷ lục.',
      },
      {
        num: 2,
        color: '#4F46E5',
        rect: rScore,
        box: { x: 30, y: 315, w: 315 },
        title: '② Điểm số & Chuỗi đúng liên tiếp',
        desc: 'Trả lời đúng từ 3 câu liên tiếp được cộng thêm +5 điểm mỗi câu.',
      },
      {
        num: 3,
        color: '#059669',
        rect: { x: 390, y: 550, w: 580, h: 170 },
        box: { x: 990, y: 560, w: 335 },
        title: '③ Chọn nhanh đáp án đúng',
        desc: 'Hệ thống tự động quy đổi tổng điểm cuối trận thành Sao thưởng.',
      },
    ]);

    // 7. Ảnh Bản Đồ Thám Hiểm
    await renderAnnotated(rawAdventurePath, 'slide-08-tham-hiem.png', [
      {
        num: 1,
        color: '#059669',
        rect: rQuest1,
        box: { x: 30, y: 550, w: 360 },
        title: '① Bấm vào ải đã mở khóa để giải đố',
        desc: 'Vượt ải thành công nhận +25 Sao và huy hiệu danh dự tương ứng.',
      },
      {
        num: 2,
        color: '#0D9488',
        rect: rQuestEdit,
        box: { x: 890, y: 155, w: 420 },
        title: '② Tùy chỉnh thử thách trên bản đồ',
        desc: 'Giáo viên/phụ huynh có thể tự sửa tên ải, mức Sao mở và câu hỏi.',
      },
    ]);

    // 8. Ảnh Quản lý & Tự sửa câu hỏi
    await renderAnnotated(rawEditorPath, 'slide-09-sua-cau-hoi.png', [
      {
        num: 1,
        color: '#059669',
        rect: rScopePrac,
        box: { x: 24, y: 175, w: 230 },
        title: '① Chọn nhóm cần sửa',
        desc: 'Sửa câu hỏi Luyện tập (Lớp 4/5) hoặc Ải Thám hiểm.',
      },
      {
        num: 2,
        color: '#0D9488',
        rect: rScopeAdv,
        box: { x: 24, y: 315, w: 230 },
        title: '② Chọn Ải Thám hiểm',
        desc: 'Chỉnh sửa thử thách và phần thưởng từng ải.',
      },
      {
        num: 3,
        color: '#2563EB',
        rect: rTestVoice,
        box: { x: 1095, y: 205, w: 245 },
        title: '③ Nghe thử tiếng Việt',
        desc: 'Kiểm tra ngay cách đọc đề sau khi vừa nhập nội dung mới.',
      },
      {
        num: 4,
        color: '#D97706',
        rect: rSaveQ,
        box: { x: 1095, y: 590, w: 245 },
        title: '④ Lưu & Sao lưu dữ liệu',
        desc: 'Bấm Lưu để áp dụng ngay; hỗ trợ Xuất/Nhập tệp và Khôi phục mặc định.',
      },
    ]);

    // 9. Ảnh Báo cáo & In phiếu vinh danh
    await renderAnnotated(rawReportPath, 'slide-10-bao-cao.png', [
      {
        num: 1,
        color: '#D97706',
        rect: { x: 365, y: 150, w: 630, h: 205 },
        box: { x: 24, y: 205, w: 310 },
        title: '① Danh hiệu & Thông tin Tác giả',
        desc: 'Tự động thăng hạng Đồng → Bạc → Vàng → Kim Cương theo số Sao.',
      },
      {
        num: 2,
        color: '#4F46E5',
        rect: rPrintBtn,
        box: { x: 995, y: 630, w: 335 },
        title: '② In phiếu khen thưởng',
        desc: 'Bấm để in trực tiếp hoặc lưu thành bản PDF trao tặng học sinh.',
      },
    ]);

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    preview.kill('SIGKILL');
    fs.rmSync(chromeProfile, { recursive: true, force: true });
    fs.rmSync(rawDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
