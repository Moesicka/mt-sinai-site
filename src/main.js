// src/main.js

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Desktop contact dropdown
  const contactDropdown = document.getElementById('contact-dropdown');
  const contactButton = document.getElementById('contact-button');
  const contactMenu = document.getElementById('contact-menu');
  const contactChevron = document.getElementById('contact-chevron');
  
  if (contactDropdown && contactButton && contactMenu && contactChevron) {
    let dropdownTimeout;
    
    // Show dropdown on mouse enter
    contactDropdown.addEventListener('mouseenter', function() {
      clearTimeout(dropdownTimeout);
      contactMenu.classList.remove('hidden');
      contactChevron.style.transform = 'rotate(180deg)';
      contactButton.setAttribute('aria-expanded', 'true');
    });
    
    // Hide dropdown on mouse leave with small delay
    contactDropdown.addEventListener('mouseleave', function() {
      dropdownTimeout = setTimeout(function() {
        contactMenu.classList.add('hidden');
        contactChevron.style.transform = 'rotate(0deg)';
        contactButton.setAttribute('aria-expanded', 'false');
      }, 100);
    });
    
    // Also show/hide on click for better mobile support
    contactButton.addEventListener('click', function(e) {
      e.preventDefault();
      const isHidden = contactMenu.classList.contains('hidden');
      if (isHidden) {
        contactMenu.classList.remove('hidden');
        contactChevron.style.transform = 'rotate(180deg)';
        contactButton.setAttribute('aria-expanded', 'true');
      } else {
        contactMenu.classList.add('hidden');
        contactChevron.style.transform = 'rotate(0deg)';
        contactButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile contact submenu toggle
  const mobileContactBtn = document.getElementById('mobile-contact-btn');
  const mobileContactMenu = document.getElementById('mobile-contact-menu');
  const mobileContactChevron = document.getElementById('mobile-contact-chevron');
  
  if (mobileContactBtn && mobileContactMenu && mobileContactChevron) {
    mobileContactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      mobileContactMenu.classList.toggle('hidden');
      mobileContactChevron.classList.toggle('rotate-180');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (contactDropdown && !contactDropdown.contains(e.target)) {
      if (contactMenu && contactChevron && contactButton) {
        contactMenu.classList.add('hidden');
        contactChevron.style.transform = 'rotate(0deg)';
        contactButton.setAttribute('aria-expanded', 'false');
      }
    }
    
    if (mobileMenu && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});