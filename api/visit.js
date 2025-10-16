const UAParser = require('ua-parser-js');
const fetch = require('node-fetch');

// 🗺️ mapping model → nama device lengkap
const deviceMap = {
  // 📱 SAMSUNG
  "SM-A015F": "Samsung Galaxy A01",
  "SM-A115F": "Samsung Galaxy A11",
  "SM-A125F": "Samsung Galaxy A12",
  "SM-A127F": "Samsung Galaxy A12 Nacho",
  "SM-A135F": "Samsung Galaxy A13",
  "SM-A217F": "Samsung Galaxy A21s",
  "SM-A315G": "Samsung Galaxy A31",
  "SM-A325F": "Samsung Galaxy A32",
  "SM-A326B": "Samsung Galaxy A32 5G",
  "SM-A415F": "Samsung Galaxy A41",
  "SM-A515F": "Samsung Galaxy A51",
  "SM-A526B": "Samsung Galaxy A52 5G",
  "SM-A525F": "Samsung Galaxy A52",
  "SM-A536E": "Samsung Galaxy A53",
  "SM-A715F": "Samsung Galaxy A71",
  "SM-M115F": "Samsung Galaxy M11",
  "SM-M127F": "Samsung Galaxy M12",
  "SM-M315F": "Samsung Galaxy M31",
  "SM-M326B": "Samsung Galaxy M32",
  "SM-M336B": "Samsung Galaxy M33",
  "SM-G990E": "Samsung Galaxy S21 FE",
  "SM-G780G": "Samsung Galaxy S20 FE",
  "SM-S918B": "Samsung Galaxy S23 Ultra",
  "SM-S911B": "Samsung Galaxy S23",
  "SM-S916B": "Samsung Galaxy S23+",
  "SM-A546E": "Samsung Galaxy A54",
  "SM-A156E": "Samsung Galaxy A15",

  // 📱 XIAOMI / POCO / REDMI
  "M2004J19C": "Redmi 9",
  "M2006C3MG": "Redmi 9A",
  "M2006C3MNG": "Redmi 9C",
  "M2010J19CG": "Redmi 9T",
  "M2101K7AG": "Poco X3 Pro",
  "M2007J20CG": "Poco F2 Pro",
  "M2012K11AG": "Xiaomi Mi 10T Pro",
  "M2102J20SG": "Poco F3",
  "2201116SG": "Poco X4 Pro 5G",
  "22041216G": "Poco F4 GT",
  "22101316UG": "Poco F5",
  "M2010J19SY": "Redmi Note 9T",
  "M2103K19G": "Redmi Note 10",
  "M2101K7BG": "Redmi Note 10 Pro",
  "2201117TG": "Redmi Note 11",
  "2201117TY": "Redmi Note 11 NFC",
  "22101316G": "Redmi Note 12",
  "23021RAAEG": "Redmi Note 12 5G",
  "23049PCD8G": "Redmi Note 12 Pro",
  "23028RA60L": "Redmi Note 12S",
  "K": "Xiaomi Redmi K Series",

  // 📱 OPPO
  "CPH2127": "OPPO A15",
  "CPH2185": "OPPO A15s",
  "CPH2239": "OPPO A54",
  "CPH2269": "OPPO A55",
  "CPH2381": "OPPO A57",
  "CPH2337": "OPPO Reno 8T",
  "CPH2219": "OPPO Reno 5",
  "CPH2247": "OPPO Reno 6",
  "CPH2359": "OPPO Reno 8",

  // 📱 VIVO
  "V2027": "Vivo Y20",
  "V2043": "Vivo Y20s",
  "V2111": "Vivo Y21",
  "V2129": "Vivo Y21s",
  "V2140": "Vivo Y33s",
  "V2050": "Vivo Y30",
  "V2231": "Vivo V27e",
  "V2313": "Vivo V29e",
  "V2145": "Vivo Y53s",

  // 📱 REALME
  "RMX3231": "Realme C11",
  "RMX3261": "Realme C21",
  "RMX3263": "Realme C21Y",
  "RMX3085": "Realme 8",
  "RMX3357": "Realme GT Neo 2",
  "RMX3471": "Realme Narzo 50",
  "RMX3686": "Realme GT Neo 5",
  "RMX3624": "Realme C33",
  "RMX3516": "Realme Narzo 50A",

  // 🍎 IPHONE (model iPhone umum)
  "iPhone": "Apple iPhone (model hidden)",
  "iPhone10,1": "iPhone 8",
  "iPhone10,4": "iPhone 8",
  "iPhone10,2": "iPhone 8 Plus",
  "iPhone10,5": "iPhone 8 Plus",
  "iPhone10,3": "iPhone X",
  "iPhone10,6": "iPhone X",
  "iPhone11,2": "iPhone XS",
  "iPhone11,4": "iPhone XS Max",
  "iPhone11,6": "iPhone XS Max",
  "iPhone11,8": "iPhone XR",
  "iPhone12,1": "iPhone 11",
  "iPhone12,3": "iPhone 11 Pro",
  "iPhone12,5": "iPhone 11 Pro Max",
  "iPhone13,1": "iPhone 12 Mini",
  "iPhone13,2": "iPhone 12",
  "iPhone13,3": "iPhone 12 Pro",
  "iPhone13,4": "iPhone 12 Pro Max",
  "iPhone14,4": "iPhone 13 Mini",
  "iPhone14,5": "iPhone 13",
  "iPhone14,2": "iPhone 13 Pro",
  "iPhone14,3": "iPhone 13 Pro Max",
  "iPhone15,2": "iPhone 14 Pro",
  "iPhone15,3": "iPhone 14 Pro Max",
  "iPhone15,4": "iPhone 14",
  "iPhone15,5": "iPhone 14 Plus",

  // 🍎 iPad
  "iPad": "Apple iPad (model hidden)",
  "iPad7,5": "iPad 6th Gen",
  "iPad7,6": "iPad 6th Gen",
  "iPad8,1": "iPad Pro 11 (1st Gen)",
  "iPad8,9": "iPad Pro 11 (2nd Gen)",
  "iPad11,6": "iPad 8th Gen",
  "iPad12,1": "iPad 9th Gen",
  "iPad13,18": "iPad 10th Gen",

  // 🍏 Mac
  "Macintosh": "Apple Mac (desktop/laptop)",

  // 📱 Default
  "Unknown": "Device Tidak Dikenali"
};

// 🧠 ambil nama device
function getDeviceName(raw) {
  if (!raw) return "Unknown Device";
  return deviceMap[raw] || raw;
}

// 🕵️ ambil ip
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

  const rawModel = uaResult.device.model || (payload.uaData?.model ?? 'Unknown');
  const deviceName = getDeviceName(rawModel);
  const browserName = uaResult.browser.name || 'Unknown';
  const osName = uaResult.os.name || 'Unknown';
  const lang = payload.lang || '-';
  const page = payload.href || '-';
  const ref = payload.referrer || '-';
  const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const msg = `
✨ *NEW VISITOR ALERT*
━━━━━━━━━━━━━━━━━━━
🕒 *Waktu* : ${time}
📡 *IP* : \`${ip}\`
📱 *Device* : ${deviceName}
🧭 *OS* : ${osName}
🌐 *Browser* : ${browserName}
🗣️ *Bahasa* : ${lang}
🔗 *Halaman* : ${page}
↩️ *Referrer* : ${ref}
━━━━━━━━━━━━━━━━━━━
`;

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error('gagal kirim telegram', err);
    }
  }

  res.status(200).json({ ok: true });
};
