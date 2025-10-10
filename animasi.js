/* --- MULAI COPY PASTE SELURUHNYA KE FILE animasi.js --- */

// --- INISIASI & SETUP ---
const bg = document.querySelector('.bg-hearts'); 
const introScreenOverlay = document.querySelector('.intro-screen'); 
const mainPage = document.querySelector('main');

// Elemen Audio
const bgm = document.getElementById('bgm');
const allTracks = document.querySelectorAll('.music-card audio'); 

// Elemen Animasi Intro
const introTitle = document.getElementById('intro-title'); 
const introSubtitle1 = document.getElementById('intro-subtitle-1'); 
const introSubtitle2 = document.getElementById('intro-subtitle-2'); 
const introTypingElement = document.getElementById('intro-text-typing');
const permanentGreeting = document.getElementById('greeting');
const GREETING_TEXT = permanentGreeting.textContent;

const TYPING_SPEED = 50; 
const DELAY_TRANSITION = 700; // Waktu untuk fade in/out (0.5s di CSS + buffer)
const FINAL_DELAY = 3500; // 3.5 detik (antara 3 sampai 4)


// --- FUNGSI UTILITY: DELAY ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- SETUP HEARTS (TETAP) ---
for (let i = 0; i < 30; i++) {
  const heart = document.createElement('span');
  heart.innerHTML = '❤';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
  heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
  bg.appendChild(heart);
}


// --- FUNGSIONALITAS AUDIO (TETAP) ---
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


// --- LOGIKA CAROUSEL FOTO (TETAP) ---
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


// --- 1. LOGIKA ANIMASI INTRO (FADE IN/OUT BERGANTIAN) ---
async function startIntroSequence() {
    // 1. Our Memories Website muncul
    introTitle.classList.add('is-visible'); 
    await delay(DELAY_TRANSITION * 2); // Tahan 1.4 detik
    introTitle.classList.remove('is-visible');
    await delay(DELAY_TRANSITION); // Jeda 0.7 detik

    // 2. this is our story muncul dan hilang
    introSubtitle1.classList.add('is-visible');
    await delay(DELAY_TRANSITION * 2); // Tahan 1.4 detik
    introSubtitle1.classList.remove('is-visible');
    await delay(DELAY_TRANSITION); // Jeda 0.7 detik

    // 3. hope u like it muncul dan hilang
    introSubtitle2.classList.add('is-visible');
    await delay(DELAY_TRANSITION * 2); // Tahan 1.4 detik
    introSubtitle2.classList.remove('is-visible');
    await delay(DELAY_TRANSITION); // Jeda 0.7 detik
    
    // 4. Jeda sebelum ketik dimulai
    await delay(1000); 
    
    // 5. Mulai Typing (dengan fungsi baru yang menjamin semua diketik)
    await startTypingEffect();
}

// --- FIX: FUNGSI TYPING BARU (Menggunakan JS Loop) ---
function startTypingEffect() {
    return new Promise(async (resolve) => {
        
        // Setup Awal Typing
        introTypingElement.classList.add('is-visible');
        introTypingElement.classList.add('intro-text-typing-effect');
        introTypingElement.textContent = ""; // Kosongkan dulu
        
        const fullText = GREETING_TEXT; 
        
        for (let i = 0; i < fullText.length; i++) {
            introTypingElement.textContent += fullText.charAt(i);
            await delay(TYPING_SPEED); // Tunggu per karakter
        }

        // Ketikan selesai, hapus kursor
        introTypingElement.classList.remove('intro-text-typing-effect');
        
        // TUNDA FINAL DELAY (3.5 detik)
        await delay(FINAL_DELAY); 

        // FADE OUT INTRO SCREEN
        introScreenOverlay.classList.add('fade-out'); 
        
        await delay(500); // Waktu fade out
            
        introScreenOverlay.style.display = 'none'; 
        mainPage.classList.remove('hidden'); 
        document.body.style.overflowY = 'auto'; 
                
        // MEMULAI REVEAL SERENTAK
        startMemoryReveal();
        resolve();
    });
}


// --- 2. LOGIKA REVEAL SERENTAK (TETAP) ---
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


// --- 3. START POINT (TETAP) ---
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
  introScreenOverlay.style.display = 'flex'; 
  startIntroSequence();
});
/* --- AKHIR COPY PASTE SELURUHNYA KE FILE animasi.js --- */
