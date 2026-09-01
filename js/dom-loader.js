import { CONFIG } from './config.js';

// Values available to any partial as {{TOKEN}}.
function buildTokenMap() {
  const waMessage = encodeURIComponent(CONFIG.whatsappDefaultMessage);
  return {
    PHONE_DISPLAY: CONFIG.companyPhoneDisplay,
    PHONE_TEL: CONFIG.companyPhoneTel,
    WHATSAPP_URL: `https://wa.me/${CONFIG.companyWhatsapp}?text=${waMessage}`,
    COMPANY_EMAIL: CONFIG.companyEmail,
  };
}

function applyTokens(html, tokens) {
  return html.replace(/{{\s*(\w+)\s*}}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(tokens, key) ? tokens[key] : match
  );
}

async function injectPartial(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} responded ${res.status}`);
    const raw = await res.text();
    target.innerHTML = applyTokens(raw, buildTokenMap());
  } catch (err) {
    console.error('Failed to load partial:', url, err);
    // Leave the target empty rather than a broken layout; the rest
    // of the page still works without header/footer chrome.
  }
}

export async function loadChrome() {
  await Promise.all([
    injectPartial(CONFIG.headerPartialUrl, '#header-root'),
    injectPartial(CONFIG.footerPartialUrl, '#footer-root'),
  ]);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.dispatchEvent(new CustomEvent('chrome:loaded'));
}

// For elements that live directly in index.html (not a fetched
// partial) but still need config-driven contact links.
export function wireStaticContactLinks() {
  const tokens = buildTokenMap();
  document.querySelectorAll('[data-contact="call"]').forEach((el) => {
    el.href = `tel:${tokens.PHONE_TEL}`;
  });
  document.querySelectorAll('[data-contact="whatsapp"]').forEach((el) => {
    el.href = tokens.WHATSAPP_URL;
    el.target = '_blank';
    el.rel = 'noopener';
  });
  document.querySelectorAll('[data-contact="email"]').forEach((el) => {
    el.href = `mailto:${tokens.COMPANY_EMAIL}`;
    el.textContent = tokens.COMPANY_EMAIL;
  });
}