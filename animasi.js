// bikin love random di bg
const bg = document.querySelector('.bg-hearts');
for (let i = 0; i < 30; i++) {
  const heart = document.createElement('span');
  heart.innerHTML = '❤';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
  heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
  bg.appendChild(heart);
}

const intro = document.getElementById('intro');
const mainPage = document.querySelector('main');
const sections = document.querySelectorAll('main > *');

window.addEventListener('load', () => {
  // disable scroll pas intro
  document.body.style.overflow = 'auto';

  // fade out intro
  setTimeout(() => {
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.style.display = 'none';
      mainPage.classList.remove('hidden');

      // sembunyiin semua section dulu
      sections.forEach(s => s.classList.add('reveal-section'));

      // animasi muncul satu per satu
      let i = 0;
      const showNext = () => {
        if (i < sections.length) {
          sections[i].classList.add('show');
          i++;
          setTimeout(showNext, 1800);
        } else {
          // enable scroll abis semua muncul
          document.body.style.overflowY = 'auto';
        }
      };
      showNext();

    }, 600);
  }, 2500);
});
// animasi intro text
const texts = [
  "our memories website",
  "this is our story",
  "hope u like it"
];

let index = 0;
const introEl = document.getElementById('intro-text');

function showNextText() {
  introEl.classList.remove('fade-in');
  void introEl.offsetWidth;
  introEl.classList.add('fade-in');
  introEl.textContent = texts[index];

  setTimeout(() => {
    introEl.classList.remove('fade-in');
    index++;
    if (index < texts.length) {
      setTimeout(showNextText, 1000);
    }
  }, 3000);
}

showNextText();
