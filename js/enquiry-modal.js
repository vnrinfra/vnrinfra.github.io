import { CONFIG } from './config.js';
import { submitLead } from './form-api.js';

// Configurable on first run — reads options object passed from main.js.
const DEFAULTS = {
  showDelay: 2500,       // ms after load before the modal appears
};

const SUBMIT_COPY = "we'll call you back within a few hours";

// Shown once per tab/session — dismissed once, it stays hidden until the
// browser tab is closed (sessionStorage clears automatically on tab close).
const SEEN_KEY = 'vnr_enquiry_seen';
function wasSeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function buildModal(options) {
  const root = document.createElement('div');
  root.className = 'enquiry-modal-backdrop';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'enquiry-modal-title');
  root.hidden = true;

  root.innerHTML = `
    <div class="enquiry-modal">
      <button type="button" class="enquiry-modal-close" aria-label="Close" aria-hidden="true">&times;</button>
      <div class="enquiry-offer enquiry-offer--anvita" role="img" aria-label="10% off launch offer on Anvita High 9">
        <span class="enquiry-offer-badge">10% OFF</span>
        <span class="enquiry-offer-label">Launch Offer</span>
      </div>
      <p class="eyebrow">${esc(options.eyebrow || 'WELCOME TO VNR INFRA')}</p>
      <h3 class="enquiry-modal-title" id="enquiry-modal-title">${esc(options.title || 'Find your plot before it\u2019s gone.')}</h3>
      <p class="enquiry-modal-sub">${esc(options.sub || 'Tell us what you\u2019re looking for and we\u2019ll share what\u2019s open in your preferred area.')}</p>

      <form class="enquiry-modal-form" novalidate>
        <div class="field">
          <label for="enquiry-modal-name">Full name</label>
          <input type="text" id="enquiry-modal-name" name="name" required autocomplete="name">
        </div>
        <div class="field">
          <label for="enquiry-modal-phone">Phone number</label>
          <input type="tel" id="enquiry-modal-phone" name="phone" required maxlength="10" inputmode="numeric" pattern="[0-9]*" autocomplete="tel">
        </div>
        <div class="field field-wide">
          <label for="enquiry-modal-interest">Interested in</label>
          <select id="enquiry-modal-interest" name="interest">
            <option value="plots">Open plots</option>
            <option value="villas">Villas</option>
            <option value="farmland">Farmland</option>
            <option value="not-sure">Not sure yet</option>
            <option value="anvita">Anvita High 9 (current project)</option>
            <option value="nidhi">Nidhi Avenue, Alair (current project)</option>
          </select>
        </div>
        <div class="field field-wide">
          <label for="enquiry-modal-message">Message</label>
          <textarea id="enquiry-modal-message" name="message" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary enquiry-modal-submit">Request Callback</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>

      <div class="enquiry-modal-actions">
        <a class="enquiry-action" href="tel:${CONFIG.companyPhoneTel}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>
          <span>Call</span>
        </a>
        <a class="enquiry-action" href="https://wa.me/${CONFIG.companyWhatsapp}?text=${encodeURIComponent(CONFIG.whatsappDefaultMessage)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.5.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.42 9.42 0 1 1 8.39 4.42zM12 2a9.98 9.98 0 0 0-8.63 14.96L2 22l5.16-1.35A9.98 9.98 0 1 0 12 2z"/></svg>
          <span>WhatsApp</span>
        </a>
        <a class="enquiry-action" href="tel:${CONFIG.companyPhoneTel}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Office Visit</span>
        </a>
        <a class="enquiry-action" href="mailto:${CONFIG.companyEmail}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
          <span>Email</span>
        </a>
      </div>

      <button type="button" class="enquiry-modal-skip">No thanks, I\u2019ll browse the site</button>
    </div>`;

  document.body.appendChild(root);

  const closeBtn = root.querySelector('.enquiry-modal-close');
  const skipBtn = root.querySelector('.enquiry-modal-skip');
  const form = root.querySelector('.enquiry-modal-form');
  const status = root.querySelector('.form-status');
  const submitBtn = root.querySelector('.enquiry-modal-submit');

  function close() {
    markSeen();
    root.hidden = true;
    document.body.style.overflow = '';
    closeBtn.setAttribute('aria-hidden', 'false');
  }

  function open() {
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    const first = root.querySelector('#enquiry-modal-name');
    setTimeout(() => first && first.focus({ preventScroll: true }), 350);
  }

  closeBtn.addEventListener('click', close);
  skipBtn.addEventListener('click', close);
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) close();
  });

  // Phone field accepts digits only, max 10.
  form.phone.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const interest = form.interest.value;
    let message = form.message.value.trim();

    if (!name) {
      setStatus(status, 'Please enter your name.', 'err');
      form.name.classList.add('touched');
      form.name.focus();
      return;
    }
    if (!phone) {
      setStatus(status, 'Please enter your phone number.', 'err');
      form.phone.classList.add('touched');
      form.phone.focus();
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setStatus(status, 'Please enter a valid 10-digit phone number.', 'err');
      form.phone.classList.add('touched');
      form.phone.focus();
      return;
    }
    if (!interest) {
      setStatus(status, 'Please choose what you\u2019re interested in.', 'err');
      form.interest.classList.add('touched');
      form.interest.focus();
      return;
    }
    if (!message) {
      message = 'interested';
      form.message.value = message;
    }

    const label = interest === 'villas' ? 'villas' : interest === 'farmland' ? 'farmland' : interest === 'not-sure' ? 'open plots' : 'open plots';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    const result = await submitLead({
      name,
      phone,
      interest,
      message,
      subject: `New VNR Infra enquiry (popup) \u2014 ${label}`,
    });

    if (result.ok) {
      form.reset();
      form.querySelectorAll('.touched').forEach((el) => el.classList.remove('touched'));
      submitBtn.textContent = 'Request Callback';
      submitBtn.disabled = false;
      const msg = `Thanks ${name.split(' ')[0]}, ${SUBMIT_COPY} about ${label}.`;
      setStatus(status, msg, 'ok');
      setTimeout(() => close(), 1400);
    } else {
      setStatus(status, result.message, 'err');
      submitBtn.textContent = 'Request Callback';
      submitBtn.disabled = false;
    }
  });

  form.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('blur', () => field.classList.add('touched'));
  });

  return { root, open, close };
}

function setStatus(el, message, type) {
  el.textContent = message;
  el.className = 'form-status ' + type;
}

export function initEnquiryModal(opts = {}) {
  // Skip entirely if the user already dismissed it this tab/session.
  if (wasSeen()) return;
  const options = Object.assign({}, DEFAULTS, opts);
  const modal = buildModal(options);
  setTimeout(() => modal.open(), options.showDelay);
}
