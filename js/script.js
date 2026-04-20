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

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
