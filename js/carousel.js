import { CONFIG } from './config.js';

const INTERVAL = 3200;
const registry = new Set();

// Pause every carousel when the tab is hidden; resume when visible.
document.addEventListener('visibilitychange', () => {
  const paused = document.hidden;
  registry.forEach((carousel) => (paused ? carousel.stop() : carousel.start()));
});

export function createCarousel(project) {
  const imagePaths = Array.isArray(project.images)
    ? project.images
    : project.image
      ? [project.image]
      : [];
  const count = imagePaths.length;

  const root = document.createElement('div');
  root.className = 'carousel';
  root.setAttribute('aria-label', `${project.name || 'Project'} images`);

  const track = document.createElement('div');
  track.className = 'carousel-track';

  const dotsWrap = count > 1 ? document.createElement('div') : null;
  if (dotsWrap) dotsWrap.className = 'carousel-dots';
  const dotRefs = [];

  let index = 0;
  let timer = null;
  let remaining = count;
  const failed = new Array(count).fill(false);

  function update() {
    track.querySelectorAll('.carousel-slide').forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    }
  }

  function next() {
    if (remaining <= 1 || count <= 1) return;
    let steps = 0;
    do {
      index = (index + 1) % count;
      steps++;
    } while (failed[index] && steps < count);
    update();
  }

  function goTo(i) {
    index = ((i % count) + count) % count;
    update();
  }

  function start() {
    if (count > 1 && remaining > 1 && !timer) timer = setInterval(next, INTERVAL);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  imagePaths.forEach((path, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide' + (i === 0 ? ' is-active' : '');

    const img = document.createElement('img');
    img.src = CONFIG.cdnBaseUrl + path;
    img.alt = project.name || 'Project image';
    img.loading = 'lazy';
    img.onerror = () => {
      failed[i] = true;
      remaining--;
      img.remove();
      const dot = dotRefs[i];
      if (dot) dot.remove();
      if (dotsWrap && !dotsWrap.children.length) dotsWrap.remove();
      if (remaining <= 1) stop();
    };

    slide.appendChild(img);
    track.appendChild(slide);
  });

  root.appendChild(track);

  if (dotsWrap) {
    imagePaths.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Show image ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotRefs.push(dot);
      dotsWrap.appendChild(dot);
    });
    root.appendChild(dotsWrap);
  }

  const controller = {
    element: root,
    start,
    stop,
    destroy() {
      stop();
      registry.delete(controller);
      root.removeEventListener('mouseenter', stop);
      root.removeEventListener('mouseleave', start);
      root.remove();
    },
  };

  registry.add(controller);
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  start();

  return controller;
}