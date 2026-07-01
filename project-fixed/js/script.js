/* ═══════════════════════════════════════════════════
   ▶ PASSWORT HIER ÄNDERN ◀
   Einfach den Text zwischen den Anführungszeichen
   durch dein gewünschtes Passwort ersetzen.
════════════════════════════════════════════════════ */
const SITE_PASSWORD = 'kn2026';

/* ── Password Gate Logic ─────────────────────────── */
(function () {
  const gate  = document.getElementById('pwgate');
  const input = document.getElementById('pwInput');
  const err   = document.getElementById('pwErr');

  // Bereits eingeloggt? (Session bleibt bis Browser-Tab geschlossen)
  if (sessionStorage.getItem('kn_auth') === '1') {
    gate.classList.add('gone');
    return;
  }

  // Enter-Taste unterstützen
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkPw(); });
})();

function checkPw() {
  const input = document.getElementById('pwInput');
  const err   = document.getElementById('pwErr');
  const gate  = document.getElementById('pwgate');

  if (input.value === SITE_PASSWORD) {
    // Korrekt → Gate ausblenden
    sessionStorage.setItem('kn_auth', '1');
    err.classList.remove('show');
    gate.classList.add('gone');
  } else {
    // Falsch → Schütteln + Fehlermeldung
    err.classList.add('show');
    input.classList.remove('shake');
    void input.offsetWidth; // reflow für Animation-Neustart
    input.classList.add('shake');
    input.select();
  }
}

function togglePwVis() {
  const input = document.getElementById('pwInput');
  const eye   = document.getElementById('pwEye');
  if (input.type === 'password') {
    input.type = 'text';
    eye.textContent = '🙈';
  } else {
    input.type = 'password';
    eye.textContent = '👁';
  }
}

/* ── Theme Toggle ────────────────────────────────── */
(function () {
  const root  = document.documentElement;
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('themeIcon');
  if (!btn || !icon) return;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateIcon() {
    // Zeigt das Icon des Themes, zu dem man wechseln WÜRDE
    icon.textContent = currentTheme() === 'light' ? '🌙' : '☀️';
  }
  updateIcon();

  btn.addEventListener('click', () => {
    btn.classList.add('switching');
    setTimeout(() => {
      const next = currentTheme() === 'light' ? 'dark' : 'light';
      if (next === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        root.removeAttribute('data-theme');
      }
      localStorage.setItem('kn-theme', next);
      updateIcon();
      btn.classList.remove('switching');
    }, 180);
  });

  // Reagiert live auf Änderungen der Systemeinstellung, solange der
  // Nutzer noch keine eigene Wahl getroffen hat.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('kn-theme')) return; // Nutzer hat manuell gewählt
      if (e.matches) {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', 'light');
      }
      updateIcon();
    });
  }
})();

/* ── Loader ──────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 1600);
});

/* ── Cursor Glow ─────────────────────────────────── */
const cur = document.getElementById('cur');
let mx = -999, my = -999;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function moveCur() {
  cur.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  requestAnimationFrame(moveCur);
}
moveCur();

/* ── Nav scroll ──────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

/* ── Hamburger ───────────────────────────────────── */
const hbg = document.getElementById('hbg');
const nl  = document.getElementById('nlinks');
hbg.addEventListener('click', () => {
  const o = nl.classList.toggle('open');
  hbg.setAttribute('aria-expanded', o);
});
nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nl.classList.remove('open');
  hbg.setAttribute('aria-expanded', 'false');
}));

/* ── FAQ ─────────────────────────────────────────── */
document.querySelectorAll('.ftrig').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.fitem');
    const open = item.classList.contains('open');
    document.querySelectorAll('.fitem').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

