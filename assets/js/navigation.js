function useNavScroll(nav) {
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function useBurger(burger, menu) {
  if (!burger || !menu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    burger.classList.add('nav__burger--active');
    menu.classList.add('menu--open');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    isOpen = false;
    burger.classList.remove('nav__burger--active');
    menu.classList.remove('menu--open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  });

  return { close };
}

function useSmoothScroll(nav, closeMobileMenu) {
  const anchors = document.querySelectorAll('a[href^="#"]');
  const navHeight = nav ? nav.offsetHeight : 72;

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      if (closeMobileMenu) closeMobileMenu();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
}

export { useNavScroll, useBurger, useSmoothScroll };
