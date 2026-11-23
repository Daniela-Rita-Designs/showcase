/* ============================================================
   Cattery vom Eifeldom — interactions
   1) German / English language toggle
   2) Mobile navigation
   ============================================================ */

// ---------- Language toggle ----------
const STORE_KEY = 'cve-lang';

function setLanguage(lang){
  document.documentElement.lang = lang;

  // swap every element that carries data-de / data-en
  document.querySelectorAll('[data-de]').forEach(el => {
    const val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-de');
    if (val !== null) el.innerHTML = val;
  });

  // update the DE / EN pill state
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
}

const langToggle = document.getElementById('langToggle');
if (langToggle){
  langToggle.addEventListener('click', () => {
    const current = document.documentElement.lang === 'en' ? 'en' : 'de';
    setLanguage(current === 'en' ? 'de' : 'en');
  });
}

// restore saved language on load (default: German)
let saved = 'de';
try { saved = localStorage.getItem(STORE_KEY) || 'de'; } catch (e) {}
if (saved === 'en') setLanguage('en');

// ---------- Mobile navigation ----------
const burger = document.getElementById('navBurger');
const nav = document.getElementById('mainNav');
if (burger && nav){
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
}

// ---------- Lightbox (cat galleries) ----------
const lightbox = (() => {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lightbox-close" aria-label="Schließen">✕</button>
    <button class="lightbox-prev" aria-label="Vorheriges Bild">‹</button>
    <img alt="" />
    <button class="lightbox-next" aria-label="Nächstes Bild">›</button>
    <div class="lightbox-caption"><span class="lb-name"></span><span class="lb-count"></span></div>`;
  document.body.appendChild(box);

  const img   = box.querySelector('img');
  const name  = box.querySelector('.lb-name');
  const count = box.querySelector('.lb-count');
  let pics = [], idx = 0, caption = '';

  function render(){
    img.src = pics[idx];
    name.textContent = caption;
    count.textContent = pics.length > 1 ? (idx + 1) + ' / ' + pics.length : '';
    box.classList.toggle('single', pics.length < 2);
  }
  function open(list, start, cap){
    pics = list; idx = start || 0; caption = cap || '';
    render();
    box.classList.add('show');
  }
  const close = () => box.classList.remove('show');
  const step  = d => { idx = (idx + d + pics.length) % pics.length; render(); };

  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
  box.querySelector('.lightbox-next').addEventListener('click', () => step(1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  return { open };
})();

// cards with data-gallery="a.jpg|b.jpg|…" open that cat's gallery
document.querySelectorAll('[data-gallery]').forEach(el => {
  const openGallery = () => lightbox.open(el.dataset.gallery.split('|'), 0, el.dataset.cat || '');
  el.addEventListener('click', openGallery);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGallery(); } });
});

// images inside a .gallery grid browse the whole grid as a set
document.querySelectorAll('.gallery').forEach(grid => {
  const imgs = [...grid.querySelectorAll('img')];
  imgs.forEach((im, i) => {
    im.style.cursor = 'var(--cur) 2 2, pointer';
    im.addEventListener('click', () => lightbox.open(imgs.map(x => x.src), i, ''));
  });
});
