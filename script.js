/* =======================================================================
   Nagel — interactions
   ======================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ------------------------- Theme (light/dark) ---------------------- */
  var STORAGE_KEY = 'nagel-theme';
  var toggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#070b14' : '#2563eb');
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  /* ------------------------- Mobile navigation ----------------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var backdrop = document.getElementById('navBackdrop');

  function setMenu(open) {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      setMenu(!mobileNav.classList.contains('open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ------------------------- Header on scroll + progress ------------- */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------- Scroll reveal --------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------- Animated counters ----------------------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimal = el.getAttribute('data-decimal') === 'true';
    var start = performance.now();
    var dur = 1400;

    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      if (decimal) {
        el.textContent = (val / 10).toFixed(1).replace('.', ',');
      } else {
        el.textContent = Math.round(val).toLocaleString('pl-PL') + suffix;
      }
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ------------------------- FAQ (single-open) ----------------------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ------------------------- Contact form ---------------------------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name;
      var phone = form.phone;
      var email = form.email;
      var consent = document.getElementById('consent');
      var ok = true;

      [name, phone, email].forEach(function (f) {
        var invalid = !f.value.trim() || (f === email && !isEmail(email.value));
        f.classList.toggle('invalid', invalid);
        if (invalid) ok = false;
      });

      if (!consent.checked) ok = false;

      if (!ok) {
        note.textContent = 'Uzupełnij wymagane pola i zaznacz zgodę.';
        note.className = 'form-note err';
        return;
      }

      // POC: no backend — simulate success.
      note.textContent = 'Dziękujemy! Twoje zapytanie zostało wysłane. Odezwiemy się w ciągu 24 godzin.';
      note.className = 'form-note ok';
      form.reset();
    });

    form.querySelectorAll('input').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('invalid'); });
    });
  }

  /* ------------------------- Footer year ----------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
