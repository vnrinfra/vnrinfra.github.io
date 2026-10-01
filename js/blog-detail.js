function renderRelatedCard(blog) {
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

function updateSEO(blog) {
  const seoTitle = blog.seoTitle || `${blog.title} — VNR Infra`;
  document.title = seoTitle;
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = blog.excerpt;
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = seoTitle;
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = blog.excerpt;
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = `https://vnrinfradevelopers.com/${blog.image}`;
  
  const canonical = document.querySelector('link[rel="canonical"]');
  const url = `https://vnrinfradevelopers.com/blog-detail.html?slug=${blog.slug}`;
  if (canonical) canonical.href = url;
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = url;

  // BlogPosting Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": blog.title,
    "description": blog.excerpt,
    "image": `https://vnrinfradevelopers.com/${blog.image}`,
    "author": {
      "@type": "Organization",
      "name": "VNR Infra"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VNR Infra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vnrinfradevelopers.com/favicon.png"
      }
    },
    "datePublished": blog.date,
    "dateModified": blog.date
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

async function initBlogDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const articleEl = document.getElementById('blog-article');
  const ctaSection = document.getElementById('blog-cta');
  const relatedSection = document.getElementById('related-section');
  const relatedGrid = document.getElementById('related-grid');

  if (!slug) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    return;
  }

  try {
    const res = await fetch('data/blogs.json');
    if (!res.ok) throw new Error('Failed to load blogs data');
    const blogs = await res.json();
    
    const blog = blogs.find(b => b.slug === slug);
    
    if (!blog) {
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
      return;
    }

    // Populate article
    document.getElementById('blog-category').textContent = blog.category;
    document.getElementById('blog-date').textContent = new Date(blog.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('blog-title').textContent = blog.title;
    
    const bannerImg = document.getElementById('blog-image');
    bannerImg.src = blog.image;
    bannerImg.alt = blog.title;
    
    document.getElementById('blog-content').innerHTML = blog.content;

    // Show elements
    loadingState.style.display = 'none';
    articleEl.style.display = 'block';
    ctaSection.style.display = 'block';

    updateSEO(blog);

    // Render related articles
    const related = blogs.filter(b => b.id !== blog.id).slice(0, 3);
    if (related.length > 0 && relatedGrid) {
      relatedGrid.innerHTML = related.map(renderRelatedCard).join('');
      relatedSection.style.display = 'block';
    }

  } catch (err) {
    console.error(err);
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', initBlogDetail);
