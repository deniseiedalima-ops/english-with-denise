import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Check content type - handle both multipart and raw binary
    const contentType = req.headers['content-type'] || '';
    let audioBuffer;
    let mimeType = 'audio/webm';

    if (contentType.includes('multipart')) {
      // Parse multipart form data
      const form = formidable({ maxFileSize: 25 * 1024 * 1024 });
      const [, files] = await form.parse(req);
      const file = files.audio?.[0] || files.file?.[0];
      if (!file) return res.json({ text: '', error: 'No audio file received' });
      audioBuffer = fs.readFileSync(file.filepath);
      mimeType = file.mimetype || 'audio/webm';
    } else {
      // Raw binary body
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      audioBuffer = Buffer.concat(chunks);
      mimeType = contentType || 'audio/webm';
    }

    console.log('Audio size:', audioBuffer.length, 'bytes | type:', mimeType);

    if (audioBuffer.length < 500) {
      return res.json({ text: '', error: 'Audio too short', size: audioBuffer.length });
    }

    // Determine file extension
    let ext = 'webm';
    if (mimeType.includes('mp4') || mimeType.includes('m4a')) ext = 'mp4';
    else if (mimeType.includes('ogg')) ext = 'ogg';
    else if (mimeType.includes('wav')) ext = 'wav';
    else if (mimeType.includes('mpeg') || mimeType.includes('mp3')) ext = 'mp3';

    // Build multipart form for OpenAI
    const form = new FormData();
    form.append('file', audioBuffer, {
      filename: `audio.${ext}`,
      contentType: mimeType,
    });
    form.append('model', 'whisper-1');
    form.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Whisper error:', response.status, errText);

      // If webm failed, try again as mp4 (iOS Safari compat)
      if (ext === 'webm') {
        console.log('Retrying as mp4...');
        const form2 = new FormData();
        form2.append('file', audioBuffer, { filename: 'audio.mp4', contentType: 'audio/mp4' });
        form2.append('model', 'whisper-1');
        form2.append('language', 'en');

        const res2 = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, ...form2.getHeaders() },
          body: form2,
        });

        if (res2.ok) {
          const data2 = await res2.json();
          return res.json({ text: data2.text || '' });
        }
      }

      return res.json({ text: '', error: `Whisper error: ${response.status}` });
    }

    const data = await response.json();
    console.log('Whisper transcript:', data.text?.substring(0, 80));
    return res.json({ text: data.text || '' });

  } catch (err) {
    console.error('Transcribe error:', err.message);
    return res.status(500).json({ text: '', error: err.message });
  }
}
