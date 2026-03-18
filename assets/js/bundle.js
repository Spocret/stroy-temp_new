/* ─── particles.js ───────────────────────────────────────────────── */

function useParticles(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 120;
  const COLORS = [
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 107, b: 0 },
  ];

  let particles = [];
  let animationId = null;

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const createParticle = () => {
    const colorBase = COLORS[Math.random() < 0.75 ? 0 : 1];
    const isOrange  = colorBase.g === 107;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      r: colorBase.r, g: colorBase.g, b: colorBase.b,
      opacity: isOrange ? Math.random() * 0.3 + 0.4 : Math.random() * 0.3 + 0.2,
    };
  };

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + p.opacity + ')';
      ctx.fill();
    });
    animationId = requestAnimationFrame(loop);
  };

  resize();
  particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  loop();

  window.addEventListener('resize', function () {
    resize();
    particles.forEach(function (p) {
      p.x = Math.min(p.x, canvas.width);
      p.y = Math.min(p.y, canvas.height);
    });
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      loop();
    }
  });
}

/* ─── animations.js ──────────────────────────────────────────────── */

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function useScrollReveal() {
  var elements = document.querySelectorAll('[data-animation]');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el    = entry.target;
      var delay = parseInt(el.dataset.delay || '0', 10) * 100;
      setTimeout(function () {
        el.classList.add('is-visible');
      }, delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
}

function useCounters() {
  var statsSection = document.getElementById('stats');
  if (!statsSection) return;

  var counters = statsSection.querySelectorAll('.stats__number');
  if (!counters.length) return;

  var triggered = false;

  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting || triggered) return;
    triggered = true;
    observer.disconnect();

    counters.forEach(function (el) {
      var target   = parseInt(el.dataset.count, 10) || 0;
      var suffix   = el.dataset.suffix || '';
      var duration = 2000;
      var start    = performance.now();

      function tick(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var value    = Math.floor(easeOutQuart(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

function useParallax() {
  var hero   = document.getElementById('hero');
  var canvas = document.getElementById('particles-canvas');
  if (!hero || !canvas) return;

  var COEF = 0.03;
  var tx = 0, ty = 0, cx = 0, cy = 0;

  (function animate() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    canvas.style.transform = 'translate(' + cx + 'px,' + cy + 'px) scale(1.06)';
    requestAnimationFrame(animate);
  })();

  hero.addEventListener('mousemove', function (e) {
    var r  = hero.getBoundingClientRect();
    tx = (e.clientX - r.left - r.width  / 2) * COEF;
    ty = (e.clientY - r.top  - r.height / 2) * COEF;
  });
  hero.addEventListener('mouseleave', function () { tx = 0; ty = 0; });
}

function useCardHover() {
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.transform   = 'translateY(-8px)';
      card.style.boxShadow   = '0 16px 48px rgba(0,0,0,0.5)';
      card.style.borderColor = 'rgba(255,107,0,0.4)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform   = '';
      card.style.boxShadow   = '';
      card.style.borderColor = '';
    });
  });
}

/* ─── navigation.js ──────────────────────────────────────────────── */

function useNavScroll(nav) {
  if (!nav) return;
  function update() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function useBurger(burger, menu) {
  if (!burger || !menu) return;
  var isOpen = false;

  function open() {
    isOpen = true;
    burger.classList.add('nav__burger--active');
    menu.classList.add('menu--open');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  }
  function close() {
    isOpen = false;
    burger.classList.remove('nav__burger--active');
    menu.classList.remove('menu--open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () { isOpen ? close() : open(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });
  menu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', close);
  });

  return { close: close };
}

function useSmoothScroll(nav, closeMobileMenu) {
  var navHeight = nav ? nav.offsetHeight : 72;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href   = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (closeMobileMenu) closeMobileMenu();
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

/* ─── form.js ────────────────────────────────────────────────────── */

function usePhoneMask(input) {
  if (!input) return;

  function format(value) {
    var digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits.length) return '';
    var result = '+7';
    var rest   = digits.startsWith('7') ? digits.slice(1) : digits;
    if (!rest.length) return result;
    result += ' (' + rest.slice(0, 3);
    if (rest.length < 3) return result;
    result += ') ' + rest.slice(3, 6);
    if (rest.length < 6) return result;
    result += '-' + rest.slice(6, 8);
    if (rest.length < 8) return result;
    result += '-' + rest.slice(8, 10);
    return result;
  }

  input.addEventListener('keydown', function (e) {
    var pass = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (pass.indexOf(e.key) !== -1) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });
  input.addEventListener('input', function () {
    var pos       = input.selectionStart;
    var raw       = input.value;
    var formatted = format(raw);
    input.value   = formatted;
    var newPos    = Math.max(0, pos + (formatted.length - raw.length));
    input.setSelectionRange(newPos, newPos);
  });
  input.addEventListener('focus', function () {
    if (!input.value) input.value = '+7 (';
  });
  input.addEventListener('blur', function () {
    if (input.value === '+7 (' || input.value === '+7') input.value = '';
  });
}

function useFormValidation(form) {
  if (!form) return null;

  var rules = {
    name:    { required: true,  validate: function(v) { return v.trim().length >= 2; },                          message: 'Введите имя (минимум 2 символа)' },
    phone:   { required: true,  validate: function(v) { return v.replace(/\D/g,'').length === 11; },             message: 'Введите телефон полностью' },
    email:   { required: false, validate: function(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },   message: 'Введите корректный email' },
    message: { required: false, validate: function(v) { return !v || v.trim().length >= 5; },                    message: 'Сообщение слишком короткое' },
  };

  function getErr(field) {
    var wrap = field.closest('.field') || field.parentElement;
    var err  = wrap ? wrap.querySelector('.field__error-msg') : null;
    if (!err && wrap) {
      err = document.createElement('span');
      err.className = 'field__error-msg';
      wrap.appendChild(err);
    }
    return err;
  }

  function validateField(field) {
    var wrap = field.closest('.field') || field.parentElement;
    var rule = rules[field.name];
    if (!rule || !wrap) return true;

    var val   = field.value;
    var empty = !val.trim();
    var err   = getErr(field);

    if (empty && rule.required) {
      wrap.classList.add('field--error');
      wrap.classList.remove('field--success');
      if (err) err.textContent = 'Обязательное поле';
      return false;
    }
    if (!empty && !rule.validate(val)) {
      wrap.classList.add('field--error');
      wrap.classList.remove('field--success');
      if (err) err.textContent = rule.message;
      return false;
    }
    wrap.classList.remove('field--error');
    if (val.trim()) wrap.classList.add('field--success');
    if (err) err.textContent = '';
    return true;
  }

  var fields = form.querySelectorAll('input, textarea');
  fields.forEach(function (f) {
    f.addEventListener('blur', function () { validateField(f); });
    f.addEventListener('input', function () {
      var wrap = f.closest('.field') || f.parentElement;
      if (wrap && wrap.classList.contains('field--error')) validateField(f);
    });
  });

  return {
    validateAll: function () {
      var valid = true;
      fields.forEach(function (f) { if (!validateField(f)) valid = false; });
      return valid;
    },
    reset: function () {
      fields.forEach(function (f) {
        var wrap = f.closest('.field') || f.parentElement;
        if (wrap) { wrap.classList.remove('field--error', 'field--success'); }
        var err = getErr(f);
        if (err) err.textContent = '';
      });
    },
  };
}

function showToast(message, type) {
  type = type || 'success';
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className   = 'toast toast--' + type;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });
  });

  clearTimeout(toast._t);
  toast._t = setTimeout(function () {
    toast.classList.remove('toast--visible');
  }, 4000);
}

