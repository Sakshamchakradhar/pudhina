/* =========================================================
   for Momo — script.js
   No frameworks. Just love and event listeners.
   ========================================================= */

/* ---------- helpers ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, ms = 2600) {
  const toast = $('#egg-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), ms);
}

/* =========================================================
   FLOATING HEARTS / SPARKLES (ambient background layer)
   ========================================================= */
const floatLayer = $('#floating-layer');
const floatIcons = ['💗','✨','🌸','⭐','💫','🩷'];
function spawnFloaty() {
  const el = document.createElement('div');
  el.className = 'floaty';
  el.textContent = floatIcons[Math.floor(Math.random() * floatIcons.length)];
  const size = 12 + Math.random() * 18;
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = size + 'px';
  el.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
  const duration = 9 + Math.random() * 10;
  el.style.animationDuration = duration + 's';
  floatLayer.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 200);
}
setInterval(spawnFloaty, 900);
for (let i = 0; i < 6; i++) setTimeout(spawnFloaty, i * 300);

/* =========================================================
   CURSOR GLOW + TRAIL
   ========================================================= */
const glow = $('#cursor-glow');
let lastTrail = 0;
window.addEventListener('mousemove', (e) => {
  glow.style.opacity = '1';
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';

  const now = Date.now();
  if (now - lastTrail > 60) {
    lastTrail = now;
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    document.body.appendChild(dot);
    dot.animate(
      [{ transform: 'scale(1)', opacity: .6 }, { transform: 'scale(.2)', opacity: 0 }],
      { duration: 600, easing: 'ease-out' }
    ).onfinish = () => dot.remove();
  }
});
window.addEventListener('mouseleave', () => (glow.style.opacity = '0'));

/* =========================================================
   INTRO -> APP TRANSITION
   ========================================================= */
const introScreen = $('#intro');
const app = $('#app');

$('#open-btn').addEventListener('click', () => {
  introScreen.classList.add('leaving');
  burstHeartsAt(window.innerWidth / 2, window.innerHeight / 2, 18);
  setTimeout(() => {
    introScreen.style.display = 'none';
    app.classList.remove('hidden');
    requestAnimationFrame(() => app.classList.add('visible'));
    initScrollObservers();
  }, 750);
});

/* =========================================================
   NAVIGATION between pages
   ========================================================= */
const navLinks = $$('.nav-links a');
const miniCards = $$('.mini-nav-card');
const pages = $$('.page');

function goToPage(target) {
  pages.forEach(p => p.classList.toggle('active', p.id === target));
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === target));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#nav-links').classList.remove('open');

  if (target === 'letter') animateLetter();
  if (target === 'final') startFinalSequence();
}

navLinks.forEach(a => a.addEventListener('click', (e) => {
  e.preventDefault();
  goToPage(a.dataset.target);
}));
miniCards.forEach(c => c.addEventListener('click', () => goToPage(c.dataset.target)));

$('#nav-toggle').addEventListener('click', () => $('#nav-links').classList.toggle('open'));

/* =========================================================
   LETTER PAGE — line-by-line reveal
   ========================================================= */
let letterAnimated = false;
function animateLetter() {
  if (letterAnimated) return;
  letterAnimated = true;
  const lines = $$('.letter-text');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('shown'), i * 550);
  });
}

/* =========================================================
   SCROLL-TRIGGERED REVEALS (memories, sorry notes, timeline)
   ========================================================= */
function initScrollObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.2 });

  $$('.polaroid, .sticky-note, .timeline-item').forEach(el => observer.observe(el));
}

/* =========================================================
   SMILE PAGE — "still angry" button
   ========================================================= */
const funnyMessages = [
  '🐼 Momo.exe is still angry... recalculating.',
  '🍜 Loading forgiveness... 42%.',
  "🥺 Error 404: Anger too cute to be taken seriously.",
  "😂 This website refuses to believe you're permanently angry.",
  '✨ Smile detected? No? Try again.',
  '💫 Recounting reasons you like me... this may take a while.',
  '🐼 Anger levels: high. Cuteness levels: also high. Confusing.',
  '🍑 Momo, deploying emergency noodles.',
  '🌸 Scanning... scanning... you almost smiled just now.',
  '😤 Achievement unlocked: professional grudge-holder.',
];
let smileTaps = 0;
const emojiOptions = ['💗','✨','🐼','🍜','🌸','😂','⭐','🩷','💫'];

