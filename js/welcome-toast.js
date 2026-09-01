import { CONFIG } from './config.js';

// Small bottom-right welcome card. Shows once per page load after a short
// delay; dismissible via the close button.
const DEFAULTS = {
  showDelay: 2500,       // ms after load before the toast appears
  heading: 'Welcome to VNR Infra Developers',
};

function buildToast(options) {
  const toast = document.createElement('div');
  toast.className = 'welcome-toast';
  toast.setAttribute('role', 'dialog');
  toast.setAttribute('aria-live', 'polite');
  toast.hidden = true;

  toast.innerHTML = `
    <button type="button" class="welcome-toast-close" aria-label="Dismiss" aria-hidden="true">&times;</button>
    <p class="welcome-toast-title">${options.heading}</p>
    <div class="welcome-toast-actions">
      <a class="btn btn-primary welcome-toast-btn" href="tel:${CONFIG.companyPhoneTel}">Office Visit</a>
      <a class="btn btn-ghost welcome-toast-btn" href="tel:${CONFIG.companyPhoneTel}">Call</a>
    </div>
  `;

  document.body.appendChild(toast);

  const closeBtn = toast.querySelector('.welcome-toast-close');

  function close() {
    toast.hidden = true;
    toast.classList.remove('is-visible');
  }

  function open() {
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
  }

  closeBtn.addEventListener('click', close);

  return { toast, open, close };
}

export function initWelcomeToast(opts = {}) {
  const options = Object.assign({}, DEFAULTS, opts);
  const toast = buildToast(options);
  setTimeout(() => toast.open(), options.showDelay);
}
