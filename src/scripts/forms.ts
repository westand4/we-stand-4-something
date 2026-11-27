/**
 * Sends the site's forms (marked with data-subject).
 *
 * With a Web3Forms access key in FORMS (src/data/site.ts), messages go straight to the
 * organisation's inbox and the page shows a confirmation. Without one, the visitor's email
 * app opens with the message filled in.
 *
 * The browser's built-in validation runs first, so missing required fields are announced to
 * screen readers before anything is sent. Results are written to the form's status area,
 * which is announced and receives focus.
 */
import { CONTACT, FORMS } from '../data/site';

type Field = HTMLInputElement | HTMLTextAreaElement;

/** The visible label for a field, without the required marker. */
function labelFor(form: HTMLFormElement, field: Field): string {
  const text = form.querySelector(`label[for="${field.id}"]`)?.textContent ?? field.name;
  return text.replace(/\*|\(required\)/g, '').replace(/\s+/g, ' ').trim();
}

/** The fields people filled in, as label/value pairs, skipping hidden service fields. */
function filledFields(form: HTMLFormElement): [string, string][] {
  return [...form.querySelectorAll<Field>('input:not([type=hidden]):not([type=checkbox]), textarea')]
    .filter((f) => f.value.trim())
    .map((f) => [labelFor(form, f), f.value.trim()]);
}

function showStatus(form: HTMLFormElement, kind: 'success' | 'error' | 'sending', message: string): void {
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!status) return;
  status.className = `form-status form-status--${kind}`;
  status.textContent = message;
  status.hidden = false;
  if (kind !== 'sending') status.focus();
}

function openEmailApp(form: HTMLFormElement): void {
  const lines = filledFields(form).map(([label, value]) => `${label}: ${value}`);
  const subject = encodeURIComponent(form.dataset.subject ?? 'Website message');
  const body = encodeURIComponent(lines.join('\n'));
  window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
}

async function sendToInbox(form: HTMLFormElement, button: HTMLButtonElement | null): Promise<void> {
  const subject = form.dataset.subject ?? 'Website message';
  const payload: Record<string, string> = {
    access_key: FORMS.web3formsKey,
    subject: `Website: ${subject}`,
    from_name: 'We Stand 4 Something website',
    // Hidden spam trap: people leave it unticked, bots tick it.
    botcheck: form.querySelector<HTMLInputElement>('input[name="botcheck"]')?.checked ? 'true' : '',
  };
  const email = form.querySelector<HTMLInputElement>('input[type="email"]')?.value.trim();
  if (email) payload.replyto = email;
  for (const [label, value] of filledFields(form)) payload[label] = value;

  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
  showStatus(form, 'sending', 'Sending your message…');
  try {
    const response = await fetch(FORMS.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = (await response.json().catch(() => ({}))) as { success?: boolean };
    if (!response.ok || !result.success) throw new Error('not sent');
    form.reset();
    showStatus(form, 'success', `Thank you. Your message has been sent to We Stand 4 Something. We will reply to you as soon as we can.`);
  } catch {
    showStatus(
      form,
      'error',
      `Sorry, your message could not be sent. Please try again, or contact us at ${CONTACT.email} or ${CONTACT.phoneDisplay}.`,
    );
  } finally {
    if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
  }
}

export function initForms(root: ParentNode = document): void {
  root.querySelectorAll<HTMLFormElement>('form[data-subject]').forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (FORMS.web3formsKey) void sendToInbox(form, form.querySelector('button[type="submit"]'));
      else openEmailApp(form);
    });
  });
}
