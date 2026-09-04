import { submitLead } from './form-api.js';

const submitLabels = {
    'Site Visit': 'Confirm Site Visit',
    'Brochure': 'Send Me the Brochure',
    'Price Details': 'Send Price Details',
    'Enquiry': 'Request Callback',
  };

  const actionPhrases = {
    'Site Visit': "we'll confirm your site visit",
    'Brochure': "we'll send the brochure",
    'Price Details': "we'll share price details",
    'Enquiry': "we'll call you back",
  };
  
  // Best-effort guess at which "Interested in" option matches a
  // project name. Falls back to leaving the select untouched.
  function guessInterest(projectName) {
    const name = (projectName || '').toLowerCase();
    // Known current projects map to their dropdown options.
    if (name.includes('anvita')) return 'anvita';
    if (name.includes('nidhi')) return 'nidhi';
    if (name.includes('villa')) return 'villas';
    if (name.includes('farm')) return 'farmland';
    if (name.includes('avenue') || name.includes('plot')) return 'plots';
    return null;
  }
  
  function setStatus(el, message, type) {
    el.textContent = message;
    el.className = 'form-status ' + type;
  }
  
  export function initLeadForm() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;
  
    const status = document.getElementById('form-status');
    const leadActionInput = document.getElementById('lead-action');
    const leadProjectInput = document.getElementById('lead-project');
    const formPurposeNote = document.getElementById('form-purpose');
    const submitBtn = document.getElementById('form-submit-btn');
    const interestSelect = document.getElementById('interest');
  
    // Any button anywhere on the page (hero, project cards, mobile
    // bar) with data-lead-action routes into this same form.
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lead-action]');
      if (!btn) return;
  
      const action = btn.dataset.leadAction;
      const project = btn.dataset.leadProject || 'General';
  
      leadActionInput.value = action;
      leadProjectInput.value = project;
  
      formPurposeNote.textContent = project === 'General'
        ? `Requesting: ${action}`
        : `Requesting: ${action} — ${project}`;
  
      submitBtn.textContent = submitLabels[action] || 'Request Callback';
  
      const guessedInterest = guessInterest(project);
      if (guessedInterest) interestSelect.value = guessedInterest;
  
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 500);
    });
  
    form.querySelectorAll('input, select').forEach((field) => {
      field.addEventListener('blur', () => field.classList.add('touched'));
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

      const action = leadActionInput.value;
      const project = leadProjectInput.value;
      const phrase = actionPhrases[action] || actionPhrases.Enquiry;
      const projectPhrase = project !== 'General' ? ` for ${project}` : '';

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      const result = await submitLead({
        name,
        phone,
        interest,
        message,
        subject: `New VNR Infra lead \u2014 ${action}${projectPhrase}`,
        leadAction: action,
        leadProject: project,
      });

      if (result.ok) {
        form.reset();
        form.querySelectorAll('.touched').forEach((el) => el.classList.remove('touched'));
        leadActionInput.value = 'Enquiry';
        leadProjectInput.value = 'General';
        formPurposeNote.textContent = 'General enquiry';
        submitBtn.textContent = 'Request Callback';
        setStatus(status, `Thanks ${name.split(' ')[0]}, ${phrase}${projectPhrase} at ${phone} shortly.`, 'ok');
      } else {
        setStatus(status, result.message, 'err');
        submitBtn.textContent = submitLabels[action] || 'Request Callback';
      }
      submitBtn.disabled = false;
    });
  }