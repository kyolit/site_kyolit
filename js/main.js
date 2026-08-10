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
  if (legacySuccess) legacySuccess.remove();

  // Le formulaire contact utilise l'action HTML native pour FormSubmit.
  // On ne bloque pas son soumission avec un appel fetch AJAX, car FormSubmit
  // exige une soumission HTTP standard et refuse ce mode de navigation lorsque
  // le site est servi directement en file://.
  contactForm.addEventListener('submit', () => {
    if (window.location.protocol === 'file:') {
      console.warn('Le formulaire de contact doit être servi sur un serveur HTTP(S) pour envoyer automatiquement un e-mail via FormSubmit.');
    }
  });
}
