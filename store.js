// TriScreen IL — Store Logic

// ===== NAV: switch to dark mode over hero =====
(function navTheme() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('dark', entry.isIntersecting);
    },
    { threshold: 0.1 }
  );

  const hero = document.querySelector('.hero');
  if (hero) observer.observe(hero);
})();

// ===== REVEAL ON SCROLL =====
(function revealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = (e.target.dataset.revealDelay || 0);
          setTimeout(() => e.target.classList.add('visible'), delay);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el, i) => {
    el.dataset.revealDelay = i * 60;
    io.observe(el);
  });
})();

// ===== PAYMENT TABS =====
document.querySelectorAll('.pay-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== ORDER FORM =====
function submitOrder(e) {
  e.preventDefault();

  const fields = {
    name: document.getElementById('fullName')?.value.trim(),
    phone: document.getElementById('phone')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    address: document.getElementById('address')?.value.trim(),
  };

  if (!fields.name || !fields.phone || !fields.email || !fields.address) {
    shakeForm();
    return;
  }

  const phoneClean = fields.phone.replace(/[-\s]/g, '');
  if (!/^0[5-9]\d{8}$/.test(phoneClean)) {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.style.borderColor = '#ff3b30';
      phoneInput.focus();
      setTimeout(() => { phoneInput.style.borderColor = ''; }, 2000);
    }
    return;
  }

  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.textContent = '...שולח';
    btn.classList.add('loading');
  }

  const qty = parseInt(document.getElementById('quantity')?.value || '1', 10);
  const value = qty === 1 ? 1099 : 1999;

  // Simulate API call — replace with real endpoint
  setTimeout(() => {
    if (btn) {
      btn.textContent = 'הזמן עכשיו';
      btn.classList.remove('loading');
    }
    console.log('Order:', fields);

    // Facebook Pixel Purchase event
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', { value, currency: 'ILS', content_name: 'TriScreen Pro 15.6' });
    }
    // TikTok Pixel Purchase event
    if (typeof ttq !== 'undefined') {
      ttq.track('PlaceAnOrder', { value, currency: 'ILS' });
    }
    // Google Analytics Purchase event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', { value, currency: 'ILS', transaction_id: Date.now() });
    }

    e.target.reset();
    showModal();
  }, 1400);
}

function shakeForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  form.style.animation = 'none';
  requestAnimationFrame(() => {
    form.style.animation = 'shake 0.4s ease';
  });
}

// Inject shake keyframes once
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-6px)}
  75%{transform:translateX(6px)}
}`;
document.head.appendChild(shakeStyle);

// ===== MODAL =====
function showModal() {
  const m = document.getElementById('successModal');
  if (m) m.classList.add('active');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('successModal')) return;
  const m = document.getElementById('successModal');
  if (m) m.classList.remove('active');
}

// ESC to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal({ target: document.getElementById('successModal') });
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 50;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== MOBILE BAR: hide when order section visible =====
(function hideMobileBarAtOrder() {
  const bar = document.getElementById('mobileBar');
  const order = document.getElementById('order');
  if (!bar || !order) return;

  const io = new IntersectionObserver(
    ([entry]) => { bar.style.display = entry.isIntersecting ? 'none' : ''; },
    { threshold: 0.1 }
  );
  io.observe(order);
})();
