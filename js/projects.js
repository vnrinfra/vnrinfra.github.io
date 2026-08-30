import { CONFIG } from './config.js';
import { createCarousel } from './carousel.js';

const projectsById = new Map();

function metaListHtml(meta = []) {
  return meta
    .map(m => `<li><span>${m.label}</span>${m.value}</li>`)
    .join('');
}

function cardActionsHtml(project) {
  return `
    <div class="card-actions">
      <button type="button" class="chip-btn" data-lead-action="Site Visit" data-lead-project="${project.name}">Book Site Visit</button>
      <button type="button" class="chip-btn" data-lead-action="Brochure" data-lead-project="${project.name}">Brochure</button>
      <button type="button" class="chip-btn" data-lead-action="Price Details" data-lead-project="${project.name}">Get Price</button>
    </div>`;
}

// Builds the media block. The carousel is injected into the slot after
// the grid renders (it needs live DOM, not a string). The wrapper keeps
// the tint/pattern as a fallback behind every slide.
function mediaBlockHtml(project) {
  const tag = `<span class="plot-tag">${project.statusTag || ''}</span>`;
  return `
    <div class="project-plot" style="--tint:${project.tint || '#4B5563'}">
      <div class="carousel-slot" data-project-id="${project.id || ''}"></div>
      ${tag}
    </div>`;
}

function projectCardHtml(project) {
  return `
    <article class="project-card" data-project-id="${project.id || ''}">
      ${mediaBlockHtml(project)}
      <div class="project-body">
        <h3>${project.name}</h3>
        <p class="project-loc">${project.location}</p>
        <p class="project-desc">${project.description}</p>
        <ul class="project-meta">${metaListHtml(project.meta)}</ul>
        ${cardActionsHtml(project)}
      </div>
    </article>`;
}

export async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res = await fetch(CONFIG.projectsDataUrl);
    if (!res.ok) throw new Error(`${CONFIG.projectsDataUrl} responded ${res.status}`);
    const projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = `<p class="projects-empty">No projects listed yet — check back soon.</p>`;
      return;
    }

    projectsById.clear();
    projects.forEach((project) => projectsById.set(project.id, project));

    grid.innerHTML = projects.map(projectCardHtml).join('');

    grid.querySelectorAll('.carousel-slot').forEach((slot) => {
      const project = projectsById.get(slot.dataset.projectId);
      if (!project) return;
      slot.replaceWith(createCarousel(project).element);
    });
  } catch (err) {
    console.error('Failed to load projects:', err);
    grid.innerHTML = `<p class="projects-empty">Couldn't load projects right now. Please refresh, or contact us directly.</p>`;
  } finally {
    document.dispatchEvent(new CustomEvent('projects:loaded'));
  }
}

export function getProject(id) {
  return projectsById.get(id);
}