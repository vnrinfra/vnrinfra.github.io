import { createCarousel } from './carousel.js';
import { getProject } from './projects.js';
import { CONFIG } from './config.js';

let backdrop = null;
let lastFocus = null;
const activeCarousels = [];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function listHtml(items = []) {
  return items.map((item) => `<li>${esc(item)}</li>`).join('');
}

function metaDl(meta = []) {
  return meta
    .map((m) => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`)
    .join('');
}

function priceHtml(price = []) {
  return price
    .map((p) => `
      <li class="price-item">
        <span>${esc(p.label)}</span>
        <span class="price-now">${esc(p.now)}</span>
        ${p.was ? `<span class="price-was"><s>${esc(p.was)}</s></span>` : ''}
      </li>`)
    .join('');
}

function galleryHtml(project) {
  const images = project.images || [];
  if (images.length < 2) return '';
  const items = images.map((src, i) => `
    <button type="button" class="modal-gallery-item" data-gallery-index="${i}" aria-label="View image ${i + 1}">
      <img src="${esc(CONFIG.cdnBaseUrl + src)}" alt="${esc(project.name)} photo ${i + 1}" loading="lazy" />
    </button>`).join('');
  return `
    <div class="modal-section">
      <h4 class="modal-h">Gallery</h4>
      <div class="modal-gallery">${items}</div>
    </div>`;
}

function flagFor(project) {
  const name = (project.name || '').toLowerCase();
  if (name.includes('anvita')) return 'Landlord share flats available with us';
  if (name.includes('nidhi')) return 'Villa plots and villa constructions are available with us';
  return 'Plots available with us';
}

function mediaHtml(project) {
  const tag = `<span class="plot-tag">${esc(project.statusTag || '')}</span>`;
  const tint = project.tint || '#4B5563';
  return `
    <div class="modal-media" style="--tint:${tint}">
      <div class="carousel-slot" data-project-id="${project.id || ''}"></div>
      ${tag}
    </div>`;
}

function modalHtml(project) {
  const sections = [];
  if (project.approvals && project.approvals.length) {
    sections.push(`
      <div class="modal-section">
        <h4 class="modal-h">Approvals</h4>
        <ul class="modal-list">${listHtml(project.approvals)}</ul>
      </div>`);
  }
  if (project.features && project.features.length) {
    sections.push(`
      <div class="modal-section">
        <h4 class="modal-h">Highlights</h4>
        <ul class="modal-list modal-list-grid modal-list-grid--3">${listHtml(project.features)}</ul>
      </div>`);
  }
  if (project.priceHighlights && project.priceHighlights.length) {
    sections.push(`
      <div class="modal-section">
        <h4 class="modal-h">Price</h4>
        <ul class="price-list">${priceHtml(project.priceHighlights)}</ul>
      </div>`);
  }
  if (project.locationHighlights && project.locationHighlights.length) {
    sections.push(`
      <div class="modal-section">
        <h4 class="modal-h">Location</h4>
        <ul class="modal-list modal-list-grid">${listHtml(project.locationHighlights)}</ul>
      </div>`);
  }

  const footerLines = [project.developer, project.officeAddress].filter(Boolean);
  const footer = footerLines.length
    ? `<p class="modal-foot">${footerLines.map(esc).join('<br/>')}</p>`
    : '';
  const map = project.mapEmbed
    ? `<div class="modal-map"><iframe src="${esc(project.mapEmbed)}" title="${esc(project.name)} \u2014 location map" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`
    : '';

  const galleryImages = (project.images || []).map((src) => CONFIG.cdnBaseUrl + src);

  return `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pm-title">
      <button type="button" class="modal-close" aria-label="Close details">&times;</button>
      ${mediaHtml(project)}
      <span class="modal-flag">${flagFor(project)}</span>
      <div class="modal-body">
        <div class="modal-head">
          <div class="modal-head-text">
            <p class="eyebrow">${esc(project.location || '')}</p>
            <h3 class="modal-title" id="pm-title">${esc(project.name || '')}</h3>
            ${project.tagline ? `<p class="modal-tagline">${esc(project.tagline)}</p>` : ''}
          </div>
          ${project.offer ? `
          <div class="modal-offer modal-offer--${esc(project.offer.variant || 'circle')}${project.offer.tone ? ` modal-offer--${esc(project.offer.tone)}` : ''}" role="img" aria-label="${esc(project.offer.badge || 'Special offer')}">
            ${project.offer.was && project.offer.now
              ? `<span class="modal-offer-was">${esc(project.offer.was)}</span><span class="modal-offer-now">${esc(project.offer.now)}</span>`
              : `<span class="modal-offer-badge">${esc(project.offer.badge || '')}</span>`}
            ${project.offer.label ? `<span class="modal-offer-label">${esc(project.offer.label)}</span>` : ''}
          </div>` : ''}
        </div>
        ${project.description ? `<p class="modal-desc">${esc(project.description)}</p>` : ''}
        ${project.meta && project.meta.length ? `<dl class="modal-meta">${metaDl(project.meta)}</dl>` : ''}
        ${sections.join('')}
        ${galleryHtml(project)}
        ${map}
        ${footer}
        <div class="card-actions modal-actions">
          <button type="button" class="chip-btn" data-lead-action="Site Visit" data-lead-project="${esc(project.name)}">Book Site Visit</button>
          <button type="button" class="chip-btn" data-lead-action="Brochure" data-lead-project="${esc(project.name)}">Brochure</button>
          <button type="button" class="chip-btn" data-lead-action="Price Details" data-lead-project="${esc(project.name)}">Get Price</button>
        </div>
      </div>
      <div class="lightbox" id="modal-lightbox" data-images='${JSON.stringify(galleryImages)}' hidden>
        <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
        <button type="button" class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
        <button type="button" class="lightbox-next" aria-label="Next image">&rsaquo;</button>
        <img class="lightbox-img" src="" alt="" />
      </div>
    </div>`;
}

function ensureModal() {
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'project-modal-root';
    backdrop.setAttribute('role', 'presentation');
    document.body.appendChild(backdrop);
  }
  return backdrop;
}

function openModal(project) {
  const root = ensureModal();
  root.innerHTML = modalHtml(project);
  root.querySelectorAll('.carousel-slot').forEach((slot) => {
    const carousel = createCarousel(project);
    slot.replaceWith(carousel.element);
    activeCarousels.push(carousel);
  });
  root.hidden = false;
  root.setAttribute('aria-hidden', 'false');
  lastFocus = document.activeElement;
  document.body.style.overflow = 'hidden';
  root.querySelector('.modal-close').focus();

  // Lightbox setup
  const lightbox = root.querySelector('#modal-lightbox');
  const lightboxImg = root.querySelector('.lightbox-img');
  const images = JSON.parse(lightbox.dataset.images || '[]');
  let currentIndex = 0;

  function showLightboxImage(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightboxImg.alt = `Photo ${currentIndex + 1} of ${images.length}`;
  }

  root.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.modal-gallery-item');
    if (galleryItem) {
      const idx = parseInt(galleryItem.dataset.galleryIndex, 10);
      showLightboxImage(idx);
      lightbox.hidden = false;
      return;
    }

    if (e.target.closest('.lightbox-close') || e.target === lightbox) {
      lightbox.hidden = true;
      return;
    }

    if (e.target.closest('.lightbox-prev')) {
      showLightboxImage((currentIndex - 1 + images.length) % images.length);
      return;
    }

    if (e.target.closest('.lightbox-next')) {
      showLightboxImage((currentIndex + 1) % images.length);
      return;
    }
  });

  root.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') lightbox.hidden = true;
    if (e.key === 'ArrowLeft') showLightboxImage((currentIndex - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') showLightboxImage((currentIndex + 1) % images.length);
  });
}

function closeModal() {
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeCarousels.forEach((carousel) => carousel.destroy());
  activeCarousels.length = 0;
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

export function initProjectDetail() {
  document.addEventListener('click', (e) => {
    const inModal = e.target.closest('#project-modal-root');
    if (inModal) {
      // CTA buttons inside the modal route into the enquiry form; close
      // the modal first so the lead-form handler (registered later) can
      // scroll to #contact.
      if (e.target.closest('[data-lead-action]')) closeModal();
      else if (e.target.closest('.modal-close') || e.target === backdrop) closeModal();
      return;
    }

    // Chip buttons on cards are CTAs — let lead-form handle them.
    if (e.target.closest('[data-lead-action]')) return;

    const card = e.target.closest('.project-card');
    if (!card) return;
    const id = card.dataset.projectId;
    if (id) {
      const project = getProject(id);
      if (project) openModal(project);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}