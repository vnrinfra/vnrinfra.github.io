// The static marquee loop (~two groups) is narrower than a desktop
// viewport, which left an empty band on the right of the strip. Clones
// whole <div class="marquee-group"> blocks in pairs (keeps the count
// even) until the track spans 2x the viewport, so the -50% animation
// loop stays seamless and the strip stays full on any screen width.
function padTrack(track) {
  const template = track.querySelector('.marquee-group');
  if (!template) return;

  const need = document.documentElement.clientWidth * 2;
  let guard = 0;
  while (track.offsetWidth < need && guard < 24) {
    track.appendChild(template.cloneNode(true));
    track.appendChild(template.cloneNode(true));
    guard++;
  }
}

export function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  const run = () => padTrack(track);
  run();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run); // widths change once fonts load
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(run, 150);
  });
}