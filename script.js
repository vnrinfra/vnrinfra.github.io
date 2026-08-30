// ---------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close the mobile menu after a nav link is tapped
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------
// Scroll reveal
// ---------------------------------------------------
const revealTargets = document.querySelectorAll(
  '.project-card, .why-item, .process-list li, .section-head'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach(el => revealObserver.observe(el));

// ---------------------------------------------------
// Lead-gen buttons (Book Site Visit / Brochure / Get Price)
// Every button with data-lead-action scrolls to the enquiry
// form and pre-fills it so the visitor doesn't retype context.
// ---------------------------------------------------
const leadActionButtons = document.querySelectorAll('[data-lead-action]');
const leadActionInput = document.getElementById('lead-action');
const leadProjectInput = document.getElementById('lead-project');
const formPurposeNote = document.getElementById('form-purpose');
const submitBtn = document.getElementById('form-submit-btn');
const interestSelect = document.getElementById('interest');

const submitLabels = {
  'Site Visit': 'Confirm Site Visit',
  'Brochure': 'Send Me the Brochure',
  'Price Details': 'Send Price Details',
  'Enquiry': 'Request Callback',
};

const projectInterestMap = {
  'Meadow Ridge': 'plots',
  'Silver Orchard Villas': 'villas',
  'Northgate Farms': 'farmland',
};

leadActionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.leadAction;
    const project = btn.dataset.leadProject || 'General';

    leadActionInput.value = action;
    leadProjectInput.value = project;

    formPurposeNote.textContent = project === 'General'
      ? `Requesting: ${action}`
      : `Requesting: ${action} — ${project}`;

    submitBtn.textContent = submitLabels[action] || 'Request Callback';

    if (projectInterestMap[project]) {
      interestSelect.value = projectInterestMap[project];
    }

    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

    // Give the scroll a moment to land, then focus the first field
    setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 500);
  });
});

// ---------------------------------------------------
// Enquiry form (front-end only — swap the submit handler
// for a real backend / form service when you have one)
// ---------------------------------------------------
const form = document.getElementById('enquiry-form');
const status = document.getElementById('form-status');

form.querySelectorAll('input, select').forEach(field => {
  field.addEventListener('blur', () => field.classList.add('touched'));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const phonePattern = /^[0-9+\-\s]{7,15}$/;

  if (!name) {
    showStatus('Please enter your name.', 'err');
    form.name.classList.add('touched');
    form.name.focus();
    return;
  }

  if (!phonePattern.test(phone)) {
    showStatus('Please enter a valid phone number.', 'err');
    form.phone.classList.add('touched');
    form.phone.focus();
    return;
  }

  const action = leadActionInput.value;
  const project = leadProjectInput.value;
  const actionPhrase = {
    'Site Visit': "we'll confirm your site visit",
    'Brochure': "we'll send the brochure",
    'Price Details': "we'll share price details",
    'Enquiry': "we'll call you back",
  }[action] || "we'll call you back";
  const projectPhrase = project !== 'General' ? ` for ${project}` : '';

  // No backend wired up yet — this just confirms the fields locally.
  // Replace this block with a fetch() to your form endpoint / API,
  // sending along leadAction and leadProject so you know which CTA
  // generated the lead.
  showStatus(`Thanks ${name.split(' ')[0]}, ${actionPhrase}${projectPhrase} at ${phone} shortly.`, 'ok');
  form.reset();
  form.querySelectorAll('.touched').forEach(el => el.classList.remove('touched'));
  leadActionInput.value = 'Enquiry';
  leadProjectInput.value = 'General';
  formPurposeNote.textContent = 'General enquiry';
  submitBtn.textContent = 'Request Callback';
});

function showStatus(message, type) {
  status.textContent = message;
  status.className = 'form-status ' + type;
}

// ---------------------------------------------------
// Footer year
// ---------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();