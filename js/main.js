/**
 * Mountainside Elks Lodge #1585
 * Main JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navMobileLinks = document.querySelectorAll('.nav-mobile__link');

  // Mobile Navigation Toggle
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMobile.classList.contains('active');
      
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
      
      // Update ARIA
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close mobile nav when clicking a link
    navMobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMobile.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header scroll effect
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for animations
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('[data-animate]');
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  };

  // Initialize animations
  animateOnScroll();

  // Current year for copyright
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Active nav link based on current page
  const setActiveNavLink = function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link, .nav-mobile__link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if this link matches current page
      if (href === currentPath || 
          (href !== '/' && currentPath.includes(href)) ||
          (href === '/' && currentPath === '/index.html') ||
          (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html')))) {
        link.classList.add('nav__link--active');
      }
    });
  };

  setActiveNavLink();

})();
