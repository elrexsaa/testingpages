const UAParser = require('ua-parser-js');
const fetch = require('node-fetch');

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
  if (xff) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  const ip = getClientIp(req);
  const payload = req.body || {};
  const uaString = req.headers['user-agent'] || payload.ua || '';
  const parser = new UAParser(uaString);
  const uaResult = parser.getResult();

  const logData = {
    time: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    ip,
    browser: uaResult.browser.name,
    os: uaResult.os.name,
    device: uaResult.device.model || 'unknown',
    platform: payload.platform || '',
    lang: payload.lang || '',
    href: payload.href || '',
    referrer: payload.referrer || ''
  };

  // bikin format pesan biar rapi di telegram
  const msg = `
📌 *Visitor Access*
🕒 ${logData.time}
🌐 IP: ${logData.ip}
📱 Device: ${logData.device || '-'}
🧭 OS: ${logData.os || '-'}
🧭 Browser: ${logData.browser || '-'}
🔗 Page: ${logData.href}
↩️ Referrer: ${logData.referrer || '-'}
  `;

  // kirim ke telegram
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: msg,
        parse_mode: 'Markdown'
      })
    }).catch(err => console.error('gagal kirim telegram', err));
  }

  res.status(200).json({ ok: true });
};
