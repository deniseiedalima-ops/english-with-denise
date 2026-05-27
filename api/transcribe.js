export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.json({ text: '', error: 'no_api_key' });

  // Read raw body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const audioBuffer = Buffer.concat(chunks);
  const contentType = req.headers['content-type'] || 'audio/webm';

  console.log(`[transcribe] ${audioBuffer.length} bytes | ${contentType}`);

  if (audioBuffer.length < 1000) {
    return res.json({ text: '', error: 'audio_too_short', size: audioBuffer.length });
  }

  // Determine extension
  let ext = 'webm';
  if (contentType.includes('mp4') || contentType.includes('m4a')) ext = 'mp4';
  else if (contentType.includes('ogg')) ext = 'ogg';
  else if (contentType.includes('wav')) ext = 'wav';

  const tryWhisper = async (buffer, filename, mime) => {
    // Build multipart manually — most reliable cross-platform approach
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const CRLF = '\r\n';

    const header = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"${CRLF}` +
      `Content-Type: ${mime}${CRLF}${CRLF}`
    );
    const modelPart = Buffer.from(
      `${CRLF}--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="model"${CRLF}${CRLF}` +
      `whisper-1${CRLF}` +
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="language"${CRLF}${CRLF}` +
      `en${CRLF}` +
      `--${boundary}--${CRLF}`
    );

    const body = Buffer.concat([header, buffer, modelPart]);

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length.toString(),
      },
      body,
    });

    const text = await r.text();
    console.log(`[whisper] ${filename} → ${r.status} | ${text.substring(0, 150)}`);
    return { ok: r.ok, status: r.status, body: text };
  };

  let result = await tryWhisper(audioBuffer, `audio.${ext}`, contentType.split(';')[0].trim());

  // Safari/iOS fallback: retry as mp4
  if (!result.ok && ext !== 'mp4') {
    console.log('[transcribe] Retrying as mp4...');
    result = await tryWhisper(audioBuffer, 'audio.mp4', 'audio/mp4');
  }

  // Retry as wav if still failing
  if (!result.ok) {
    console.log('[transcribe] Retrying as wav...');
    result = await tryWhisper(audioBuffer, 'audio.wav', 'audio/wav');
  }

  if (!result.ok) {
    let parsed = {};
    try { parsed = JSON.parse(result.body); } catch {}
    const msg = parsed?.error?.message || result.body || 'unknown';
    if (result.status === 401) return res.json({ text: '', error: 'invalid_api_key' });
    if (result.status === 429 || msg.includes('quota')) return res.json({ text: '', error: 'quota_exceeded' });
    return res.json({ text: '', error: 'whisper_failed', detail: msg });
  }

  let transcript = '';
  try { transcript = JSON.parse(result.body).text || ''; }
  catch { transcript = result.body.trim(); }

  console.log(`[transcribe] ✅ "${transcript.substring(0, 80)}"`);
  return res.json({ text: transcript.trim() });
}