$('#angry-btn').addEventListener('click', (e) => {
  smileTaps++;
  const msgEl = $('#smile-message');
  const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  msgEl.textContent = msg;
  msgEl.animate(
    [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 400, easing: 'ease-out' }
  );

  const rect = e.target.getBoundingClientRect();
  burstEmojisAt(rect.left + rect.width / 2, rect.top);

  if (smileTaps >= 6) {
    msgEl.textContent = "🏳️ okay okay you win. I'm still sorry though.";
  }
});

function burstEmojisAt(x, y) {
  const container = $('#emoji-burst');
  const containerRect = container.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const piece = document.createElement('span');
    piece.className = 'burst-piece';
    piece.textContent = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
    piece.style.left = (x - containerRect.left) + 'px';
    piece.style.top = (y - containerRect.top) + 'px';
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 120;
    piece.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    piece.style.setProperty('--ty', Math.sin(angle) * dist - 40 + 'px');
    piece.style.setProperty('--rot', (Math.random() * 480 - 240) + 'deg');
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 1150);
  }
}

/* =========================================================
   FINAL PAGE — typewriter + constellation + confetti finale
   ========================================================= */
let finalStarted = false;
function startFinalSequence() {
  if (finalStarted) return;
  finalStarted = true;

  const lines = $$('.type-line');
  let delay = 300;
  lines.forEach((line) => {
    setTimeout(() => {
      line.classList.add('typing');
      setTimeout(() => line.classList.add('done'), 1650);
    }, delay);
    delay += 1500;
  });

  setTimeout(() => {
    $('#final-btn').classList.remove('hidden');
    drawConstellation();
  }, delay + 200);
}

function drawConstellation() {
  const wrap = $('#constellation');
  const w = wrap.clientWidth, h = wrap.clientHeight;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute'; svg.style.inset = '0';

  // simple heart-shaped constellation points
  const pts = [];
  for (let t = 0; t < Math.PI * 2; t += 0.5) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    pts.push([w/2 + x * (w*0.02), h/2 + y * (h*0.02) - h*0.05]);
  }
  pts.forEach(([x, y], i) => {
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 2.4);
    c.setAttribute('fill', '#f4e9ff');
    c.style.opacity = '0';
    c.style.animation = `twinkle 2s ease-in-out ${i * 0.08}s forwards`;
    svg.appendChild(c);
    if (i > 0) {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', pts[i-1][0]); line.setAttribute('y1', pts[i-1][1]);
      line.setAttribute('x2', x); line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(232,136,181,.4)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }
  });
  wrap.appendChild(svg);
}

$('#final-btn').addEventListener('click', () => {
  launchConfettiFinale();
  for (let i = 0; i < 30; i++) setTimeout(spawnFloaty, i * 40);
});

/* =========================================================
   CONFETTI (canvas)
   ========================================================= */
const canvas = $('#confetti-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = ['#c9bbf0', '#ffc9de', '#ffe1c9', '#a78bda', '#fffaf7'];
function launchConfettiFinale() {
  const pieces = [];
  const shapes = ['heart', 'square', 'circle'];
  for (let i = 0; i < 160; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 6 + Math.random() * 8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      vy: 2 + Math.random() * 3,
      vx: Math.random() * 2 - 1,
      rot: Math.random() * Math.PI,
      vr: Math.random() * 0.2 - 0.1,
      life: 0,
    });
  }
  let frame = 0;
  const maxFrames = 420;
  function drawPiece(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'circle') {
      ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
    } else if (p.shape === 'heart') {
      ctx.beginPath();
      const s = p.size / 12;
      ctx.moveTo(0, 3 * s);
      ctx.bezierCurveTo(0, 0, -6 * s, 0, -6 * s, -3 * s);
      ctx.bezierCurveTo(-6 * s, -6 * s, 0, -6 * s, 0, -2 * s);
      ctx.bezierCurveTo(0, -6 * s, 6 * s, -6 * s, 6 * s, -3 * s);
      ctx.bezierCurveTo(6 * s, 0, 0, 0, 0, 3 * s);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }
    ctx.restore();
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      drawPiece(p);
    });
    frame++;
    if (frame < maxFrames) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  tick();
}

/* burst of hearts from a point (used on "Open It") */
function burstHeartsAt(x, y, count = 14) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'floaty';
      el.textContent = ['💗','✨','🌸'][Math.floor(Math.random() * 3)];
      el.style.left = x + (Math.random() * 200 - 100) + 'px';
      el.style.bottom = (window.innerHeight - y) + 'px';
      el.style.fontSize = (14 + Math.random() * 16) + 'px';
      el.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      el.style.animationDuration = '5s';
      floatLayer.appendChild(el);
      setTimeout(() => el.remove(), 5200);
    }, i * 40);
  }
}

