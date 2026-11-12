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

// Services : ouverture d'un volet de détail par carte (un seul ouvert à la fois)
const serviceToggles = document.querySelectorAll('.service-toggle');
if (serviceToggles.length) {
  document.documentElement.classList.add('js');

  const mobileQuery = window.matchMedia('(max-width:760px)');
  const panelsHost = document.querySelector('.service-panels');

  function openService(id, focusPanel) {
    serviceToggles.forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const isTarget = btn.id === 'tab-' + id;
      btn.setAttribute('aria-expanded', String(isTarget));
      panel?.classList.toggle('open', isTarget);
      // Sur mobile, le volet s'affiche juste sous la carte cliquée
      if (isTarget && panel) {
        if (mobileQuery.matches) btn.after(panel);
        else panelsHost?.appendChild(panel);
      }
      if (isTarget && panel && focusPanel) {
        if (mobileQuery.matches) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        panel.focus({ preventScroll: true });
      }
    });
    if (id) history.replaceState(null, '', '#' + id);
    else history.replaceState(null, '', location.pathname);
  }

  serviceToggles.forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.id.replace('tab-', '');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen && !mobileQuery.matches) return; // sur PC, un volet reste toujours affiché
    openService(btn.getAttribute('aria-expanded') === 'true' ? null : id, true);
  }));
  document.querySelectorAll('.service-panel-close').forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.closest('.service-panel').id.replace('panel-', '');
    openService(null, false);
    document.getElementById('tab-' + id)?.focus();
  }));

  // Lien direct possible : services.html#securite
  // Lien direct possible : services.html#securite ; sinon, sur PC, le premier volet est ouvert
  const initial = location.hash.slice(1);
  if (document.getElementById('tab-' + initial)) openService(initial, false);
  else if (!mobileQuery.matches) {
    openService(serviceToggles[0].id.replace('tab-', ''), false);
    history.replaceState(null, '', location.pathname);
  }
}

// Accueil : apparition progressive des sections au défilement
const revealBlocks = document.querySelectorAll('.reveal');
if (revealBlocks.length && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealBlocks.forEach((block) => revealObserver.observe(block));
}
