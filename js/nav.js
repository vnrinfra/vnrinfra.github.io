// Event delegation throughout — the header (with #nav-toggle) is
// injected after this script runs, so we can't grab the element
// directly at load time.

export function initNav() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('#nav-toggle');
      if (toggle) {
        const nav = document.getElementById('main-nav');
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        return;
      }
  
      // Close the mobile menu after any nav link is tapped.
      const navLink = e.target.closest('#main-nav a');
      if (navLink) {
        const nav = document.getElementById('main-nav');
        const toggleBtn = document.getElementById('nav-toggle');
        nav.classList.remove('open');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  function observeReveal(elements) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
  
  // Static sections are ready at load time.
  export function initStaticReveal() {
    observeReveal(document.querySelectorAll(
      '.section-head, .why-item, .process-list li, .service-item, .market-item, .md-block, .md-photo, .vmv-block, .value-grid li, .md-quote, .past-item'
    ));
  }
  
  // Project cards only exist once projects.json has rendered.
  export function initProjectReveal() {
    observeReveal(document.querySelectorAll('.project-card'));
  }