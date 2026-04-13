/* =====================================================
   SmartStadium AI — Main Script
   ===================================================== */

/* ── Navbar scroll effect ───────────────────────────── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Scroll Animations (IntersectionObserver) ────────── */
const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
animatedEls.forEach(el => observer.observe(el));

/* ── Stat Counter Animation ─────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1600;
  const startTime = performance.now();

  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = eased * target;

    if (Number.isInteger(target)) {
      el.textContent = prefix + Math.round(current) + suffix;
    } else {
      el.textContent = prefix + current.toFixed(0) + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('[data-target]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counterEls.forEach(el => counterObserver.observe(el));

/* ── Crowd Level Selector ───────────────────────────── */
const crowdBtns = document.querySelectorAll('.crowd-btn');
let selectedCrowd = null;

crowdBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    crowdBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCrowd = btn.dataset.level;
  });
});

/* ── Queue Estimator Logic ──────────────────────────── */
const STALL_DATA = {
  'main': {
    name: 'Main Concession',
    emoji: '🍔',
    base: { low: 5, medium: 12, high: 22 },
    tips: {
      low:    'Great time to grab food! Main Concession is almost empty.',
      medium: 'Try West Wing Grill — only 4 min wait right now.',
      high:   'Long queue! Pre-order to seat saves ~18 minutes. Or try VIP Lounge.'
    }
  },
  'east': {
    name: 'East Wing Bar',
    emoji: '🍺',
    base: { low: 3, medium: 9, high: 17 },
    tips: {
      low:    'Perfect timing — East Wing Bar is wide open!',
      medium: 'Moderate crowd. West Wing Grill is quicker right now — 4 min.',
      high:   'Heavy traffic. Consider the VIP Lounge or pre-order delivery.'
    }
  },
  'west': {
    name: 'West Wing Grill',
    emoji: '🥩',
    base: { low: 4, medium: 7, high: 14 },
    tips: {
      low:    'West Wing Grill is nearly empty — best time to visit!',
      medium: 'Shorter wait than Main Concession. Good choice right now!',
      high:   'Crowded but still faster than Main. East Wing Bar at 8 min too.'
    }
  },
  'vip': {
    name: 'VIP Lounge',
    emoji: '⭐',
    base: { low: 2, medium: 5, high: 9 },
    tips: {
      low:    'VIP Lounge is practically empty. Enjoy premium service!',
      medium: 'VIP Lounge has the shortest wait among all stalls.',
      high:   'Even at peak hours, VIP Lounge beats all queues. Best choice!'
    }
  }
};

function getStatus(minutes) {
  if (minutes <= 6) return { label: 'Short Wait', cls: 'green' };
  if (minutes <= 14) return { label: 'Moderate Wait', cls: 'yellow' };
  return { label: 'Long Wait', cls: 'red' };
}

function getBarColor(cls) {
  const map = { green: '#22C55E', yellow: '#F59E0B', red: '#EF4444' };
  return map[cls] || '#0EA5E9';
}

function getBarWidth(minutes) {
  return Math.min((minutes / 25) * 100, 100);
}

document.getElementById('estimate-btn').addEventListener('click', () => {
  const stallKey = document.getElementById('stall-select').value;
  const crowd    = selectedCrowd;

  if (!stallKey) {
    shakeWidget('stall-select');
    return;
  }
  if (!crowd) {
    shakeWidget('crowd-group');
    return;
  }

  const stall = STALL_DATA[stallKey];
  const baseTime = stall.base[crowd];
  // Add a small random variance (±2 min) for realism
  const variance = (Math.random() * 4 - 2).toFixed(0);
  const waitTime = Math.max(1, baseTime + parseInt(variance));
  const status   = getStatus(waitTime);
  const tip      = stall.tips[crowd];

  // Animate button
  const btn = document.getElementById('estimate-btn');
  btn.textContent = '⏳ Calculating...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span class="btn-icon">⚡</span> Estimate Wait Time';
    btn.disabled = false;

    // Render result
    const resultCard = document.getElementById('result-card');
    document.getElementById('result-time-val').textContent = waitTime;
    document.getElementById('result-stall-name').textContent = `${stall.emoji} ${stall.name}`;
    document.getElementById('result-crowd').textContent = crowd.charAt(0).toUpperCase() + crowd.slice(1);
    document.getElementById('result-tip').innerHTML = `💡 <strong>AI Tip:</strong> ${tip}`;

    const badge = document.getElementById('result-badge');
    badge.className = `status-badge ${status.cls}`;
    badge.innerHTML = `<span class="status-dot"></span> ${status.label}`;

    const fill = document.getElementById('wait-bar-fill');
    fill.style.width = '0%';
    fill.style.background = getBarColor(status.cls);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = getBarWidth(waitTime) + '%';
      });
    });

    resultCard.classList.add('show');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 900);
});

function shakeWidget(id) {
  const el = document.getElementById(id);
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

/* ── Add shake keyframes dynamically ───────────────── */
const style = document.createElement('style');
style.textContent = `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}`;
document.head.appendChild(style);

/* ── Smooth scroll for anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
