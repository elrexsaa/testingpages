/* --- MULAI COPY PASTE SELURUHNYA KE FILE animasi.js --- */

// --- INISIASI & SETUP ---
const bg = document.querySelector('.bg-hearts');
const introScreenOverlay = document.querySelector('.intro-screen'); 
const mainPage = document.querySelector('main');

// Seleksi elemen spesifik untuk animasi berurutan
const header = document.querySelector('.mem-header');
const countdownContainer = document.querySelector('.countdown-container');
const menuGrid = document.querySelector('.menu-grid');
const contentSections = document.querySelectorAll('.content-section'); 

// Elemen Audio
const bgm = document.getElementById('bgm');
// FIX: MENGGANTI SELECTOR AGAR SESUAI DENGAN CLASS BARU (music-card)
const allTracks = document.querySelectorAll('.music-card audio'); // <- SUDAH DIPERBAIKI

const introTexts = [
  "our memories website",
  "this is our story",
  "hope u like it"
];

let textIndex = 0;
const introTextElement = document.getElementById('intro-text');
const TEXT_DISPLAY_DURATION = 2500; 
const TEXT_FADE_DURATION = 800;    
const INITIAL_DELAY = 1000; 
const SECTION_DELAY = 800;  


// --- FUNGSIONALITAS AUDIO: SINGLE PLAY ---
function stopAllAudio(currentPlaying) {
    // 1. Stop BGM jika lagu di daftar diputar
    if (currentPlaying !== bgm && !bgm.paused) {
        bgm.pause();
    }

    // 2. Stop semua lagu di daftar jika ada yang lain diputar
    allTracks.forEach(track => {
        if (track !== currentPlaying && !track.paused) {
            track.pause();
            track.currentTime = 0; 
        }
    });

    // 3. Jika yang diputar adalah BGM, stop semua lagu di daftar
    if (currentPlaying === bgm) {
        allTracks.forEach(track => {
            if (!track.paused) {
                track.pause();
                track.currentTime = 0;
            }
        });
    }
}

function setupAudioListeners() {
    // Event listener untuk BGM
    bgm.addEventListener('play', () => stopAllAudio(bgm));
    
    // Event listener untuk setiap lagu di daftar (SUDAH BENAR)
    allTracks.forEach(track => {
        track.addEventListener('play', () => stopAllAudio(track));
    });

    // Autoplay BGM saat ada klik pertama
    document.addEventListener('click', function handler() {
        if (bgm.paused) {
            bgm.play().catch(e => console.log('Autoplay blocked.'));
        }
        document.removeEventListener('click', handler);
    });
}
window.addEventListener('load', setupAudioListeners);


// --- FUNGSIONALITAS CAROUSEL FOTO ---
function initCarousel(carouselTrack) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    let autoSlideTimer;
    let currentIndex = 0;
    
    const slideWidth = slides[0].offsetWidth + 20; // 20 adalah gap
    const TRACK_CENTER_OFFSET = slideWidth;

    function updateActiveSlide() {
        const scrollLeft = carouselTrack.scrollLeft;
        
        const centerIndex = Math.round(scrollLeft / slideWidth); 

        slides.forEach(slide => slide.classList.remove('active'));

        if (slides[centerIndex]) {
            slides[centerIndex].classList.add('active');
            currentIndex = centerIndex;
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        carouselTrack.scroll({
            left: currentIndex * slideWidth,
            behavior: 'smooth'
        });
        setTimeout(updateActiveSlide, 450); 
    }
    
    function startAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlideTimer = setInterval(nextSlide, 5000); 
    }
    
    carouselTrack.addEventListener('scroll', () => {
        updateActiveSlide(); 
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(nextSlide, 5000);
    });

    carouselTrack.scrollLeft = 0;
    setTimeout(() => {
        updateActiveSlide();
        startAutoSlide();
    }, 100); 
}


// --- 1. SETUP HEARTS (kode love random) ---
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
  if (textIndex >= introTexts.length) {
    
    // --- AKHIR ANIMASI: SEMBUNYIKAN INTRO SCREEN ---
    setTimeout(() => {
      introScreenOverlay.classList.add('fade-out'); 
      
      setTimeout(() => {
        introScreenOverlay.style.display = 'none'; 
        mainPage.classList.remove('hidden'); 
        document.body.style.overflowY = 'auto'; 
        
        // --- MEMULAI SEQUENTIAL REVEAL ---
        startMemoryReveal();
      }, 500); 
      
    }, TEXT_DISPLAY_DURATION + TEXT_FADE_DURATION);

    return;
  }

  introTextElement.textContent = introTexts[textIndex];
  introTextElement.classList.add('is-visible');

  setTimeout(() => {
    introTextElement.classList.remove('is-visible'); 
    setTimeout(() => {
      textIndex++;
      showNextText();
    }, TEXT_FADE_DURATION); 
  }, TEXT_DISPLAY_DURATION); 
}


// --- 3. LOGIKA REVEAL SEQUENTIAL (VIDEO EFFECT) ---
function startMemoryReveal() {
    setTimeout(() => {
        header.classList.add('show');
    }, INITIAL_DELAY);

    setTimeout(() => {
        countdownContainer.classList.add('show');
    }, INITIAL_DELAY + SECTION_DELAY);

    setTimeout(() => {
        menuGrid.classList.add('show');
    }, INITIAL_DELAY + SECTION_DELAY * 2);

    // Step 4: Reveal Content Sections satu per satu
    setTimeout(() => {
        contentSections.forEach((section, index) => {
            const delay = SECTION_DELAY * (index + 3);
            setTimeout(() => {
                section.classList.add('show');
                
                if (section.id === 'sectionPhotos') {
                    const carouselTrack = section.querySelector('.carousel-track');
                    if (carouselTrack) {
                        setTimeout(() => initCarousel(carouselTrack), 1300); 
                    }
                }

            }, delay); 
        });
    }, INITIAL_DELAY); 
}


// --- 4. START POINT ---
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
  introScreenOverlay.style.display = 'flex'; 
  showNextText();
});

/* --- AKHIR COPY PASTE SELURUHNYA KE FILE animasi.js --- */
