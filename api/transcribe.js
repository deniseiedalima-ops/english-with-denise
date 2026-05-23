export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    console.log('Audio buffer size:', buffer.length, 'bytes');

    // If audio too small, return helpful message
    if (buffer.length < 1000) {
      return res.json({ 
        text: '',
        error: 'Audio too short or empty',
        size: buffer.length
      });
    }

    // Try webm first, fallback to mp4
    const tryTranscribe = async (filename, contentType) => {
      const { FormData, File } = await import('undici');
      const form = new FormData();
      const audioFile = new File([buffer], filename, { type: contentType });
      form.append('file', audioFile);
      form.append('model', 'whisper-1');
      form.append('language', 'en');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: form,
      });
      return response;
    };

    let response = await tryTranscribe('audio.webm', 'audio/webm');
    
    if (!response.ok) {
      // Try as mp4
      response = await tryTranscribe('audio.mp4', 'audio/mp4');
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Whisper error:', errText);
      return res.json({ text: '', error: errText });
    }

    const data = await response.json();
    console.log('Whisper response:', data);
    return res.json({ text: data.text || '' });

  } catch (err) {
    console.error('Transcribe error:', err);
    return res.status(500).json({ text: '', error: err.message });
  }
}
