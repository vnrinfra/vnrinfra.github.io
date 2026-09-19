import { wireStaticContactLinks } from './dom-loader.js';
import { initNav, initStaticReveal } from './nav.js';
import { initLeadForm } from './lead-form.js';
import { initSectionNav } from './section-nav.js';
import { initMarquee } from './marquee.js';
import { initHeroCarousel, initAboutCarousel } from './hero-carousel.js';
import { initEnquiryModal } from './enquiry-modal.js';
import { initWelcomeToast } from './welcome-toast.js';

async function init() {
  initNav();
  initLeadForm();
  initMarquee();
  try { initHeroCarousel(); } catch(e){}
  try { initAboutCarousel(); } catch(e){}
  wireStaticContactLinks();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  // Dispatch chrome:loaded manually since we're not using loadChrome for these landing pages
  document.dispatchEvent(new CustomEvent('chrome:loaded'));

  initStaticReveal();
  try { initSectionNav(); } catch(e){}
  try { initEnquiryModal(); } catch(e){}
  try { initWelcomeToast(); } catch(e){}
}

document.addEventListener('DOMContentLoaded', init);
