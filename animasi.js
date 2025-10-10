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

// urutan section
const sections = document.querySelectorAll('main > *');
const main = document.querySelector('main');

window.onload = () => {
  // delay intro
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    main.classList.remove('hidden');

    // sembunyiin semua section dulu
    sections.forEach(s => {
      s.classList.add('reveal-section');
    });

    let i = 0;
    const showNext = () => {
      if (i < sections.length) {
        sections[i].classList.add('show');
        i++;
        setTimeout(showNext, 1800);
      } else {
        // setelah semua muncul, enable scroll
        document.body.style.overflowY = 'auto';
      }
    };

    // disable scroll dulu waktu intro
    document.body.style.overflow = 'hidden';
    showNext();
  }, 3000);
};
