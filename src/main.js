// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isHidden = navMobile.classList.toggle('hidden');
      navToggle.setAttribute('aria-expanded', String(!isHidden));
    });
  }

  // Desktop contact dropdown
  const contactDesktop = document.getElementById('contact-desktop');
  const contactToggle  = document.getElementById('contact-toggle');
  const contactMenu    = document.getElementById('contact-menu');
  const contactChevron = document.getElementById('contact-chevron');

  if (contactDesktop && contactToggle && contactMenu && contactChevron) {
    let hideTimer;

    const openMenu = () => {
      clearTimeout(hideTimer);
      contactMenu.classList.remove('hidden');
      contactChevron.style.transform = 'rotate(180deg)';
      contactToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      hideTimer = setTimeout(() => {
        contactMenu.classList.add('hidden');
        contactChevron.style.transform = 'rotate(0deg)';
        contactToggle.setAttribute('aria-expanded', 'false');
      }, 100);
    };

    // Mouse users
    contactDesktop.addEventListener('mouseenter', openMenu);
    contactDesktop.addEventListener('mouseleave', closeMenu);

    // Touch/click users
    contactToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = contactMenu.classList.contains('hidden');
      if (isHidden) openMenu(); else closeMenu();
    });
  }

  // Mobile contact accordion
  const mobileContactToggle  = document.getElementById('mobile-contact-toggle');
  const mobileContactMenu    = document.getElementById('mobile-contact-menu');
  const mobileContactChevron = document.getElementById('mobile-contact-chevron');

  if (mobileContactToggle && mobileContactMenu && mobileContactChevron) {
    mobileContactToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = mobileContactMenu.classList.contains('hidden');
      mobileContactMenu.classList.toggle('hidden');
      mobileContactChevron.style.transform = willOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      mobileContactToggle.setAttribute('aria-expanded', String(willOpen));
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    // desktop dropdown
    if (contactDesktop && !contactDesktop.contains(e.target)) {
      if (contactMenu && !contactMenu.classList.contains('hidden')) {
        contactMenu.classList.add('hidden');
        contactChevron && (contactChevron.style.transform = 'rotate(0deg)');
        contactToggle && contactToggle.setAttribute('aria-expanded', 'false');
      }
    }
    // mobile menu
    if (navMobile && !navMobile.classList.contains('hidden') &&
        !e.composedPath().includes(navMobile) &&
        !e.composedPath().includes(navToggle)) {
      navMobile.classList.add('hidden');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Highlight active nav link (works for file:// and normal hosting)
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a[href]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current) {
      a.classList.add('text-blue-600', 'font-semibold');
      a.setAttribute('aria-current', 'page');
    }
  });
});
