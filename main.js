// main.js - Enhanced Navigation and UI functionality with better performance
// Version 2.2 - Fixed to match actual HTML element IDs

(function() {
  'use strict';
  
  // Cache DOM elements for better performance
  const elements = {};
  
  // Debounce function for performance optimization
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize DOM element cache - FIXED TO MATCH YOUR HTML
  function cacheElements() {
    elements.menuBtn = document.getElementById('nav-toggle'); // Fixed ID
    elements.mobileMenu = document.getElementById('nav-mobile'); // Fixed ID
    elements.contactDropdown = document.getElementById('contact-desktop'); // Fixed ID
    elements.contactButton = document.getElementById('contact-toggle'); // Fixed ID
    elements.contactMenu = document.getElementById('contact-menu');
    elements.contactChevron = document.getElementById('contact-chevron');
    elements.mobileContactBtn = document.getElementById('mobile-contact-toggle'); // Fixed ID
    elements.mobileContactMenu = document.getElementById('mobile-contact-menu');
    elements.mobileContactChevron = document.getElementById('mobile-contact-chevron');
  }

  // Mobile menu functionality
  function initializeMobileMenu() {
    if (!elements.menuBtn || !elements.mobileMenu) return;
    
    elements.menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      elements.mobileMenu.classList.toggle('hidden');
      
      // Update ARIA attributes for accessibility
      const isExpanded = !elements.mobileMenu.classList.contains('hidden');
      elements.menuBtn.setAttribute('aria-expanded', isExpanded);
      
      console.log('Mobile menu toggled:', isExpanded); // Debug
    });
  }

  // Desktop contact dropdown functionality - SIMPLIFIED
  function initializeDesktopDropdown() {
    if (!elements.contactButton || !elements.contactMenu) return;
    
    elements.contactButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isHidden = elements.contactMenu.classList.contains('hidden');
      if (isHidden) {
        // Remove both hidden class and CSS-based visibility
        elements.contactMenu.classList.remove('hidden');
        elements.contactMenu.style.opacity = '1';
        elements.contactMenu.style.visibility = 'visible';
        elements.contactButton.setAttribute('aria-expanded', 'true');
      } else {
        // Add hidden class and reset CSS-based visibility  
        elements.contactMenu.classList.add('hidden');
        elements.contactMenu.style.opacity = '0';
        elements.contactMenu.style.visibility = 'invisible';
        elements.contactButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile contact submenu functionality
  function initializeMobileSubmenu() {
    if (!elements.mobileContactBtn || !elements.mobileContactMenu || 
        !elements.mobileContactChevron) return;
    
    elements.mobileContactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isHidden = elements.mobileContactMenu.classList.contains('hidden');
      elements.mobileContactMenu.classList.toggle('hidden');
      elements.mobileContactChevron.classList.toggle('rotate-180');
      
      elements.mobileContactBtn.setAttribute('aria-expanded', !isHidden);
    });
  }

  // Enhanced outside click handling
  function initializeOutsideClick() {
    const debouncedOutsideClick = debounce(function(e) {
      // Close desktop contact dropdown
      if (elements.contactDropdown && !elements.contactDropdown.contains(e.target)) {
        if (elements.contactMenu && elements.contactButton) {
          elements.contactMenu.classList.add('hidden');
          elements.contactMenu.style.opacity = '0';
          elements.contactMenu.style.visibility = 'invisible';
          elements.contactButton.setAttribute('aria-expanded', 'false');
        }
      }
      
      // Close mobile menu
      if (elements.mobileMenu && elements.menuBtn && 
          !elements.mobileMenu.contains(e.target) && 
          !elements.menuBtn.contains(e.target)) {
        elements.mobileMenu.classList.add('hidden');
        elements.menuBtn.setAttribute('aria-expanded', 'false');
      }
    }, 50);

    document.addEventListener('click', debouncedOutsideClick);
  }

  // Smooth scrolling
  function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          if (elements.mobileMenu) {
            elements.mobileMenu.classList.add('hidden');
          }
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (history.pushState) history.pushState(null, null, href);
        }
      });
    });
  }

  // Form enhancements
  function initializeFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function() {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          const originalText = submitBtn.textContent || submitBtn.value;
          submitBtn.textContent = 'Sending...';
          submitBtn.value = 'Sending...';
          
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.value = originalText;
          }, 5000);
        }
      });
      
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', function() {
          if (this.checkValidity()) {
            this.classList.remove('border-red-500');
            this.classList.add('border-green-500');
          } else {
            this.classList.remove('border-green-500');
            this.classList.add('border-red-500');
          }
        });
      });
    });
  }

  // Current-page highlight
  function initializePageHighlight() {
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('nav a[href]').forEach(a => {
      const href = a.getAttribute('href')?.toLowerCase();
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('text-blue-600','font-semibold');
        a.classList.remove('text-gray-700');
        a.setAttribute('aria-current','page');
      }
    });
  }

  // Performance monitoring (optional)
  function initializePerformanceMonitoring() {
    if ('performance' in window && 'mark' in performance) {
      performance.mark('main-js-start');
      
      window.addEventListener('load', () => {
        performance.mark('main-js-complete');
        performance.measure('main-js-duration', 'main-js-start', 'main-js-complete');
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          const measure = performance.getEntriesByName('main-js-duration')[0];
          console.log(`Main.js initialization took: ${measure.duration.toFixed(2)}ms`);
        }
      });
    }
  }

  // Main init
  function init() {
    cacheElements();
    initializeMobileMenu();
    initializeDesktopDropdown();
    initializeMobileSubmenu();
    initializeOutsideClick();
    initializeSmoothScrolling();
    initializeFormEnhancements();
    initializePageHighlight();
    initializePerformanceMonitoring();
    
    document.body.classList.add('js-ready');
    console.log('Navigation initialized with correct IDs'); // Debug
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (elements.contactMenu) {
        elements.contactMenu.classList.add('hidden');
        elements.contactMenu.style.opacity = '0';
        elements.contactMenu.style.visibility = 'invisible';
        if (elements.contactButton) elements.contactButton.setAttribute('aria-expanded', 'false');
      }
      if (elements.mobileMenu) {
        elements.mobileMenu.classList.add('hidden');
        if (elements.menuBtn) elements.menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

})();