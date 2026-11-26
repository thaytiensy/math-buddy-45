// Serverless endpoint đọc văn bản thuần tiếng Việt qua luồng âm thanh MP3
const MAX_CHUNK_LEN = 200;

export default async function handler(req, res) {
  try {
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const rawText = (urlObj.searchParams.get('text') || '').trim();

    if (!rawText) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Thiếu nội dung cần đọc.' }));
      return;
    }

    const safeText = rawText.slice(0, MAX_CHUNK_LEN);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(safeText)}`;

    const upstream = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });

    if (!upstream.ok) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Không thể tải giọng đọc tiếng Việt lúc này.' }));
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(buffer);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Lỗi xử lý giọng đọc tiếng Việt.' }));
  }
}
