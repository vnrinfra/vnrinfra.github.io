import { loadChrome, wireStaticContactLinks } from './dom-loader.js';
import { loadProjects } from './projects.js';
import { initNav, initStaticReveal, initProjectReveal } from './nav.js';
import { initLeadForm } from './lead-form.js';

async function init() {
  initNav();          // event-delegated, safe before header exists
  initLeadForm();      // event-delegated, safe before cards exist
  wireStaticContactLinks();

  await loadChrome();   // header + footer
  initStaticReveal();

  await loadProjects(); // project cards
  initProjectReveal();
}

document.addEventListener('DOMContentLoaded', init);