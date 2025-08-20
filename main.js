// main.js - Enhanced Navigation and UI functionality with better performance
// Version 2.1 - Lazy-loading removed for simplicity

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

  // Initialize DOM element cache
  function cacheElements() {
    elements.menuBtn = document.getElementById('menu-btn');
    elements.mobileMenu = document.getElementById('mobile-menu');
    elements.contactDropdown = document.getElementById('contact-dropdown');
    elements.contactButton = document.getElementById('contact-button');
    elements.contactMenu = document.getElementById('contact-menu');
    elements.contactChevron = document.getElementById('contact-chevron');
    elements.mobileContactBtn = document.getElementById('mobile-contact-btn');
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
    });
  }

  // Desktop contact dropdown functionality
  function initializeDesktopDropdown() {
    if (!elements.contactDropdown || !elements.contactButton || 
        !elements.contactMenu || !elements.contactChevron) return;
    
    let dropdownTimeout;
    
    function showDropdown() {
      clearTimeout(dropdownTimeout);
      elements.contactMenu.classList.remove('hidden');
      elements.contactChevron.style.transform = 'rotate(180deg)';
      elements.contactButton.setAttribute('aria-expanded', 'true');
    }
    
    function hideDropdown() {
      dropdownTimeout = setTimeout(() => {
        elements.contactMenu.classList.add('hidden');
        elements.contactChevron.style.transform = 'rotate(0deg)';
        elements.contactButton.setAttribute('aria-expanded', 'false');
      }, 150);
    }
    
    elements.contactDropdown.addEventListener('mouseenter', showDropdown);
    elements.contactDropdown.addEventListener('mouseleave', hideDropdown);
    
    elements.contactButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isHidden = elements.contactMenu.classList.contains('hidden');
      if (isHidden) {
        showDropdown();
      } else {
        clearTimeout(dropdownTimeout);
        hideDropdown();
      }
    });

    elements.contactButton.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        elements.contactButton.click();
      } else if (e.key === 'Escape') {
        hideDropdown();
        elements.contactButton.focus();
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
      if (elements.contactDropdown && !elements.contactDropdown.contains(e.target)) {
        if (elements.contactMenu && elements.contactChevron && elements.contactButton) {
          elements.contactMenu.classList.add('hidden');
          elements.contactChevron.style.transform = 'rotate(0deg)';
          elements.contactButton.setAttribute('aria-expanded', 'false');
        }
      }
      
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
    initializePerformanceMonitoring();
    
    document.body.classList.add('js-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      document.body.classList.add('page-hidden');
    } else {
      document.body.classList.remove('page-hidden');
    }
  });

})();
