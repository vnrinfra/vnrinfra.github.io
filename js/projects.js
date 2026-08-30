import { CONFIG } from './config.js';

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

// Builds the image/tint block. If the project has an image path, we
// try to load it from the CDN; onerror swaps back to the plain tint
// block so a missing/not-yet-uploaded image never breaks the layout.
function mediaBlockHtml(project) {
  const tag = `<span class="plot-tag">${project.statusTag || ''}</span>`;
  if (!project.image) {
    return `<div class="project-plot" style="--tint:${project.tint || '#4B5563'}">${tag}</div>`;
  }
  const src = CONFIG.cdnBaseUrl + project.image;
  return `
    <div class="project-plot project-plot-img" style="--tint:${project.tint || '#4B5563'}">
      <img
        src="${src}"
        alt="${project.name}"
        loading="lazy"
        onerror="this.closest('.project-plot').classList.add('img-failed'); this.remove();"
      >
      ${tag}
    </div>`;
}

function projectCardHtml(project) {
  return `
    <article class="project-card">
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

    grid.innerHTML = projects.map(projectCardHtml).join('');
  } catch (err) {
    console.error('Failed to load projects:', err);
    grid.innerHTML = `<p class="projects-empty">Couldn't load projects right now. Please refresh, or contact us directly.</p>`;
  } finally {
    document.dispatchEvent(new CustomEvent('projects:loaded'));
  }
}