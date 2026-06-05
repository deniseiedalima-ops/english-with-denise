// Server-side image upload to Cloudinary — avoids CORS issues
export const config = { api: { bodyParser: false } };

const CLOUD_NAME = 'dbkrebqs0';
const UPLOAD_PRESET = 'agrr8msy';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Read raw body (the image file as binary)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || 'image/jpeg';

    console.log(`[upload] ${buffer.length} bytes | ${contentType}`);

    if (buffer.length < 100) {
      return res.status(400).json({ error: 'File too small or empty' });
    }

    // Build multipart form for Cloudinary
    const boundary = '----CloudinaryBoundary' + Date.now();
    const CRLF = '\r\n';

    // file part
    const fileHeader = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="photo.jpg"${CRLF}` +
      `Content-Type: ${contentType}${CRLF}${CRLF}`
    );

    // upload_preset part
    const presetPart = Buffer.from(
      `${CRLF}--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="upload_preset"${CRLF}${CRLF}` +
      `${UPLOAD_PRESET}${CRLF}`
    );

    // folder part
    const folderPart = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="folder"${CRLF}${CRLF}` +
      `english-rats${CRLF}` +
      `--${boundary}--${CRLF}`
    );

    const body = Buffer.concat([fileHeader, buffer, presetPart, folderPart]);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length.toString(),
        },
        body,
      }
    );

    const data = await uploadRes.json();
    console.log('[upload] Cloudinary response:', uploadRes.status, data.secure_url || data.error);

    if (!uploadRes.ok || !data.secure_url) {
      return res.status(500).json({ error: data?.error?.message || 'Upload failed' });
    }

    return res.json({ url: data.secure_url });
  } catch (err) {
    console.error('[upload] Exception:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