/* ── Scroll Reveal ───────────────────────────────── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); ro.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-r]').forEach(el => ro.observe(el));

/* ── Vorher/Nachher Slider ───────────────────────── */
(function(){
  const stage = document.getElementById('baStage');
  const range = document.getElementById('baRange');
  if (!stage || !range) return;

  function setPos(val) {
    stage.style.setProperty('--pos', String(val));
  }

  // Initial-Position synchron zum Input-Wert setzen
  setPos(range.value);

  range.addEventListener('input', () => setPos(range.value));
  range.addEventListener('change', () => setPos(range.value));

  // Sanfte, flüssige Auto-Animation beim ersten Laden: fährt einmal
  // von "Vorher" zu "Nachher", damit Besucher den Effekt sofort verstehen.
  let userInteracted = false;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateSweep(from, to, duration) {
    if (userInteracted) return;
    const start = performance.now();

    function frame(now) {
      if (userInteracted) return;
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);
      const val = from + (to - from) * eased;
      range.value = val;
      setPos(val);
      if (t < 1) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  function autoDemo() {
    if (userInteracted) return;
    // Start bei "Vorher" (weit links), fährt mittellangsam zu "Nachher" (weit rechts)
    setPos(8);
    range.value = 8;
    setTimeout(() => animateSweep(8, 92, 2200), 500);
  }

  // Demo erst starten, wenn der Hero sichtbar ist
  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { setTimeout(autoDemo, 900); heroObs.disconnect(); }
    });
  }, { threshold: 0.3 });
  heroObs.observe(stage);

  // Sobald der Nutzer selbst interagiert, Auto-Demo dauerhaft stoppen
  ['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
    range.addEventListener(evt, () => { userInteracted = true; }, { passive: true });
  });

  // Zusätzlicher direkter Drag-Handler auf dem Stage-Element selbst,
  // als robuster Fallback falls der native range-Input in manchen
  // Browsern nicht über die volle Fläche reagiert.
  let dragging = false;

  function posFromEvent(evt) {
    const rect = stage.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    return pct;
  }

  function onDragMove(evt) {
    if (!dragging) return;
    userInteracted = true;
    const pct = posFromEvent(evt);
    range.value = pct;
    setPos(pct);
  }

  stage.addEventListener('pointerdown', e => { dragging = true; onDragMove(e); });
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', () => { dragging = false; });

  stage.addEventListener('touchstart', e => { dragging = true; onDragMove(e); }, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
})();

/* ── Services drag-scroll ────────────────────────── */
const sv = document.getElementById('svScroll');
let isDown = false, startX, scrollL;
sv.addEventListener('mousedown', e => { isDown = true; sv.classList.add('active'); startX = e.pageX - sv.offsetLeft; scrollL = sv.scrollLeft; });
sv.addEventListener('mouseleave', () => { isDown = false; });
sv.addEventListener('mouseup', () => { isDown = false; });
sv.addEventListener('mousemove', e => {
  if (!isDown) return; e.preventDefault();
  const x = e.pageX - sv.offsetLeft;
  sv.scrollLeft = scrollL - (x - startX) * 1.4;
});

/* ── Form ────────────────────────────────────────── */
/* TODO vor dem Go-Live: Diese Funktion ist nur eine visuelle Demo.
   Für ein echtes Versenden gibt es zwei einfache Optionen:

   OPTION A — Formspree (kein eigener Server nötig, kostenloser Tarif reicht oft):
     1. Account auf https://formspree.io anlegen, Formular registrieren
     2. Im HTML: <form action="https://formspree.io/f/DEINE_ID" method="POST">
        um die bestehenden Felder herum ergänzen
     3. Diese sendForm()-Funktion kann dann entfallen — Formspree übernimmt
        den Versand und die Weiterleitung serverseitig

   OPTION B — Eigenes Backend (mehr Kontrolle, mehr Aufwand):
     Ein kleines PHP-Skript (mail()) oder eine Node/Express-Route, die das
     Formular per fetch() entgegennimmt und per SMTP versendet (z.B. PHPMailer
     oder Nodemailer).

   Wichtig: ohne echte Anbindung gehen aktuell ALLE Formular-Einsendungen
   verloren — die Funktion zeigt nur eine Erfolgsmeldung an, ohne Daten zu senden! */
function sendForm() {
  const btn = document.getElementById('sbtn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>✓ Anfrage gesendet – wir melden uns!</span>';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
}
