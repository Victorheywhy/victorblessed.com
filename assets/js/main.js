/**
 * Victor Ajibade — Portfolio 2025/2026
 * main.js — Pure vanilla JS, no jQuery, no Bootstrap
 *
 * Sections:
 *  1. EmailJS Init
 *  2. Typed.js Hero Animation
 *  3. Navbar Scroll Effect
 *  4. Mobile Menu (Hamburger)
 *  5. Smooth Scroll
 *  6. Intersection Observer — Scroll Animations
 *  7. Intersection Observer — Active Nav Link
 *  8. Skill Bars Animation
 *  9. Count-Up Stats Animation
 * 10. Portfolio Filter
 * 11. Contact Form (EmailJS)
 * 12. Footer Year
 * 13. Init
 */

/* ----------------------------------------------------------------
   1. EmailJS Init
   ---------------------------------------------------------------- */
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('0f1pUY9eRkq5xp4bv');
  }
}

/* ----------------------------------------------------------------
   2. Typed.js Hero Animation
   ---------------------------------------------------------------- */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el || typeof Typed === 'undefined') return;

  new Typed('#typed-text', {
    strings: [
      'Web Developer &amp; Designer',
      'Real Estate Data Analyst',
      'Business &amp; Product Analyst',
      'Creative Freelancer',
      'Professional Content Writer',
      'Graphics Designer',
      'Soundtrack Producer'
    ],
    typeSpeed:    55,
    backSpeed:    30,
    backDelay:    1800,
    startDelay:   400,
    loop:         true,
    smartBackspace: true,
    cursorChar:   '|'
  });
}

/* ----------------------------------------------------------------
   3. Navbar Scroll Effect
   ---------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ----------------------------------------------------------------
   4. Mobile Menu (Hamburger)
   ---------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close when a mobile link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ----------------------------------------------------------------
   5. Smooth Scroll
   ---------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------------------------------
   6. Intersection Observer — Scroll Animations (.animate-on-scroll)
   ---------------------------------------------------------------- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!els.length || !('IntersectionObserver' in window)) {
    // Fallback: make everything visible immediately
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.animate-on-scroll')]
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400); // max 400ms stagger

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  els.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------
   7. Page-Based Active Nav Link
   ---------------------------------------------------------------- */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  const pageKey = page === 'index' || page === '' ? 'home' : page;

  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageKey);
  });
}

/* ----------------------------------------------------------------
   8. Skill Bars Animation
   ---------------------------------------------------------------- */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) {
    fills.forEach(fill => {
      fill.style.width = fill.dataset.width + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          // Delay slightly so the section animation finishes first
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, 300);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* ----------------------------------------------------------------
   9. Count-Up Stats Animation
   ---------------------------------------------------------------- */
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  function countUp(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    statNumbers.forEach(el => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------
   10. Portfolio Filter
   ---------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items       = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length || !items.length) return;

  // Keep layout stable by wrapping in a positioned container.
  // We simply toggle a "hidden" class which CSS handles with
  // opacity + scale + pointer-events, but we also need to keep
  // the grid flow correct, so we use visibility: hidden + width: 0.
  // A simpler approach: we inject a minimal grid reset approach.

  function filterItems(filter) {
    items.forEach(item => {
      const match = filter === 'all' || item.dataset.filter === filter;
      if (match) {
        item.classList.remove('hidden');
        item.style.display = '';
      } else {
        item.classList.add('hidden');
        // Use a timeout matching the CSS transition duration
        // so the item collapses after fading out
        item.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      filterItems(filter);
    });
  });

  // Initialise with "all"
  filterItems('all');
}

/* ----------------------------------------------------------------
   11. Contact Form (EmailJS)
   ---------------------------------------------------------------- */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  if (!form) return;

  const loadingEl = document.getElementById('form-loading');
  const successEl = document.getElementById('form-success');
  const errorEl   = document.getElementById('form-error');
  const submitBtn = document.getElementById('form-submit');

  function showMsg(which) {
    [loadingEl, successEl, errorEl].forEach(el => {
      if (el) el.hidden = true;
    });
    if (which) which.hidden = false;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic HTML validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Show loading state
    showMsg(loadingEl);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    const params = {
      from_name:  form.from_name.value.trim(),
      from_email: form.from_email.value.trim(),
      subject:    form.subject.value.trim(),
      message:    form.message.value.trim()
    };

    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS not loaded.');
      showMsg(errorEl);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }
      return;
    }

    try {
      await emailjs.send('service_ks9g0yn', 'template_nkwkxss', params);
      showMsg(successEl);
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showMsg(errorEl);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }
    }
  });
}

/* ----------------------------------------------------------------
   12. Footer Year
   ---------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ----------------------------------------------------------------
   13. Init — Run everything on DOMContentLoaded
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initTyped();
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initActiveNav();
  initSkillBars();
  initCountUp();
  initPortfolioFilter();
  initContactForm();
  initFooterYear();
});
