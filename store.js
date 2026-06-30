// TriScreen IL - Store JavaScript

// ===== COUNTDOWN TIMER =====
(function startCountdown() {
  const HOURS = 23, MINS = 47, SECS = 12;
  let total = HOURS * 3600 + MINS * 60 + SECS;

  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMinutes');
  const sEl = document.getElementById('cdSeconds');

  function tick() {
    if (total <= 0) { total = 86399; }
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
    total--;
  }

  tick();
  setInterval(tick, 1000);
})();

// ===== STOCK COUNTER (fake urgency, realistic) =====
(function stockCounter() {
  const el = document.getElementById('stockCount');
  if (!el) return;
  let stock = parseInt(el.textContent) || 7;
  setInterval(() => {
    if (stock > 2 && Math.random() < 0.15) {
      stock--;
      el.textContent = stock;
      el.style.color = stock <= 3 ? '#ef4444' : '#ff6b35';
    }
  }, 45000);
})();

// ===== STICKY HEADER SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// ===== FAQ TOGGLE =====
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ===== ORDER FORM SUBMISSION =====
function submitOrder(e) {
  e.preventDefault();

  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const qty = document.getElementById('quantity').value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value;

  if (!name || !phone || !email || !address) {
    alert('נא למלא את כל השדות החובה');
    return;
  }

  const phoneRegex = /^0[5-9]\d{8}$|^0[5-9]\d-\d{7}$/;
  if (!phoneRegex.test(phone.replace(/-/g, ''))) {
    alert('מספר טלפון לא תקין');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; שולח הזמנה...';
  btn.disabled = true;

  // Simulate order submission (replace with real API call)
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;

    // Log order data (replace with real backend call)
    console.log('New Order:', { name, phone, email, address, qty, payment });

    showSuccessModal();
    document.getElementById('orderForm').reset();
  }, 1500);
}

function showSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('successModal');
  if (e.target === modal) closeModal();
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ANIMATE ON SCROLL (simple intersection observer) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .review-card, .usecase-card, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
