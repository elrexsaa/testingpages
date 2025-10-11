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
const allTracks = document.querySelectorAll('.music-card audio'); 

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


// --- FUNGSI BARU: PELACAKAN PENGGUNA (FRONTEND) ---
function trackEntrance() {
    // ⚠️ PENTING: GANTI URL INI DENGAN WEB APP URL DARI GOOGLE APPS SCRIPT ANDA!
    const TRACKING_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxQ1YbQz7ITmuzer439GennxrAJT-lB9K3M_Sg_yqjK8bauBjm5UJVw1K6w4LBgWAnOSg/exec'; // <--- GANTI DI SINI!!!
    
    const userData = {
        // Data perangkat
        device: navigator.userAgent, 
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        
        // Data Waktu
        timestamp: new Date().toISOString(),
    };

    // Mengambil IP Eksternal (Menggunakan API publik pihak ketiga)
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userData.externalIp = data.ip;
            sendTrackingData(TRACKING_ENDPOINT, userData);
        })
        .catch(e => {
            console.error('Gagal mengambil IP eksternal.');
            userData.externalIp = 'Not Available (Failed to fetch)';
            sendTrackingData(TRACKING_ENDPOINT, userData); 
        });
}

// Fungsi bantu untuk mengirim data ke server
function sendTrackingData(endpoint, data) {
    console.log('Mencoba mengirim data pelacakan:', data); 

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log('Data pelacakan berhasil dikirim!');
        } else {
            console.error('Gagal mengirim data pelacakan. Status:', response.status);
        }
    })
    .catch(error => {
        console.error('Kesalahan jaringan saat mengirim data pelacakan:', error);
    });
}


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
    
    const slideWidth = slides[0].offsetWidth + 20; 
    
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

// --- 2. LOGIKA ANIMASI TEKS INTRO (Tambahkan panggilan trackEntrance) ---
function showNextText() {
  if (textIndex >= introTexts.length) {
    
    // --- AKHIR ANIMASI: SEMBUNYIKAN INTRO SCREEN ---
    setTimeout(() => {
      introScreenOverlay.classList.add('fade-out'); 
      
      setTimeout(() => {
        introScreenOverlay.style.display = 'none'; 
        mainPage.classList.remove('hidden'); 
        document.body.style.overflowY = 'auto'; 
        
        // ✨ PANGGIL FUNGSI PELACAKAN DI SINI ✨
        trackEntrance(); 
        
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
