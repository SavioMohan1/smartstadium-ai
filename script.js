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
  'main': { name: 'Main Concession', emoji: '🍔' },
  'east': { name: 'East Wing Bar', emoji: '🍺' },
  'west': { name: 'West Wing Grill', emoji: '🥩' },
  'vip':  { name: 'VIP Lounge', emoji: '⭐' }
};

// ── Gemini AI Configuration ──────────────────────────
// PASTE YOUR API KEY HERE
const GEMINI_API_KEY = 'REPLACE_WITH_YOUR_GEMINI_API_KEY';

async function getGeminiWaitTime(stall, crowd) {
  const prompt = `You are the SmartStadium AI engine. Estimate the wait time for the ${stall} stall with a ${crowd} crowd.
  Return ONLY a raw JSON object with these keys: 
  {
    "minutes": number,
    "statusLabel": "Short Wait" | "Moderate Wait" | "Long Wait",
    "statusClass": "green" | "yellow" | "red",
    "tip": "one short clever stadium routing tip under 15 words"
  }
  Be realistic. Short is <7 min, Moderate is 7-15 min, Long is >15 min.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    // Strip potential markdown code blocks
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Gemini API Error, falling back to local logic:', err);
    return null;
  }
}

function getLocalFallback(stallKey, crowd) {
  const baseData = {
    'main': { low: 5, medium: 12, high: 22 },
    'east': { low: 3, medium: 9, high: 17 },
    'west': { low: 4, medium: 7, high: 14 },
    'vip':  { low: 2, medium: 5, high: 9 }
  };
  const baseTime = baseData[stallKey][crowd];
  const variance = Math.floor(Math.random() * 5 - 2);
  const waitTime = Math.max(1, baseTime + variance);

  if (waitTime <= 7) return { minutes: waitTime, statusLabel: 'Short Wait', statusClass: 'green', tip: 'Great time! Grab your food now before the next play.' };
  if (waitTime <= 15) return { minutes: waitTime, statusLabel: 'Moderate Wait', statusClass: 'yellow', tip: 'Try West Wing Grill — it usually has a 4 min shorter wait.' };
  return { minutes: waitTime, statusLabel: 'Long Wait', statusClass: 'red', tip: 'Peak traffic! Pre-order to your seat via the app to save 18 mins.' };
}

function getBarColor(cls) {
  const map = { green: '#22C55E', yellow: '#F59E0B', red: '#EF4444' };
  return map[cls] || '#0EA5E9';
}

function getBarWidth(minutes) {
  return Math.min((minutes / 25) * 100, 100);
}

document.getElementById('estimate-btn').addEventListener('click', async () => {
  const stallKey = document.getElementById('stall-select').value;
  const crowd    = selectedCrowd;

  if (!stallKey) { shakeWidget('stall-select'); return; }
  if (!crowd) { shakeWidget('crowd-group'); return; }

  const btn = document.getElementById('estimate-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="status-dot"></span> AI Thinking...';
  btn.disabled = true;

  // 1. Try Gemini
  let result = await getGeminiWaitTime(STALL_DATA[stallKey].name, crowd);
  
  // 2. Fallback if Gemini fails or Key is missing
  if (!result || GEMINI_API_KEY === 'REPLACE_WITH_YOUR_GEMINI_API_KEY') {
    await new Promise(r => setTimeout(r, 800)); // Sim mimic
    result = getLocalFallback(stallKey, crowd);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;

  // Render
  const resultCard = document.getElementById('result-card');
  document.getElementById('result-time-val').textContent = result.minutes;
  document.getElementById('result-stall-name').textContent = `${STALL_DATA[stallKey].emoji} ${STALL_DATA[stallKey].name}`;
  document.getElementById('result-crowd').textContent = crowd.charAt(0).toUpperCase() + crowd.slice(1);
  document.getElementById('result-tip').innerHTML = `💡 <strong>AI Tip:</strong> ${result.tip}`;

  const badge = document.getElementById('result-badge');
  badge.className = `status-badge ${result.statusClass}`;
  badge.innerHTML = `<span class="status-dot"></span> ${result.statusLabel}`;

  const fill = document.getElementById('wait-bar-fill');
  fill.style.width = '0%';
  fill.style.background = getBarColor(result.statusClass);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.width = getBarWidth(result.minutes) + '%';
    });
  });

  resultCard.classList.add('show');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
