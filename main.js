// ===========================
// VortKart® Global JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    // Apply scrolled state on load if page is already scrolled (e.g. back navigation)
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ---- Mobile Nav Toggle ----
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    const setToggleOpen = (open) => {
      const spans = toggle.querySelectorAll('span');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        mobileNav.classList.add('open');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        mobileNav.classList.remove('open');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    };
    toggle.addEventListener('click', function () {
      setToggleOpen(!mobileNav.classList.contains('open'));
    });
    // Close on link click or ESC key
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setToggleOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) setToggleOpen(false);
    });
  }

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0]; // strip anchors for matching
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll-triggered fade in ----
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target); // stop observing once visible
        }
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(el => observer.observe(el));
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all within the same parent container
      const parent = item.closest('.faq-right, [style*="max-width"], .container') || document;
      parent.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Filter bars (scoped — handles multiple independent filter groups on the same page) ----
  document.querySelectorAll('.filter-bar').forEach(bar => {
    const btns = bar.querySelectorAll('.filter-btn');
    // Find the closest sibling grid that contains [data-category] cards
    const gridContainer = bar.nextElementSibling;
    if (!gridContainer) return;
    const cards = gridContainer.querySelectorAll('[data-category]');
    if (!cards.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', function () {
        btns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.filter;
        cards.forEach(card => {
          const match = cat === 'all' || card.dataset.category === cat;
          if (match) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = '';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => { card.style.display = 'none'; }, 280);
          }
        });
      });
    });
  });

  // ---- Counter animation ----
  const statNums = document.querySelectorAll('[data-count]');
  if (statNums.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const steps = Math.max(1, Math.round(duration / 16));
          const increment = target / steps;
          let current = 0;
          let frame = 0;
          const timer = setInterval(() => {
            frame++;
            current = Math.min(Math.round(increment * frame), target);
            el.textContent = current.toLocaleString() + suffix;
            if (current >= target) clearInterval(timer);
          }, 16);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => countObs.observe(el));
  }

  // ---- Contact form ----
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!submitBtn) return;

      // Basic client-side validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--primary)';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      submitBtn.innerHTML = 'Sending&hellip;';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '&#10003; Message Sent — We\'ll be in touch within 24 hours!';
        submitBtn.style.background = '#22c55e';
        form.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
      }, 1500);
    });
  }

  // ---- Smooth scroll for same-page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Dynamic "Currently Open" indicator ----
  const statusEl = document.querySelector('.hours-status');
  if (statusEl) {
    const now = new Date();
    // Convert to EST (UTC-5) / EDT (UTC-4) — approximate
    const utcOffset = now.getTimezoneOffset();
    const estOffset = 300; // EST = UTC-5 = +300 min behind UTC
    const estNow = new Date(now.getTime() - (utcOffset - estOffset) * 60000);
    const day = estNow.getDay(); // 0=Sun, 1=Mon...6=Sat
    const hour = estNow.getHours();
    const minute = estNow.getMinutes();
    const timeDecimal = hour + minute / 60;

    let isOpen = false;
    if (day >= 1 && day <= 5) { // Mon–Fri
      isOpen = timeDecimal >= 8 && timeDecimal < 19;
    } else if (day === 6) { // Sat
      isOpen = timeDecimal >= 9 && timeDecimal < 15;
    }

    if (isOpen) {
      statusEl.textContent = 'Currently Open';
      statusEl.style.color = '#22c55e';
      statusEl.style.setProperty('--dot-color', '#22c55e');
    } else {
      statusEl.textContent = 'Currently Closed';
      statusEl.style.color = '#f87171';
    }
    // Update dot color via pseudo-element (inject a class)
    statusEl.classList.toggle('open', isOpen);
    statusEl.classList.toggle('closed', !isOpen);
  }

});
