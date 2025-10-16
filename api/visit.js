// api/visit.js
const UAParser = require('ua-parser-js');

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
    time: new Date().toISOString(),
    ip,
    ua: uaString,
    ua_parsed: uaResult,
    ua_client_hints: payload.uaData || null,
    platform: payload.platform || null,
    lang: payload.lang || null,
    screen: payload.screen || null,
    tz: payload.tz || null,
    referrer: payload.referrer || null,
    href: payload.href || null
  };

  console.log('new visit:', logData);

  res.status(200).json({ ok: true });
};
