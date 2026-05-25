export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.OPENAI_API_KEY;

  // ── 1. Check API key ─────────────────────────────────────────────────────
  if (!key) {
    console.error('[transcribe] ❌ OPENAI_API_KEY missing from environment!');
    return res.json({
      text: '',
      error: 'no_api_key',
      debug: 'OPENAI_API_KEY is not set in Vercel environment variables.'
    });
  }

  // ── 2. Read raw body ──────────────────────────────────────────────────────
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  const contentType = req.headers['content-type'] || '';

  console.log(`[transcribe] size=${buffer.length} bytes | content-type=${contentType}`);

  if (buffer.length < 500) {
    return res.json({
      text: '',
      error: 'audio_too_short',
      debug: `Only ${buffer.length} bytes received. Minimum is 500.`
    });
  }

  // ── 3. Extract audio from FormData or use raw buffer ─────────────────────
  let audioBuffer = buffer;
  let audioMime = contentType.split(';')[0].trim() || 'audio/webm';

  if (contentType.includes('multipart/form-data')) {
    // Parse boundary
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
    if (boundaryMatch) {
      const boundary = '--' + boundaryMatch[1];
      const bodyStr = buffer.toString('binary');
      const parts = bodyStr.split(boundary).filter(p => p.includes('Content-Disposition'));
      for (const part of parts) {
        if (part.includes('name="audio"') || part.includes('filename=')) {
          const ctMatch = part.match(/Content-Type:\s*([^\r\n]+)/i);
          if (ctMatch) audioMime = ctMatch[1].trim();
          const dataStart = part.indexOf('\r\n\r\n') + 4;
          const dataEnd = part.lastIndexOf('\r\n');
          audioBuffer = Buffer.from(part.substring(dataStart, dataEnd), 'binary');
          console.log(`[transcribe] Extracted from FormData: ${audioBuffer.length} bytes, type: ${audioMime}`);
          break;
        }
      }
    }
  }

  // ── 4. Determine file extension ───────────────────────────────────────────
  const extMap = {
    'audio/webm': 'webm', 'audio/mp4': 'mp4', 'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3', 'audio/ogg': 'ogg', 'audio/wav': 'wav',
    'audio/x-m4a': 'mp4', 'video/webm': 'webm',
  };
  const cleanMime = audioMime.split(';')[0].trim();
  const ext = extMap[cleanMime] || 'webm';

  // ── 5. Try Whisper with primary format ────────────────────────────────────
  const whisper = async (buf, filename, mime) => {
    const { default: FormData } = await import('form-data');
    const form = new FormData();
    form.append('file', buf, { filename, contentType: mime });
    form.append('model', 'whisper-1');
    form.append('language', 'en');

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, ...form.getHeaders() },
      body: form,
    });
    const text = await r.text();
    console.log(`[whisper] ${filename} → HTTP ${r.status} | ${text.substring(0, 150)}`);
    return { ok: r.status === 200, status: r.status, body: text };
  };

  let result = await whisper(audioBuffer, `audio.${ext}`, cleanMime);

  // ── 6. Retry with mp4 if webm fails (Safari/iOS) ─────────────────────────
  if (!result.ok && ext === 'webm') {
    console.log('[transcribe] webm failed → retrying as mp4...');
    result = await whisper(audioBuffer, 'audio.mp4', 'audio/mp4');
  }

  // ── 7. Handle quota / auth errors ────────────────────────────────────────
  if (!result.ok) {
    let parsed = {};
    try { parsed = JSON.parse(result.body); } catch {}
    const msg = parsed?.error?.message || result.body || 'Unknown error';
    const code = parsed?.error?.code || parsed?.error?.type || '';

    console.error(`[transcribe] Whisper failed: ${msg}`);

    if (result.status === 401) return res.json({ text: '', error: 'invalid_api_key', debug: msg });
    if (result.status === 429 || msg.includes('quota') || msg.includes('billing')) {
      return res.json({ text: '', error: 'quota_exceeded', debug: msg });
    }
    return res.json({ text: '', error: 'whisper_failed', debug: msg, status: result.status });
  }

  // ── 8. Parse and return transcript ───────────────────────────────────────
  let transcript = '';
  try { transcript = JSON.parse(result.body).text || ''; }
  catch { transcript = result.body; }

  console.log(`[transcribe] ✅ "${transcript.substring(0, 80)}"`);
  return res.json({ text: transcript.trim() });
}
