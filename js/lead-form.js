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
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const phonePattern = /^[0-9+\-\s]{7,15}$/;
  
      if (!name) {
        setStatus(status, 'Please enter your name.', 'err');
        form.name.classList.add('touched');
        form.name.focus();
        return;
      }
  
      if (!phonePattern.test(phone)) {
        setStatus(status, 'Please enter a valid phone number.', 'err');
        form.phone.classList.add('touched');
        form.phone.focus();
        return;
      }
  
      const action = leadActionInput.value;
      const project = leadProjectInput.value;
      const phrase = actionPhrases[action] || actionPhrases.Enquiry;
      const projectPhrase = project !== 'General' ? ` for ${project}` : '';
  
      // No backend wired up yet — this just confirms locally.
      // Replace this block with a fetch() to your form endpoint / API,
      // sending leadAction + leadProject so you know which CTA it came from.
      setStatus(status, `Thanks ${name.split(' ')[0]}, ${phrase}${projectPhrase} at ${phone} shortly.`, 'ok');
  
      form.reset();
      form.querySelectorAll('.touched').forEach((el) => el.classList.remove('touched'));
      leadActionInput.value = 'Enquiry';
      leadProjectInput.value = 'General';
      formPurposeNote.textContent = 'General enquiry';
      submitBtn.textContent = 'Request Callback';
    });
  }