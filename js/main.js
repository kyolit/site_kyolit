const topBtn = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => topBtn?.classList.toggle('visible', window.scrollY > 500));
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

function setMenu(open) {
  if (!burger || !nav) return;
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}

burger?.addEventListener('click', (event) => {
  event.stopPropagation();
  setMenu(!nav?.classList.contains('open'));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (event) => {
  if (nav?.classList.contains('open') && !nav.contains(event.target) && !burger?.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) setMenu(false);
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const legacySuccess = document.getElementById('formSuccess');
  const status = document.createElement('div');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  contactForm.parentNode.insertBefore(status, contactForm);
  if (legacySuccess) legacySuccess.remove();

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    status.className = 'form-status is-sending';
    status.textContent = 'Envoi de votre demande en cours…';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours…';
    }

    try {
      const data = new FormData(contactForm);
      const response = await fetch('https://formsubmit.co/ajax/contact@kyolit.nc', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (!response.ok) throw new Error('Réponse du service invalide');
      const result = await response.json();
      if (result.success === 'false' || result.success === false) throw new Error(result.message || 'Échec de l’envoi');
      status.className = 'form-status is-success';
      status.textContent = 'Votre demande a bien été envoyée à contact@kyolit.nc.';
      contactForm.reset();
    } catch (error) {
      status.className = 'form-status is-error';
      status.textContent = 'L’envoi automatique n’a pas abouti. Réessayez ou contactez KYÖL IT par téléphone, WhatsApp ou e-mail.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}
