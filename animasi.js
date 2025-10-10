/* --- MULAI COPY PASTE SELURUHNYA KE FILE animasi.js --- */

// --- INISIASI & SETUP ---
const bg = document.querySelector('.bg-hearts');

// FIX: Memastikan kita memilih kontainer overlay utama
// .intro-screen adalah CLASS dari div yang menutupi halaman
const introScreenOverlay = document.querySelector('.intro-screen'); 
const mainPage = document.querySelector('main');
const sections = document.querySelectorAll('main > *');

const introTexts = [
  "our memories website",
  "this is our story",
  "hope u like it"
];

let textIndex = 0;
const introTextElement = document.getElementById('intro-text');
const TEXT_DISPLAY_DURATION = 2500; // Waktu tampil per teks (2.5 detik)
const TEXT_FADE_DURATION = 800;    // Waktu fade in/out (0.8 detik)


// --- 1. SETUP HEARTS (kode love random) ---
// Kode ini memastikan background hearts tetap berjalan di latar belakang
for (let i = 0; i < 30; i++) {
  const heart = document.createElement('span');
  heart.innerHTML = '❤';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
  heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
  bg.appendChild(heart);
}

// --- 2. LOGIKA ANIMASI TEKS INTRO (FADE IN/OUT LOOP) ---
function showNextText() {
  // Jika semua teks sudah tampil, hentikan loop dan sembunyikan intro
  if (textIndex >= introTexts.length) {
    
    // --- AKHIR ANIMASI: SEMBUNYIKAN INTRO SCREEN ---
    setTimeout(() => {
      // 1. Mulai FADE OUT overlay utama
      introScreenOverlay.classList.add('fade-out'); 
      
      // 2. Tunggu transisi fade out selesai (0.5s dari style.css)
      setTimeout(() => {
        introScreenOverlay.style.display = 'none'; // Sembunyikan kontainer overlay
        
        // 3. Tampilkan main content
        // mainPage awalnya punya class "hidden", ini akan menghapusnya
        mainPage.classList.remove('hidden'); 
        
        document.body.style.overflowY = 'auto'; // Aktifkan scroll
        
        // 4. Mulai animasi reveal sections (memunculkan objek di kenangan.html)
        revealSections();
      }, 500); 
    }, TEXT_DISPLAY_DURATION + TEXT_FADE_DURATION); // Jeda total sebelum intro menghilang

    return;
  }

  // Tampilkan teks saat ini
  introTextElement.textContent = introTexts[textIndex];
  
  // FADE IN
  introTextElement.classList.add('is-visible');

  // Jadwalkan FADE OUT setelah waktu tampil
  setTimeout(() => {
    introTextElement.classList.remove('is-visible'); // Teks mulai hilang

    // Tunggu FADE OUT selesai, baru panggil teks berikutnya
    setTimeout(() => {
      textIndex++;
      showNextText();
    }, TEXT_FADE_DURATION); // Durasi tunggu FADE OUT
    
  }, TEXT_DISPLAY_DURATION); // Durasi tampil teks
}

// --- 3. LOGIKA REVEAL SECTION ---
function revealSections() {
  sections.forEach(s => s.classList.add('reveal-section'));

  let i = 0;
  const showNext = () => {
    if (i < sections.length) {
      sections[i].classList.add('show');
      i++;
      setTimeout(showNext, 1200); // Jeda antar section
    }
  };
  showNext();
}


// --- 4. START POINT ---
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
  introScreenOverlay.style.display = 'flex'; // Pastikan intro terlihat saat start
  
  // Mulai animasi teks
  showNextText();
});

/* --- AKHIR COPY PASTE KE FILE animasi.js --- */
