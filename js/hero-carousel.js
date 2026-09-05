import { createCarousel, CAROUSEL_INTERVAL } from './carousel.js';

// Hero imagery — independent from project cards. Add your own slide paths
// here (relative to the assets-branch CDN) and the hero rotates them.
// Keep HERO_SLIDES[ i ].name / .where in sync for the caption chip.
const HERO_IMAGES = [
  'assets/hero/hero_1.jpeg',
  'assets/hero/hero_2.jpeg',
  'assets/hero/hero_3.jpg',
  'assets/hero/hero_4.jpg'
];
const HERO_SLIDES = [
  { name: 'VNR Infra office entrance', where: 'Capital park, Hi-Tech city' },
  { name: 'VNR Infra office setup', where: 'HMDA & RERA approved layouts' },
  { name: 'VNR Infra', where: 'Anvita high 9 (current project)' },
  { name: 'VNR Infra', where: 'Nidhi Avenue (current project)' },
];

export function initHeroCarousel() {
  const box = document.querySelector('.hero-carousel-box');
  if (!box) return;

  // Layered behind the (possibly-empty) carousel track: this shows through
  // whenever no hero image has loaded yet, so the box never looks broken.
  const ph = document.createElement('div');
  ph.className = 'hero-placeholder';
  ph.innerHTML =
    '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 15l4-4 3 3 4-4 3 3"/><circle cx="9" cy="9" r="1"/></svg>' +
    '<span class="hero-placeholder-note">Hero imagery coming soon</span>';
  box.appendChild(ph);

  if (!HERO_IMAGES.length) return;

  const counter = document.createElement('span');
  counter.className = 'hero-counter';
  counter.hidden = true;

  const bar = document.createElement('span');
  bar.className = 'hero-bar';
  bar.hidden = true;
  const fill = document.createElement('span');
  fill.className = 'hero-bar-fill';
  bar.appendChild(fill);

  const caption = document.createElement('div');
  caption.className = 'hero-caption';
  caption.hidden = true;
  const nameEl = document.createElement('span');
  nameEl.className = 'hero-caption-name';
  const whereEl = document.createElement('span');
  whereEl.className = 'hero-caption-where';
  caption.appendChild(nameEl);
  caption.appendChild(whereEl);

  const carousel = createCarousel(
    { name: 'VNR Infra', images: HERO_IMAGES },
    {
      onChange: (index, count) => {
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
        const slide = HERO_SLIDES[index] || {};
        nameEl.textContent = slide.name || '';
        whereEl.textContent = slide.where || '';
        if (count <= 1) {
          fill.style.animation = 'none';
          fill.style.width = '100%';
        } else {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = `hero-fill ${CAROUSEL_INTERVAL}ms linear forwards`;
        }
      },
    }
  );

  box.appendChild(carousel.element);
  box.appendChild(caption);
  box.appendChild(counter);
  box.appendChild(bar);

  // Once at least one real hero image has loaded, drop the branded
  // placeholder and reveal the caption/counter/progress bar.
  const reveal = () => {
    ph.remove();
    caption.hidden = false;
    counter.hidden = false;
    bar.hidden = false;
  };
  const imgs = carousel.element.querySelectorAll('.carousel-slide img');
  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth) reveal();
    else img.addEventListener('load', reveal, { once: true });
  });

  box.addEventListener('mouseenter', () => { fill.style.animationPlayState = 'paused'; });
  box.addEventListener('mouseleave', () => { fill.style.animationPlayState = 'running'; });
}

// About-section carousel. Add slide paths to ABOUT_IMAGES to activate real
// imagery; until then it renders a branded placeholder, so there's nothing to
// fix if the assets branch / CDN images aren't ready yet.
const ABOUT_IMAGES = [
  "assets/about/company_1.jpg",
];
const ABOUT_SLIDES = [
  { image: '', name: 'visiting card', where: 'Hyderabad, telangana' },
];

export function initAboutCarousel() {
  const box = document.querySelector('.about-carousel');
  if (!box) return;

  if (!ABOUT_IMAGES.length) {
    const ph = document.createElement('div');
    ph.className = 'about-placeholder';
    ph.innerHTML =
      '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 15l4-4 3 3 4-4 3 3"/><circle cx="9" cy="9" r="1"/></svg>' +
      '<span class="about-placeholder-note">Company imagery coming soon</span>';
    box.appendChild(ph);
    return;
  }

  const counter = document.createElement('span');
  counter.className = 'about-counter';
  const bar = document.createElement('span');
  bar.className = 'about-bar';
  const fill = document.createElement('span');
  fill.className = 'about-bar-fill';
  bar.appendChild(fill);

  const caption = document.createElement('div');
  caption.className = 'about-caption';
  const nameEl = document.createElement('span');
  nameEl.className = 'about-caption-name';
  const whereEl = document.createElement('span');
  whereEl.className = 'about-caption-where';
  caption.appendChild(nameEl);
  caption.appendChild(whereEl);

  const carousel = createCarousel(
    { name: 'About VNR Infra', images: ABOUT_IMAGES },
    {
      onChange: (index, count) => {
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
        const slide = ABOUT_SLIDES[index] || {};
        nameEl.textContent = slide.name || '';
        whereEl.textContent = slide.where || '';
        if (count <= 1) {
          fill.style.animation = 'none';
          fill.style.width = '100%';
        } else {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = `about-fill ${CAROUSEL_INTERVAL}ms linear forwards`;
        }
      },
    }
  );
  box.appendChild(carousel.element);

  box.appendChild(caption);
  box.appendChild(counter);
  box.appendChild(bar);

  box.addEventListener('mouseenter', () => { fill.style.animationPlayState = 'paused'; });
  box.addEventListener('mouseleave', () => { fill.style.animationPlayState = 'running'; });
}