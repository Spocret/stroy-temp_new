import { useScrollReveal, useCounters, useParallax, useCardHover } from './animations.js';
import { usePhoneMask, useFormValidation, useFormSubmit } from './form.js';
import { useNavScroll, useBurger, useSmoothScroll } from './navigation.js';
import { useParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');
  const canvas = document.getElementById('particlesCanvas');
  const contactForm = document.getElementById('contactForm');
  const phoneInput = document.getElementById('formPhone');

  useParticles(canvas);

  useNavScroll(nav);
  const burgerControls = useBurger(burger, navMenu);
  useSmoothScroll(nav, burgerControls ? burgerControls.close : null);

  useScrollReveal();
  useCounters();
  useParallax();
  useCardHover();

  usePhoneMask(phoneInput);
  const validator = useFormValidation(contactForm);
  useFormSubmit(contactForm, validator);

  const orderButtons = document.querySelectorAll('.catalog__card-btn');
  orderButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return;
      const navHeight = nav ? nav.offsetHeight : 72;
      const top = contactSection.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        const nameInput = document.getElementById('formName');
        if (nameInput) nameInput.focus();
      }, 600);
    });
  });
});
