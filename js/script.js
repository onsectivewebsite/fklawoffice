// Mark html as JS-ready immediately so CSS can safely activate reveal animations.
// Without this, .reveal / .stagger initial states stay hidden if JS fails to run.
document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links && links.classList.remove('open'));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => observer.observe(el));

  // Animate numeric stats up from 0 once visible
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isInt = Number.isInteger(target);
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = prefix + (isInt ? Math.round(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isInt ? target : target.toFixed(1)) + suffix;
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-target]').forEach(el => {
    el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
    countObserver.observe(el);
  });

  // Duplicate marquee content for seamless looping
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  // Contact form -> mailto
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent(`Inquiry from ${data.name || 'Website Visitor'}`);
      const body = encodeURIComponent(
        `Name: ${data.name || ''}\n` +
        `Email: ${data.email || ''}\n` +
        `Phone: ${data.phone || ''}\n` +
        `Matter: ${data.matter || ''}\n\n` +
        `${data.message || ''}`
      );
      window.location.href = `mailto:info@fklawoffice.com?subject=${subject}&body=${body}`;
      if (status) {
        status.textContent = 'Opening your email client — if nothing happens, please email info@fklawoffice.com directly.';
        status.style.color = 'var(--color-accent)';
      }
    });
  }
});