/* =========================================================
   MUSIC TOGGLE — gentle generated ambient tone (no external files needed)
   ========================================================= */
let audioCtx, musicNodes, musicPlaying = false;
function startAmbientMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [261.6, 329.6, 392.0, 440.0]; // C E G A - soft major feel
  const master = audioCtx.createGain();
  master.gain.value = 0.05;
  master.connect(audioCtx.destination);

  musicNodes = notes.map((freq, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq / 2;
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(master);
    osc.start();

    // gentle LFO-like fade in/out per note, staggered
    const pulse = () => {
      if (!musicPlaying) return;
      const now = audioCtx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.linearRampToValueAtTime(0.18, now + 2);
      gain.gain.linearRampToValueAtTime(0, now + 4);
      setTimeout(pulse, 4300 + i * 700);
    };
    setTimeout(pulse, i * 900);
    return { osc, gain };
  });
  master.connect(audioCtx.destination);
  window._musicMaster = master;
}
function stopAmbientMusic() {
  if (!audioCtx) return;
  musicNodes.forEach(({ osc, gain }) => {
    gain.gain.cancelScheduledValues(audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
  });
  setTimeout(() => { audioCtx.close(); audioCtx = null; }, 700);
}

$('#music-toggle').addEventListener('click', function () {
  musicPlaying = !musicPlaying;
  this.textContent = musicPlaying ? '🔊' : '🔇';
  this.classList.toggle('playing', musicPlaying);
  if (musicPlaying) startAmbientMusic();
  else stopAmbientMusic();
});

/* =========================================================
   EASTER EGGS 🐰
   ========================================================= */

/* 1. click the moon (spawn a tiny moon on the final page's sky) */
function addMoonEasterEgg() {
  const sky = $('.night-sky');
  if (!sky || sky.querySelector('.egg-moon')) return;
  const moon = document.createElement('div');
  moon.className = 'egg-moon';
  moon.textContent = '🌙';
  moon.style.cssText = `
    position:absolute; top:8%; right:12%; font-size:2.4rem; cursor:pointer;
    filter:drop-shadow(0 0 12px rgba(255,255,255,.5)); transition:transform .3s;
    animation:heartbeat 4s ease-in-out infinite;`;
  moon.addEventListener('mouseenter', () => moon.style.transform = 'scale(1.2) rotate(15deg)');
  moon.addEventListener('mouseleave', () => moon.style.transform = 'scale(1) rotate(0)');
  moon.addEventListener('click', () => showToast('🌙 the moon says: go easy on yourself too.'));
  sky.appendChild(moon);
}
document.addEventListener('DOMContentLoaded', addMoonEasterEgg);
new MutationObserver(addMoonEasterEgg).observe(document.body, { childList: true, subtree: true });

/* 2. click a heart 10 times */
let heartClicks = 0;
document.addEventListener('click', (e) => {
  if (e.target.closest('.heart-pop') || e.target.textContent === '❤️') {
    heartClicks++;
    if (heartClicks === 10) {
      showToast('💗 okay wow, 10 clicks. you really do still love me, huh?');
      burstHeartsAt(e.clientX, e.clientY, 20);
    }
  }
});

/* 3. double click Momo's name */
$('#momo-name').addEventListener('dblclick', () => {
  showToast('🐼 hehe, hi. yes, this website is a little unhinged. it was made with love though.');
  burstHeartsAt(window.innerWidth / 2, 100, 16);
});

/* 4. hover the stars in final page */
let starHoverArmed = true;
document.addEventListener('mousemove', (e) => {
  const sky = $('.stars-layer');
  if (!sky) return;
  const rect = sky.getBoundingClientRect();
  if (
    starHoverArmed &&
    e.clientX > rect.left && e.clientX < rect.right &&
    e.clientY > rect.top && e.clientY < rect.bottom &&
    $('#final').classList.contains('active')
  ) {
    starHoverArmed = false;
    showToast('⭐ every star here is a reason I\'m glad you exist.');
    setTimeout(() => (starHoverArmed = true), 8000);
  }
});

/* 5. Konami code */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiProgress = 0;
document.addEventListener('keydown', (e) => {
  konamiProgress = (e.key === konami[konamiProgress]) ? konamiProgress + 1 : (e.key === konami[0] ? 1 : 0);
  if (konamiProgress === konami.length) {
    konamiProgress = 0;
    showToast('🎮 secret unlocked: you found the nerdy easter egg. of course you did.');
    launchConfettiFinale();
  }
});

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  goToPage('home');
});
