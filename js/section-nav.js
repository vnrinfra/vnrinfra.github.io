// Right-side section pager: one click scrolls one section up or down.
// Top arrow appears once you leave the hero; bottom arrow disappears at the footer.

const HEADER_OFFSET = 76;
const PROBE_TOLERANCE = 2;

export function initSectionNav() {
  const up = document.querySelector('.pager-up');
  const down = document.querySelector('.pager-down');
  if (!up || !down) return;

  const getTargets = () =>
    Array.from(document.querySelectorAll('.hero, section[id], .site-footer'));

  // Index of the section currently resting under the top read-line.
  // The +2 tolerance absorbs sub-pixel rounding at the exact landing
  // spot (section.top - HEADER_OFFSET) so the pager never deadlocks.
  function locate(targets) {
    const probe = window.scrollY + HEADER_OFFSET + PROBE_TOLERANCE;
    let idx = 0;
    for (let i = 0; i < targets.length; i++) {
      const top = targets[i].getBoundingClientRect().top + window.scrollY;
      if (top <= probe) idx = i;
      else break;
    }
    return idx;
  }

  let ticking = false;

  function refresh() {
    const targets = getTargets();
    if (!targets.length) return;
    const idx = locate(targets);
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    up.classList.toggle('is-hidden', idx <= 0);
    down.classList.toggle('is-hidden', idx >= targets.length - 1 || atBottom);
  }

  function scrollToTarget(target) {
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  up.addEventListener('click', () => {
    const targets = getTargets();
    const idx = locate(targets);
    if (idx > 0) scrollToTarget(targets[idx - 1]);
  });

  down.addEventListener('click', () => {
    const targets = getTargets();
    const idx = locate(targets);
    if (idx < targets.length - 1) scrollToTarget(targets[idx + 1]);
  });

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        refresh();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener('resize', refresh);

  refresh();
}