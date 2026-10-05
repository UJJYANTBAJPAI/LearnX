'use strict';
/* LearnX shared code: storage, theme, mock API layer, app shell */

const LX = {
  get(key, fallback = null) { try { return JSON.parse(localStorage.getItem('lx_' + key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem('lx_' + key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem('lx_' + key); }
};
const wait = ms => new Promise(res => setTimeout(res, ms));

// Theme is applied immediately to avoid a flash of the wrong mode.
document.documentElement.dataset.theme = LX.get('theme', 'light');
function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  LX.set('theme', next);
}

// ---------- Mock API layer: each function mirrors a future REST endpoint ----------
async function loginUser({ email, password }) {
  // Replace mock implementation with backend API call: POST /api/auth/login
  await wait(400);
  const user = LX.get('user') || { name: email.split('@')[0], email, level: 'Beginner', goal: 'Learn Data Structures & Algorithms', joined: new Date().toISOString() };
  LX.set('user', user); LX.set('token', 'demo-jwt-token');
  return { token: 'demo-jwt-token', user };
}
async function registerUser(data) {
  // Replace mock implementation with backend API call: POST /api/auth/register
  await wait(400);
  const user = { name: data.name, email: data.email, level: data.level, goal: data.goal, joined: new Date().toISOString() };
  LX.set('user', user); LX.set('token', 'demo-jwt-token');
  return { token: 'demo-jwt-token', user };
}
async function sendAIMessage(message, history = []) {
  // Replace mock implementation with backend API call: POST /api/ai/chat (Gemini / Groq)
  await wait(700);
  const q = message.toLowerCase();
  let reply = `Here is a simple way to think about "${message}":\n\n1. Start with the core idea.\n2. Work through one small example.\n3. Practice with two or three questions.\n\nWant me to turn this into notes or a short quiz?`;
  if (q.includes('binary search')) reply = 'Binary search finds an item in a sorted array by halving the search range each step.\n\n1. Compare the target with the middle element.\n2. If smaller, search the left half; if larger, the right half.\n3. Stop when found or the range is empty.\n\nTime complexity: O(log n).';
  else if (q.includes('normalization')) reply = 'Normalization reduces redundancy in a database.\n\n• 1NF: atomic values only\n• 2NF: no partial dependency on a composite key\n• 3NF: no transitive dependency\n• BCNF: every determinant is a candidate key';
  else if (q.includes('operating system')) reply = 'Operating Systems notes:\n\n• Processes and threads\n• CPU scheduling (FCFS, SJF, Round Robin)\n• Memory management (paging, segmentation)\n• Deadlocks and synchronization\n• File systems';
  else if (q.includes('java')) reply = 'Java interview questions:\n\n1. Difference between JDK, JRE and JVM?\n2. How does HashMap work internally?\n3. Explain overloading vs overriding.\n4. What is the Java memory model?\n5. Checked vs unchecked exceptions?';
  return { reply };
}
async function getProgress() {
  // Replace mock implementation with backend API call: GET /api/progress
  await wait(150);
  return { studyHours: 12.5, quizAverage: 82, topicsCompleted: 18, streak: 7 };
}

// ---------- App shell (sidebar + topbar) ----------
const ICONS = {
  home: 'M3 11l9-8 9 8v10H3z', chat: 'M4 4h16v12H8l-4 4z', map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z',
  cal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4', quiz: 'M9 9a3 3 0 116 0c0 2-3 2-3 4M12 17v.5M12 3a9 9 0 100 18 9 9 0 000-18z',
  file: 'M6 3h9l4 4v14H6zM14 3v5h5', book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM6 19h13', chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2', user: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-6 8-6s8 2 8 6',
  bell: 'M6 16v-5a6 6 0 1112 0v5l2 2H4zM10 21h4', sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2', menu: 'M4 6h16M4 12h16M4 18h16',
  send: 'M4 12l16-8-6 16-3-6z', spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z', target: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8',
  check: 'M5 12l5 5 9-10', flame: 'M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z', logout: 'M9 4H4v16h5M16 8l4 4-4 4M20 12H9',
  cog: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3'
};
const icon = (name, size = 20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

// ready:false pages render disabled until their file exists (flip to true when added).
const NAV = [
  { file: 'dashboard.html', label: 'Dashboard', icon: 'home', ready: true },
  { file: 'ai-tutor.html', label: 'AI Tutor', icon: 'chat', ready: true },
  { file: 'roadmap.html', label: 'Learning Roadmap', icon: 'map', ready: false },
  { file: 'study-planner.html', label: 'Study Planner', icon: 'cal', ready: false },
  { file: 'quiz.html', label: 'Adaptive Quiz', icon: 'quiz', ready: false },
  { file: 'pdf-summarizer.html', label: 'PDF Summarizer', icon: 'file', ready: false },
  { file: 'resources.html', label: 'Resources', icon: 'book', ready: false },
  { file: 'progress.html', label: 'Progress', icon: 'chart', ready: false },
  { file: 'history.html', label: 'History', icon: 'clock', ready: false },
  { file: 'profile.html', label: 'Profile', icon: 'user', ready: false }
];
const NOTIFICATIONS = ["Time for today's revision.", 'Your DSA quiz is ready.', 'You completed your weekly learning goal.', 'AI recommends revising Graph Algorithms.'];

function logout() { LX.remove('token'); location.href = 'login.html'; }

function renderShell() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const user = LX.get('user', { name: 'Student' });
  const links = NAV.map(n => n.ready
    ? `<a class="nav-link ${n.file === page ? 'active' : ''}" href="${n.file}">${icon(n.icon)}<span>${n.label}</span></a>`
    : `<span class="nav-link disabled" title="Coming soon">${icon(n.icon)}<span>${n.label}</span></span>`).join('');
  document.getElementById('sidebar').innerHTML = `
    <a class="logo" href="index.html"><b>L</b><span>LearnX</span></a>${links}<div class="spacer"></div>
    <button class="nav-link" id="collapseBtn">${icon('menu')}<span>Collapse</span></button>
    <span class="nav-link disabled" title="Coming soon">${icon('cog')}<span>Settings</span></span>
    <button class="nav-link" id="logoutBtn">${icon('logout')}<span>Logout</span></button>`;
  const top = document.getElementById('topbar');
  top.innerHTML = `
    <div class="tools"><button class="icon-btn" id="menuBtn" aria-label="Open menu">${icon('menu')}</button>
      <div><h1>${top.dataset.title}</h1><p class="muted">${top.dataset.sub}</p></div></div>
    <div class="tools">
      <input class="input search" id="globalSearch" placeholder="Ask or search…" aria-label="Search">
      <div class="dropdown"><button class="icon-btn" id="bellBtn" aria-label="Notifications">${icon('bell')}<i class="dot"></i></button>
        <ul class="card panel" id="notifPanel">${NOTIFICATIONS.map(n => `<li>${n}</li>`).join('')}</ul></div>
      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">${icon('sun')}</button>
      <div class="avatar" title="${user.name}">${user.name[0].toUpperCase()}</div></div>`;
  const $ = id => document.getElementById(id);
  $('logoutBtn').onclick = logout;
  $('collapseBtn').onclick = () => document.querySelector('.app').classList.toggle('collapsed');
  $('menuBtn').onclick = () => $('sidebar').classList.toggle('open');
  $('bellBtn').onclick = () => { $('notifPanel').classList.toggle('open'); document.querySelector('.dot')?.remove(); };
  $('globalSearch').onkeydown = e => { if (e.key === 'Enter' && e.target.value.trim()) location.href = 'ai-tutor.html?q=' + encodeURIComponent(e.target.value.trim()); };
}

function injectAmbientBackground() {
  if (document.querySelector('.bg-ambient')) return;
  const bg = document.createElement('div');
  bg.className = 'bg-ambient';
  bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML = '<div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div><div class="bg-grid"></div>';
  document.body.prepend(bg);
}

function initHeroCarousel() {
  const card = document.querySelector('.hero-carousel-card');
  if (!card) return;
  const track = card.querySelector('.carousel-track');
  const slides = Array.from(card.querySelectorAll('.carousel-slide'));
  const dots = Array.from(card.querySelectorAll('.dot-btn'));
  const prevBtn = card.querySelector('.prev-btn');
  const nextBtn = card.querySelector('.next-btn');

  let currentIndex = 0;
  let timer = null;

  function updateSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === currentIndex));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(() => updateSlide(currentIndex + 1), 4000);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { updateSlide(currentIndex - 1); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { updateSlide(currentIndex + 1); startAutoPlay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide, 10);
      updateSlide(slideIndex);
      startAutoPlay();
    });
  });

  card.addEventListener('mouseenter', stopAutoPlay);
  card.addEventListener('mouseleave', startAutoPlay);

  updateSlide(0);
  startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
  injectAmbientBackground();
  initHeroCarousel();
  if (document.body.dataset.protected && !LX.get('token')) { location.href = 'login.html'; return; }
  if (document.getElementById('sidebar')) renderShell();
  document.querySelectorAll('[data-i]').forEach(el => { el.innerHTML = icon(el.dataset.i); });
  document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', toggleTheme));
});


