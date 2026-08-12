document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar background on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    backToTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Testimonial dots (mobile carousel) ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (track && dotsWrap) {
    const cards = track.querySelectorAll('.testimonial-card');
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const card = cards[i];
        track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('button');
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let closestIdx = 0, closestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
          if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === closestIdx));
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Hero search box (demo behaviour) ---------- */
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    const validators = {
      fullName: v => v.trim().length > 1,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: v => v.trim().replace(/\D/g, '').length >= 7,
      message: v => v.trim().length > 4,
    };

    const validateField = (field) => {
      const name = field.name;
      const wrapper = field.closest('.form-field');
      if (!wrapper) return true;
      if (validators[name]) {
        const valid = validators[name](field.value);
        wrapper.classList.toggle('invalid', !valid);
        return valid;
      }
      return true;
    };

    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const wrapper = field.closest('.form-field');
        if (wrapper && wrapper.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        const firstInvalid = form.querySelector('.form-field.invalid input, .form-field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        successMsg.classList.remove('show');
        return;
      }

      successMsg.classList.add('show');
      form.reset();
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
