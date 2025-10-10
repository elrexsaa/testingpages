// ===== COUNTDOWN =====
const TARGET_DATE = '2025-11-01T00:00:00';
const targetTime = new Date(TARGET_DATE).getTime();
const countdownElement = document.getElementById('countdown');

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetTime - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance < 0) {
    clearInterval(countdownInterval);
    countdownElement.innerHTML = "<span style='color: var(--accent);'>🎉 HAPPY ANNIVERSARY! 🎉</span>";
  } else {
    countdownElement.innerHTML = `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
  }
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// ===== SCROLL =====
function scrollToTarget(button){
  const targetId = button.getAttribute('data-target');
  const targetElement = document.querySelector(targetId);
  if(targetElement){
    const headerHeight = document.querySelector('.mem-header').offsetHeight;
    const offset = targetElement.offsetTop - headerHeight - 10; 
    window.scrollTo({top:offset,behavior:'smooth'});
  }
}

// ===== CHAT =====
const demoChat = [
  {side: 'left', text: 'kiw kiw', ts: '16:09'},
  {side: 'right', text: 'tkg paket kah?', ts: '16:10'},
  {side: 'left', text: 'iya mau nganter paket ini', ts: '16:10'},
  {side: 'right', text: 'oalaa', ts: '16:11'},
  {side: 'left', text: 'rumahnya dimana yaa?', ts: '16:12'},
  {side: 'right', text: 'kan jgo sulap, psti tau dong', ts: '16:13'}
];

function populateChat(){
  const chatBody = document.getElementById('chatBody');
  chatBody.innerHTML = '';
  demoChat.forEach(m=>{
    const wrap = document.createElement('div');
    wrap.className = 'bubble ' + (m.side === 'right' ? 'right' : 'left');
    const txt = document.createElement('div');
    txt.className = 'txt';
    txt.textContent = m.text;
    const ts = document.createElement('div');
    ts.className = 'ts';
    ts.textContent = m.ts;
    wrap.appendChild(txt);
    wrap.appendChild(ts);
    chatBody.appendChild(wrap);
  });
  chatBody.scrollTop = chatBody.scrollHeight;
}

window.addEventListener('load', populateChat);
