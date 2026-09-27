let allBlogs = [];
let currentCategory = 'All';
let searchQuery = '';
let currentPage = 1;
const blogsPerPage = 6;

const grid = document.getElementById('blogs-grid');
const loadMoreBtn = document.getElementById('blog-load-more');
const loadMoreWrap = document.getElementById('load-more-wrap');
const searchInput = document.getElementById('blog-search');
const filterBtns = document.querySelectorAll('.blog-filter-btn');

function renderBlogCard(blog) {
  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <article class="project-card" onclick="window.location.href='blog-detail.html?slug=${blog.slug}'">
      <div class="blog-plot">
        <img src="${blog.image}" alt="${blog.title}" loading="lazy" onerror="this.src='assets/logo.png'">
        <span class="plot-tag">${blog.category}</span>
      </div>
      <div class="project-body">
        <div class="project-card-head">
          <h3 style="font-size: 1.15rem; line-height: 1.3;">${blog.title}</h3>
        </div>
        <p class="project-loc" style="margin-bottom: 0.8em; font-size: 0.8rem;">${formattedDate}</p>
        <p class="project-desc" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px;">${blog.excerpt}</p>
        <div class="card-actions" style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--line);">
          <a href="blog-detail.html?slug=${blog.slug}" class="chip-btn" style="text-decoration: none;">Read More &rarr;</a>
        </div>
      </div>
    </article>
  `;
}

function filterAndSortBlogs() {
  let filtered = allBlogs;

  // Filter by category
  if (currentCategory !== 'All') {
    filtered = filtered.filter(blog => blog.category === currentCategory);
  }

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(blog => 
      blog.title.toLowerCase().includes(q) || 
      blog.excerpt.toLowerCase().includes(q) ||
      blog.category.toLowerCase().includes(q)
    );
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  return filtered;
}

function renderGrid(resetPage = false) {
  if (!grid) return;
  if (resetPage) currentPage = 1;

  const filtered = filterAndSortBlogs();
  const paginated = filtered.slice(0, currentPage * blogsPerPage);

  if (paginated.length === 0) {
    grid.innerHTML = `<p class="blog-empty">No articles found matching your criteria.</p>`;
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
    return;
  }

  grid.innerHTML = paginated.map(renderBlogCard).join('');

  if (loadMoreWrap) {
    if (filtered.length > paginated.length) {
      loadMoreWrap.style.display = 'flex';
    } else {
      loadMoreWrap.style.display = 'none';
    }
  }
}

async function initBlogs() {
  if (!grid) return; // Not on the blogs page

  try {
    const res = await fetch('data/blogs.json');
    if (!res.ok) throw new Error('Failed to load blogs data');
    allBlogs = await res.json();
    renderGrid(true);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="blog-empty">Failed to load articles. Please try again later.</p>`;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderGrid(true);
    });
  }

  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        renderGrid(true);
      });
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderGrid();
    });
  }
}

document.addEventListener('DOMContentLoaded', initBlogs);