function useFormSubmit(form, validator) {
  if (!form) return;

  var submitBtn = form.querySelector('[type="submit"]');

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    if (on) {
      submitBtn.dataset.txt = submitBtn.textContent.trim();
      submitBtn.innerHTML =
        '<svg style="display:inline;animation:spin 0.7s linear infinite;vertical-align:middle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg> Отправка...';
    } else {
      submitBtn.textContent = submitBtn.dataset.txt || 'Отправить заявку';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validator && !validator.validateAll()) {
      showToast('Исправьте ошибки в форме', 'error');
      return;
    }
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
      form.reset();
      if (validator) validator.reset();
      showToast('Заявка отправлена! Перезвоним в течение 15 минут.', 'success');
    }, 1500);
  });
}

/* ─── main init ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {
  var nav    = document.querySelector('nav');
  var burger = document.querySelector('.nav__burger');
  var menu   = document.querySelector('.nav__links');

  useNavScroll(nav);
  var controls = useBurger(burger, menu);
  useSmoothScroll(nav, controls ? controls.close : null);

  var canvas = document.getElementById('particles-canvas');
  useParticles(canvas);
  useParallax();

  useScrollReveal();
  useCounters();
  useCardHover();

  var form  = document.getElementById('contact-form');
  var phone = form ? form.querySelector('[name="phone"]') : null;
  usePhoneMask(phone);
  var validator = useFormValidation(form);
  useFormSubmit(form, validator);
});
