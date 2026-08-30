import { createCarousel } from './carousel.js';
import { getProject } from './projects.js';

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
        <ul class="modal-list modal-list-grid">${listHtml(project.features)}</ul>
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
        <ul class="modal-list">${listHtml(project.locationHighlights)}</ul>
      </div>`);
  }

  const footer = [project.developer, project.officeAddress]
    .filter(Boolean)
    .map((line) => `<p class="modal-foot">${esc(line)}</p>`)
    .join('');

  return `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pm-title">
      <button type="button" class="modal-close" aria-label="Close details">&times;</button>
      ${mediaHtml(project)}
      <div class="modal-body">
        <p class="eyebrow">${esc(project.location || '')}</p>
        <h3 class="modal-title" id="pm-title">${esc(project.name || '')}</h3>
        ${project.tagline ? `<p class="modal-tagline">${esc(project.tagline)}</p>` : ''}
        ${project.description ? `<p class="modal-desc">${esc(project.description)}</p>` : ''}
        ${project.meta && project.meta.length ? `<dl class="modal-meta">${metaDl(project.meta)}</dl>` : ''}
        ${sections.join('')}
        ${footer}
        <div class="card-actions modal-actions">
          <button type="button" class="chip-btn" data-lead-action="Site Visit" data-lead-project="${esc(project.name)}">Book Site Visit</button>
          <button type="button" class="chip-btn" data-lead-action="Brochure" data-lead-project="${esc(project.name)}">Brochure</button>
          <button type="button" class="chip-btn" data-lead-action="Price Details" data-lead-project="${esc(project.name)}">Get Price</button>
        </div>
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