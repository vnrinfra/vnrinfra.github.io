import { createCarousel, CAROUSEL_INTERVAL } from './carousel.js';

const HERO_IMAGES = [
  'projects/nidhi-avenue/hero.jpg',
  'projects/nidhi-avenue/gateway.jpg',
  'projects/nidhi-avenue/plot-layout.jpg',
  'projects/nidhi-avenue/roads-drainage.jpg',
];

export function initHeroCarousel() {
  const box = document.querySelector('.hero-carousel-box');
  if (!box) return;

  const counter = document.createElement('span');
  counter.className = 'hero-counter';

  const bar = document.createElement('span');
  bar.className = 'hero-bar';
  const fill = document.createElement('span');
  fill.className = 'hero-bar-fill';
  bar.appendChild(fill);

  const carousel = createCarousel(
    { name: 'Nidhi Avenue', images: HERO_IMAGES },
    {
      onChange: (index, count) => {
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
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

  const caption = document.createElement('div');
  caption.className = 'hero-caption';
  const name = document.createElement('span');
  name.className = 'hero-caption-name';
  name.textContent = 'Nidhi Avenue';
  const where = document.createElement('span');
  where.className = 'hero-caption-where';
  where.textContent = 'Alair · Warangal Highway';
  caption.appendChild(name);
  caption.appendChild(where);

  box.appendChild(caption);
  box.appendChild(counter);
  box.appendChild(bar);

  box.addEventListener('mouseenter', () => { fill.style.animationPlayState = 'paused'; });
  box.addEventListener('mouseleave', () => { fill.style.animationPlayState = 'running'; });
}