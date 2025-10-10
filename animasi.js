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
const allTracks = document.querySelectorAll('.track audio'); // Semua lagu di dalam section

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
    if (currentPlaying !== bgm && !bgm.paused) {
        bgm.pause();
    }

    allTracks.forEach(track => {
        if (track !== currentPlaying && !track.paused) {
            track.pause();
            track.currentTime = 0; 
        }
    });

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
    bgm.addEventListener('play', () => stopAllAudio(bgm));
    
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
    
    // Hitung lebar slide (80% lebar track + gap 16px)
    const slideWidth = slides[0].offsetWidth + 16; 
    const TRACK_CENTER_OFFSET = slideWidth;

    // Fungsi untuk mengupdate slide aktif
    function updateActiveSlide() {
        const scrollLeft = carouselTrack.scrollLeft;
        
        // Perhitungan indeks slide yang paling dekat ke tengah container
        // Dibulatkan untuk mendapatkan slide yang paling dominan di tengah
        const centerIndex = Math.round(scrollLeft / slideWidth); 

        slides.forEach(slide => slide.classList.remove('active'));

        if (slides[centerIndex]) {
            slides[centerIndex].classList.add('active');
            currentIndex = centerIndex;
        }
    }

    // Fungsi untuk slide berikutnya (digunakan oleh auto-slide)
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        carouselTrack.scroll({
            left: currentIndex * slideWidth,
            behavior: 'smooth'
        });
        // Tunggu scroll selesai sebelum update active state
        setTimeout(updateActiveSlide, 450); 
    }
    
    // Fungsi untuk memulai auto-slide (5 detik)
    function startAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlideTimer = setInterval(nextSlide, 5000); 
    }
    
    // Event listener untuk interaksi pengguna (menggeser)
    carouselTrack.addEventListener('scroll', () => {
        updateActiveSlide(); 
        // Reset timer saat user berinteraksi
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(nextSlide, 5000);
    });

    // Inisiasi awal
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
                
                // PANGGIL CAROUSEL FOTO setelah section-nya muncul
                if (section.id === 'sectionPhotos') {
                    const carouselTrack = section.querySelector('.carousel-track');
                    if (carouselTrack) {
                        // Tunggu transisi reveal selesai (1.3s)
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
