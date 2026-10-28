/* Tzeriz Consultant – interactions.
   Progressive enhancement only: every page is complete and readable without this file. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  window.TZ_READY = true;

  // Opening curtain (home page, once per visit), then the page entrance
  var pageReady = function () { doc.classList.add('is-ready'); };
  var curtain = document.querySelector('.curtain');
  if (curtain && doc.classList.contains('has-intro')) {
    var lifted = false;
    var lift = function () {
      if (lifted) return;
      lifted = true;
      doc.classList.add('intro-done');
      setTimeout(pageReady, 280);
      setTimeout(function () { doc.classList.remove('has-intro'); }, 1400);
    };
    setTimeout(lift, 1700);
    curtain.addEventListener('click', lift);
  } else {
    requestAnimationFrame(function () { requestAnimationFrame(pageReady); });
  }

  // Header: solid once scrolled, tucked away while reading down, back on scroll up
  var header = document.querySelector('.site-header');
  var lastY = window.pageYOffset;
  var updateHeader = function (y) {
    if (!header) return;
    header.classList.toggle('is-scrolled', y > 24);
    if (Math.abs(y - lastY) > 6) {
      header.classList.toggle('is-hidden', y > lastY && y > 520 && !doc.classList.contains('menu-open'));
      lastY = y;
    }
  };
  if (header) header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  // Parallax on painted backgrounds: each layer drifts relative to its parent
  var layers = reduceMotion ? [] : document.querySelectorAll('[data-parallax]');
  var updateParallax = function () {
    var vh = window.innerHeight;
    each(layers, function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      var shift = (box.top + box.height / 2 - vh / 2) * -speed;
      el.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    });
  };

  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateHeader(window.pageYOffset);
      updateParallax();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Full-screen navigation on small screens
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('.nav-toggle__label');
    var setMenu = function (open) {
      doc.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Close' : 'Menu';
      if (open && header) header.classList.remove('is-hidden');
    };
    toggle.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
    var desktop = window.matchMedia('(min-width: 1025px)');
    var closeOnDesktop = function () { if (desktop.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
    else desktop.addListener(closeOnDesktop);
  }

  // Reveal on scroll; children of [data-stagger] follow one another
  each(document.querySelectorAll('[data-stagger]'), function (group) {
    each(group.children, function (child, i) { child.style.setProperty('--d', (i * 0.09).toFixed(2) + 's'); });
  });
  var targets = document.querySelectorAll('.reveal, [data-stagger] > *, [data-observe]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    each(targets, function (el) { io.observe(el); });
  } else {
    each(targets, function (el) { el.classList.add('is-in'); });
  }

  // "How can we help you?" finder
  var finder = document.getElementById('finder');
  if (finder) {
    finder.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('finder-need').value;
      if (v) window.location.href = v;
    });
  }

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Contact form
  // To connect the form, set data-endpoint on the <form> to a form service URL
  // (for example Formspree: https://formspree.io/f/xxxxxxx). See README.
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-note');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var endpoint = form.getAttribute('data-endpoint');
      note.hidden = false;
      if (!endpoint) {
        note.textContent = 'Our online form is not yet active. Please write to us directly at contact@tzeriz-consultant.com.';
        return;
      }
      note.textContent = 'Sending your message…';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('send failed');
          form.reset();
          note.textContent = 'Thank you. Your message has reached us and a member of the firm will reply within one working day.';
        })
        .catch(function () {
          note.textContent = 'Your message could not be sent. Please try again, or write to us at contact@tzeriz-consultant.com.';
        });
    });
  }
})();
