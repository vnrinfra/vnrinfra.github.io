import { loadChrome, wireStaticContactLinks } from './dom-loader.js';
import { loadProjects } from './projects.js';
import { initNav, initStaticReveal, initProjectReveal } from './nav.js';
import { initLeadForm } from './lead-form.js';
import { initProjectDetail } from './project-detail.js';
import { initSectionNav } from './section-nav.js';
import { initMarquee } from './marquee.js';
import { initHeroCarousel, initAboutCarousel } from './hero-carousel.js';

async function init() {
  initNav();          // event-delegated, safe before header exists
  initProjectDetail(); // registered before lead-form so modal CTAs close first
  initLeadForm();      // event-delegated, safe before cards exist
  initMarquee();       // fill the marquee strip across desktop widths
  initHeroCarousel();  // right-side hero slides (auto-advancing)
  initAboutCarousel(); // about-section imagery (placeholder until images added)
  wireStaticContactLinks();

  await loadChrome();   // header + footer
  initStaticReveal();
  initSectionNav();     // header offset known; footer target present

  await loadProjects(); // project cards
  initProjectReveal();
}

document.addEventListener('DOMContentLoaded', init);