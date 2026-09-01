import { CONFIG } from './config.js';

// Shared Web3Forms submission helper used by the main contact form and
// the welcome popup. Returns { ok, message } — message is human-friendly
// on error, or the service's message on success.
export async function submitLead(payload) {
  const data = {
    access_key: CONFIG.web3formsAccessKey,
    from_name: payload.name || 'VNR Infra lead',
    subject: payload.subject || 'New VNR Infra lead',
    name: payload.name || '',
    phone: payload.phone || '',
    interest: payload.interest || '',
    message: payload.message || '',
    // Keep the recipient dynamic — set the same address on the
    // web3forms.com dashboard for delivery to actually take effect.
    email: CONFIG.leadRecipientEmail,
  };

  // CTA source context (main form carries leadAction/leadProject).
  if (payload.leadAction) data.lead_action = payload.leadAction;
  if (payload.leadProject) data.lead_project = payload.leadProject;

  try {
    const res = await fetch(CONFIG.web3formsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { ok: false, message: json.message || 'Submission failed. Please try again.' };
    }
    return { ok: true, message: json.message || 'Thanks, we have received your request.' };
  } catch (err) {
    return { ok: false, message: 'Network error — please check your connection and try again.' };
  }
}
