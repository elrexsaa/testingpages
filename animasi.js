/* --- MULAI COPY PASTE SELURUHNYA KE FILE animasi.js --- */

// --- INISIASI & SETUP ---
const bg = document.querySelector('.bg-hearts'); 
const introScreenOverlay = document.querySelector('.intro-screen'); 
const mainPage = document.querySelector('main');

// Elemen Audio
const bgm = document.getElementById('bgm');
const allTracks = document.querySelectorAll('.music-card audio'); 

// Elemen Animasi Intro
const introTitle = document.getElementById('intro-title'); // Our Memories Website
const introSubtitle1 = document.getElementById('intro-subtitle-1'); // this is our story
const introSubtitle2 = document.getElementById('intro-subtitle-2'); // hope u like it
const introTypingElement = document.getElementById('intro-text-typing');
const permanentGreeting = document.getElementById('greeting');
const GREETING_TEXT = permanentGreeting.textContent;

const TYPING_SPEED = 50; 
const DELAY_BETWEEN_SUBTITLES = 500; // 0.5 detik antar subtitle
const DELAY_BEFORE_TYPING = 1000; // 1 detik setelah subtitle terakhir
const FINAL_DELAY = 3500; // 3.5 detik (antara 3 sampai 4)


// --- 1. SETUP HEARTS ---
for (let i = 0; i < 30; i++) {
  const heart = document.createElement('span');
  heart.innerHTML = '❤';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
  heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
  bg.appendChild(heart);
}


// --- FUNGSIONALITAS AUDIO: SINGLE PLAY (TETAP SAMA) ---
function stopAllAudio(currentPlaying) {
    if (currentPlaying !== bgm && !bgm.paused) { bgm.pause(); }
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


// --- LOGIKA CAROUSEL FOTO INFINITE LOOP (TETAP SAMA) ---
function initCarousel(carouselTrack) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    const cloneCount = 3; 
    for (let i = 0; i < cloneCount; i++) {
        const clone = slides[i].cloneNode(true);
        clone.classList.remove('active');
        carouselTrack.appendChild(clone);
    }

    const allSlides = carouselTrack.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    const slideWidth = allSlides[0].offsetWidth + 15; 

    function updateActiveSlide() {
        const scrollLeft = carouselTrack.scrollLeft;
        const centerIndex = Math.round(scrollLeft / slideWidth); 

        allSlides.forEach(slide => slide.classList.remove('active'));

        if (allSlides[centerIndex]) {
            allSlides[centerIndex].classList.add('active');
            currentIndex = centerIndex;

            if (currentIndex >= slides.length) {
                setTimeout(() => {
                    carouselTrack.scrollLeft = 0;
                    currentIndex = 0;
                    allSlides.forEach(slide => slide.classList.remove('active'));
                    allSlides[0].classList.add('active');
                }, 400); 
            }
        }
    }
    
    let autoSlideTimer;
    function startAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlideTimer = setInterval(() => {
            const nextScroll = (currentIndex + 1) * slideWidth;
            carouselTrack.scroll({
                left: nextScroll,
                behavior: 'smooth'
            });
        }, 3500); 
    }

    carouselTrack.addEventListener('scroll', updateActiveSlide);
    carouselTrack.scrollLeft = 0;
    setTimeout(() => {
        updateActiveSlide();
        startAutoSlide();
    }, 100); 
}


// --- 1. LOGIKA ANIMASI INTRO (Alur yang diminta) ---
function startIntroSequence() {
    // 1. Our Memories Website muncul
    introTitle.classList.add('is-visible'); 
    
    // 2. this is our story muncul
    setTimeout(() => {
        introSubtitle1.classList.add('is-visible');
    }, 500); // 0.5 detik

    // 3. hope u like it muncul
    setTimeout(() => {
        introSubtitle2.classList.add('is-visible');

        // 4. Jeda sebelum ketik dimulai
        setTimeout(() => {
            startTypingEffect();
        }, DELAY_BEFORE_TYPING); // 1 detik jeda

    }, 1000); // 1 detik (0.5 detik setelah subtitle 1)
}

function startTypingEffect() {
    // 5. Mulai Ketik: "hi, my beloved..."
    introTypingElement.textContent = GREETING_TEXT; 
    introTypingElement.classList.add('is-visible');
    introTypingElement.classList.add('intro-text-typing-effect');

    // Hitung durasi typing
    const typingDuration = GREETING_TEXT.length * TYPING_SPEED + 1000;

    setTimeout(() => {
        // 6. Ketikan selesai, hapus kursor
        introTypingElement.classList.remove('intro-text-typing-effect');
        
        // 7. Jeda 3.5 detik (3-4 detik yang diminta)
        setTimeout(() => {
            // FADE OUT INTRO SCREEN
            introScreenOverlay.classList.add('fade-out'); 
            
            setTimeout(() => {
                introScreenOverlay.style.display = 'none'; 
                mainPage.classList.remove('hidden'); 
                document.body.style.overflowY = 'auto'; 
                
                // 8. MEMULAI REVEAL SERENTAK
                startMemoryReveal();
            }, 500); // Waktu fade out
            
        }, FINAL_DELAY); 

    }, typingDuration);
}


// --- 2. LOGIKA REVEAL SERENTAK (FADE IN) (TETAP SAMA) ---
function startMemoryReveal() {
    const allRevealSections = document.querySelectorAll('.reveal-section');
    
    allRevealSections.forEach(section => {
        section.classList.add('show');
    });

    const carouselTrack = document.querySelector('#sectionPhotos .carousel-track');
    if (carouselTrack) {
        setTimeout(() => initCarousel(carouselTrack), 1000); 
    }
}


// --- 3. START POINT ---
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
  introScreenOverlay.style.display = 'flex'; 
  startIntroSequence();
});
/* --- AKHIR COPY PASTE SELURUHNYA KE FILE animasi.js --- */
