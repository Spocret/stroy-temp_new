function useScrollReveal() {
  const elements = document.querySelectorAll('[data-animation]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('is-visible');
      }, delay);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach((el) => observer.observe(el));
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function useCounters() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll('.stats__number');
  if (!counters.length) return;

  let triggered = false;

  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(easedProgress * target);
      el.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        counters.forEach((counter) => runCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

function useParallax() {
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('particles-canvas');
  if (!hero || !canvas) return;

  const COEFFICIENT = 0.03;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  const animate = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    canvas.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.06)`;
    rafId = requestAnimationFrame(animate);
  };

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = (e.clientX - rect.left - centerX) * COEFFICIENT;
    const offsetY = (e.clientY - rect.top - centerY) * COEFFICIENT;
    targetX = offsetX;
    targetY = offsetY;
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  animate();
}

function useCardHover() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.5)';
      card.style.borderColor = 'rgba(255, 107, 0, 0.4)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
    });
  });
}

export { useScrollReveal, useCounters, useParallax, useCardHover };
