'use strict';

/* Reset URL to / immediately on any reload */
if (location.pathname !== '/') history.replaceState({}, '', '/');

/* ── isMobile helper — recalculated on resize ── */
let isMobile = window.innerWidth <= 768;
window.addEventListener('resize', () => { isMobile = window.innerWidth <= 768; });

/* ══ P1 VERTICAL POSITIONING ════════════════
   Portrait bottom edge lands at 80vh.
   If hint would go below 97vh, shift entire block up.
   No minimum clamp on top — portrait may go above 0.
════════════════════════════════════════════ */
function positionP1Block() {
  const portraitEl = document.getElementById('p1-portrait-wrap');
  const hintEl     = document.getElementById('p1-hint');
  const sceneEl    = document.getElementById('p1-scene');
  if (!portraitEl || !hintEl || !sceneEl) return;

  const vh            = window.innerHeight / 100;
  const targetBottom  = 80 * vh;   // portrait bottom at 80vh
  const maxHintBottom = 97 * vh;   // hint must not go below 97vh

  const portraitH = portraitEl.offsetHeight;
  const hintH     = hintEl.offsetHeight;
  const gap       = 16; // px gap between portrait bottom and hint top

  // Ideal top: portrait bottom at 80vh
  let idealTop = targetBottom - portraitH;

  // Shift up if hint would go below 97vh
  const hintBottom = idealTop + portraitH + gap + hintH;
  if (hintBottom > maxHintBottom) {
    idealTop = maxHintBottom - hintH - gap - portraitH;
  }

  sceneEl.style.position  = 'absolute';
  sceneEl.style.left      = '50%';
  sceneEl.style.top       = idealTop + 'px';
  sceneEl.style.transform = 'translateX(-50%)';
}

/* ══ P2/P7 VERTICAL POSITIONING ═════════════
   #p2-portrait-fixed bottom edge lands at 80vh.
   Hard cap: bottom must not exceed 97vh.
   Horizontal position is preserved (CSS handles it).
════════════════════════════════════════════ */
function positionP2Block() {
  const portraitEl = document.getElementById('p2-portrait-fixed');
  if (!portraitEl) return;

  const vh           = window.innerHeight / 100;
  const targetBottom = 80 * vh;   // portrait bottom at 80vh
  const maxBottom    = 97 * vh;   // hard cap

  const portraitH = portraitEl.offsetHeight;

  let idealTop = targetBottom - portraitH;

  // Hard cap — portrait bottom must not exceed 97vh
  if (idealTop + portraitH > maxBottom) {
    idealTop = maxBottom - portraitH;
  }

  portraitEl.style.top = idealTop + 'px';
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.style.top = (idealTop + portraitH + 16) + 'px';
}

window.addEventListener('load',   positionP1Block);
window.addEventListener('load',   positionP2Block);
window.addEventListener('resize', positionP1Block);
window.addEventListener('resize', positionP2Block);

/* ══ CURSOR ══════════════════════════════════ */
const $cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  $cur.style.left = e.clientX + 'px';
  $cur.style.top  = e.clientY + 'px';
});
function addHC(el) {
  if (!el) return;
  el.addEventListener('mouseenter', () => { if (!activeDrag) $cur.classList.add('h'); });
  el.addEventListener('mouseleave', () => $cur.classList.remove('h'));
}
document.querySelectorAll('.lang-btn,#p1-portrait-ph,#p2-portrait-fixed,label').forEach(addHC);

/* ══ ROUTING ═════════════════════════════════ */
const ROLE_PREFIX = { 3:'production', 4:'director', 5:'assistant-director', 6:'editor' };
const PAGE_ROUTE  = { 3:'/production', 4:'/director', 5:'/assistant-director', 6:'/editor' };

function pushRoute(path) {
  if (history.pushState) history.pushState({ path }, '', path);
}

function navigateToPath(path) {
  const p = path.replace(/\/$/, '') || '/';
  if (p === '/about')              { handlePortraitClick(); return; }
  if (p === '/contact')            { scatterWords(() => goToPage7()); return; }
  if (p === '/production')         { scatterWords(() => goToPage3()); return; }
  if (p === '/director')           { scatterWords(() => goToPage4()); return; }
  if (p === '/assistant-director') { scatterWords(() => goToPage5()); return; }
  if (p === '/editor')             { scatterWords(() => goToPage6()); return; }
}

window.addEventListener('popstate', () => {
  const p = location.pathname.replace(/\/$/, '') || '/';
  if (p === '/')                   { if (currentPage !== 1) snavGo(1); }
  else navigateToPath(p);
});

/* BFCache restore — browser Back/Forward may resurrect a stale page state.
   Force a clean reload so My Projects (p1) is always the landing.        */
window.addEventListener('pageshow', function (e) {
  if (e.persisted) location.reload();
});

/* ══ STATE ═══════════════════════════════════ */
let currentLang = 'en';
let portraitSrc = null;
let currentPage = 1;
let isTransitioning = false;
let homeMusicAudio = null;

function lockNav(ms) {
  isTransitioning = true;
  setTimeout(() => { isTransitioning = false; }, ms || 1500);
}

// Strip all transition classes from every page (safety net for stale states)
function resetAllPages() {
  ['p2','p3','p4','p5','p6','p7','proj-overlay'].forEach(id => {
    const el = document.getElementById(id); if (el) el.classList.remove('slide-in');
  });
  document.getElementById('p1').classList.remove('slide-out');
  ['p2-portrait-fixed','p2-left','p2-right',
   'p3-header','p3-divider','p3-grid',
   'p4-header','p4-divider','p4-grid',
   'p5-header','p5-divider','p5-grid',
   'p6-header','p6-divider','p6-grid',
   'p7-left','p7-right',
   'proj-header','proj-divider','proj-body'
  ].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('in'); });
}


/* ══ LANGUAGE ════════════════════════════════ */
function updateLangSwitcher() {
  const en = document.getElementById('lang-btn-en');
  const vi = document.getElementById('lang-btn-vi');
  if (en) en.classList.toggle('lang-active', currentLang === 'en');
  if (vi) vi.classList.toggle('lang-active', currentLang === 'vi');
}
window.updateLangSwitcher = updateLangSwitcher;

function switchLangTo(lang) {
  if (currentLang === lang) return;
  currentLang = lang;
  const sub = document.getElementById('p1-sub');
  if (sub) sub.textContent = C[lang].sub;
  const hint = document.getElementById('p1-hint');
  if (hint) hint.textContent = C[lang].hint;
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.textContent = lang === 'vi' ? 'bấm vào ảnh để liên hệ' : 'click portrait to contact me';
  if      (currentPage === 2 && window.renderP2) renderP2(lang);
  else if (currentPage === 3 && window.renderP3) renderP3();
  else if (currentPage === 4 && window.renderP4) renderP4();
  else if (currentPage === 5 && window.renderP5) renderP5();
  else if (currentPage === 6 && window.renderP6) renderP6();
  _applyLangUI(lang);
  updateLangSwitcher();
}
window.switchLangTo = switchLangTo;

function _applyLangUI(lang) {
  const isVi = lang === 'vi';
  // Floating word particles
  if (typeof particles !== 'undefined') {
    particles.forEach(p => {
      p.el.textContent = isVi ? (p.role.label_vi || p.role.label) : p.role.label;
    });
  }
  // Main menu items
  const pg1btn = document.querySelector('#menu-panel .snav-item.pg1');
  if (pg1btn) pg1btn.textContent = isVi ? 'Trang Ch\u1ee7' : 'Home';
  const pg2btn = document.querySelector('#menu-panel .snav-item.pg2');
  if (pg2btn) pg2btn.textContent = isVi ? 'Gi\u1edbi Thi\u1ec7u' : 'About';
  const pg7btn = document.querySelector('#menu-panel .snav-item.pg7');
  if (pg7btn) pg7btn.textContent = isVi ? 'Li\u00ean H\u1ec7' : 'Contact';
  const mypbtn = document.querySelector('#menu-panel .myproj-btn');
  if (mypbtn) mypbtn.textContent = isVi ? 'D\u1ef0 \u00c1n V\u00e0 C\u00f4ng Vi\u1ec7c' : 'Projects \u0026 Works';
  // Sub-menu items
  const subMap = {
    pg4: isVi ? '\u0110\u1ea1o Di\u1ec5n'         : 'Director',
    pg5: isVi ? 'Tr\u1ee3 L\u00fd \u0110\u1ea1o Di\u1ec5n' : 'Assistant Director',
    pg3: isVi ? 'S\u1ea3n Xu\u1ea5t'         : 'Production',
    pg6: isVi ? 'D\u1ef1ng Phim'        : 'Editor',
  };
  Object.entries(subMap).forEach(([cls, lbl]) => {
    const el = document.querySelector('#menu-panel .snav-sub.' + cls);
    if (el) el.textContent = lbl;
  });
  // Page titles \u0026 subtitles
  const titleMap = {
    p3: isVi ? 'S\u1ea3n Xu\u1ea5t'         : 'Production',
    p4: isVi ? '\u0110\u1ea1o Di\u1ec5n'         : 'Director',
    p5: isVi ? 'Tr\u1ee3 L\u00fd \u0110\u1ea1o Di\u1ec5n' : 'Assistant Director',
    p6: isVi ? 'D\u1ef1ng Phim'        : 'Editor',
  };
  Object.entries(titleMap).forEach(([id, txt]) => {
    const t = document.getElementById(id + '-title');    if (t) t.textContent = txt;
    const s = document.getElementById(id + '-subtitle'); if (s) s.textContent = isVi ? 'D\u1ef0 \u00c1n V\u00e0 C\u00f4ng Vi\u1ec7c' : 'Projects \u0026 Works';
  });
  // Contact page
  const p7touch = document.querySelector('#p7-left .p2-lbl');
  if (p7touch) p7touch.textContent = isVi ? 'H\u00e3y K\u1ebft N\u1ed1i' : 'Get In Touch';
  const p7contact = document.querySelector('#p7-right .p7-lbl');
  if (p7contact) p7contact.textContent = isVi ? 'Th\u00f4ng Tin' : 'Contact';
  const p7quote = document.getElementById('p7-quote-text');
  if (p7quote) p7quote.textContent = isVi
    ? '\u201cT\u00f4i r\u1ea5t vui n\u1ebfu c\u00f3 c\u01a1 h\u1ed9i l\u00e0m vi\u1ec7c v\u1edbi b\u1ea1n. N\u1ebfu c\u1ea7n h\u1ed7 tr\u1ee3, h\u00e3y li\u00ean h\u1ec7 t\u00f4i. C\u00f2n n\u1ebfu kh\u00f4ng, ch\u00fang ta v\u1eabn c\u00f3 th\u1ec3 tr\u00f2 chuy\u1ec7n v\u00e0 l\u00e0m b\u1ea1n.\u201d'
    : '\u201cI would be delighted to work with you. If you need my assistance, please feel free to get in touch. And if not, we can always chat and be friends.\u201d';
  const clbls = document.querySelectorAll('.p7-clbl');
  const viLbls = ['Điện Thoại', 'Email', 'Facebook', 'Instagram'];
  const enLbls = ['Phone', 'Email', 'Facebook', 'Instagram'];
  clbls.forEach((el, i) => { if (i < 4) el.textContent = isVi ? viLbls[i] : enLbls[i]; });
}
function chooseLang(lang) {
  currentLang = lang;
  document.getElementById('lang-screen').classList.add('out');
  document.getElementById('p1-sub').textContent  = C[lang].sub;
  document.getElementById('p1-hint').textContent = C[lang].hint;
  renderP2(lang);
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.textContent = lang === 'vi' ? 'bấm vào ảnh để liên hệ' : 'click portrait to contact me';
  setTimeout(() => {
    document.getElementById('lang-screen').style.display = 'none';
    document.getElementById('p1-portrait-wrap').classList.add('play');
    document.getElementById('p1-name-block').classList.add('play');
    positionP1Block();
    launchParticles();
    document.body.classList.add('words-active');
    history.replaceState({}, '', '/');
    const sideNavEl = document.getElementById('side-nav');
    if (sideNavEl) sideNavEl.classList.add('vis');
    updateLangSwitcher();
    _applyLangUI(lang);
  }, 950);
}

/* ══ RENDER P2 ═══════════════════════════════ */

/* ══ PAGE TRANSITIONS ════════════════════════ */

function handlePortraitClick() {
  if (isTransitioning) return;
  if (stage === 1) {
    enterStage2(true);
    return;
  }
  if (stage === 2) {
    stage = 3;
    goToPage2();
    return;
  }
  if (currentPage === 2) { goToPage7(); return; }
  if (currentPage === 7) { goToPage2(); return; }
}
window.handlePortraitClick = handlePortraitClick;

function goToHome() {
  if (window.snavClose) snavClose();
  stopHomeMusic();
  resetAllPages();
  currentPage = 1;
  if (window.pushRoute) pushRoute('/');
  // Destroy all existing particle DOM elements and clear array for a completely fresh start
  particles.forEach(p => { if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el); });
  particles = [];
  document.body.classList.remove('words-active');
  // Re-create particles exactly as on first language selection
  launchParticles();
  document.body.classList.add('words-active');  // required: CSS body:not(.words-active) .rw { opacity:0 !important }
  // Explicitly enforce Stage 1 state (launchParticles sets stage/collisionEnabled/lerpActive;
  // physicsRunning must be set false here since loopStarted=true skips that path inside launchParticles)
  stage = 1;
  collisionEnabled = false;
  lerpActive = false;
  physicsRunning = false;
  // Force all new particles to Stage 1: hidden at portrait center, no velocity
  const portraitWrap = document.getElementById('p1-portrait-wrap');
  if (portraitWrap && particles.length) {
    const rect = portraitWrap.getBoundingClientRect();
    const pcx  = rect.left + rect.width  / 2;
    const pcy  = rect.top  + rect.height / 2;
    particles.forEach(p => {
      p.x = pcx - p.w / 2;
      p.y = pcy - p.h / 2;
      p.vx = 0; p.vy = 0;
      p.settled = false;
      p.el.style.transition = '';
      p.el.style.opacity = '0';
      p.el.style.transform = `translate(${p.x}px,${p.y}px)`;
      p.el.classList.add('rw-behind');
    });
  }
  // Hint is set to Stage 1 text by launchParticles; ensure display/opacity are clean
  const hint = document.getElementById('p1-hint');
  if (hint) { hint.style.display = ''; hint.style.opacity = ''; }
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.style.display = 'none';
  if (window.updateMenuState) updateMenuState();
  if (window.updateSideNav) updateSideNav(1);
}
window.goToHome = goToHome;

function generateTargets(pts) {
  const padding = 40, buffer = 20;
  const W = window.innerWidth, H = window.innerHeight;
  const placed = [];
  const cx = portraitCenterX, cy = portraitCenterY;
  const exLeft = cx - 150, exRight = cx + 150, exTop = cy - 150, exBottom = cy + 150;
  const shuffled = [...pts].sort(() => Math.random() - 0.5);
  for (const p of shuffled) {
    let placed_pos = null;
    for (let attempt = 0; attempt < 300; attempt++) {
      const tx = padding + Math.random() * (W - p.w - padding * 2);
      const ty = padding + Math.random() * (H - p.h - padding * 2);
      if (tx < exRight && tx + p.w > exLeft && ty < exBottom && ty + p.h > exTop) continue;
      let conflict = false;
      for (const other of placed) {
        if (!(tx + p.w + buffer < other.x || other.x + other.w + buffer < tx ||
              ty + p.h + buffer < other.y || other.y + other.h + buffer < ty)) {
          conflict = true; break;
        }
      }
      if (!conflict) {
        placed_pos = { x: tx, y: ty };
        placed.push({ x: tx, y: ty, w: p.w, h: p.h });
        break;
      }
    }
    if (!placed_pos) {
      placed_pos = {
        x: padding + Math.random() * (W - p.w - padding * 2),
        y: padding + Math.random() * (H - p.h - padding * 2)
      };
      placed.push({ x: placed_pos.x, y: placed_pos.y, w: p.w, h: p.h });
    }
    p.targetX = placed_pos.x;
    p.targetY = placed_pos.y;
    p.settled = false;
  }
}

function enterStage2(fromPortrait) {
  stage = 2;
  physicsRunning = true;
  if (fromPortrait) playHomeMusic();
  if (window.updateSideNav) updateSideNav(1);
  generateTargets(particles);

  // reveal words: make visible then remove Stage 1 behind-class
  particles.forEach(p => { p.el.style.opacity = '1'; });
  particles.forEach(p => p.el.classList.remove('rw-behind'));

  // ripple
  const r = document.getElementById('p1-ripple');
  r.classList.remove('fire'); void r.offsetWidth; r.classList.add('fire');

  // start lerp
  lerpActive = true; lerpStartTime = Date.now();

  // hint: fade out → update text → fade back in
  const hint = document.getElementById('p1-hint');
  hint.classList.add('fade-out');
  setTimeout(() => {
    const line1 = { en: 'click the portrait to learn about me', vi: 'bấm vào ảnh để tìm hiểu về tôi' };
    const line2 = { en: 'click a role to see my work', vi: 'chọn một vai trò để khám phá dự án của tôi' };
    hint.innerHTML = `<span id="hint-line1">${line1[currentLang]||line1.en}</span><span id="hint-line2">${line2[currentLang]||line2.en}</span>`;
    hint.classList.remove('fade-out');
  }, 400);
}

function enterStage3() {
  stage = 3;
  const hint = document.getElementById('p1-hint');
  hint.classList.add('fade-out');
  setTimeout(() => { hint.style.display = 'none'; }, 400);
  lockNav(1500);
  const r = document.getElementById('p1-ripple');
  r.classList.remove('fire'); void r.offsetWidth; r.classList.add('fire');
  scatterWords(() => goToPage2());
}

// Scatter all words outward from screen center
function scatterWords(cb) {
  document.body.classList.remove('words-active');
  physicsRunning = false; // pause physics
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;

  particles.forEach((p, i) => {
    const dx = (p.x + p.w/2) - cx;
    const dy = (p.y + p.h/2) - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx/dist, ny = dy/dist;
    const fly = Math.max(window.innerWidth, window.innerHeight) * 1.5;
    const tx = p.x + nx*fly;
    const ty = p.y + ny*fly;
    const delay = i * 12; // stagger slightly

    setTimeout(() => {
      p.el.style.transition = `transform 0.6s cubic-bezier(.25,.8,.4,1) ${delay}ms, opacity 0.5s ease ${delay}ms`;
      p.el.style.opacity    = '0';
      p.el.style.transform  = `translate(${tx}px,${ty}px)`;
      p.scattered = true;
    }, delay);
  });

  setTimeout(() => cb(), 650 + particles.length * 12 * 0.5);
}

// Return words to last physics positions
function returnWords() {
  physicsRunning = true;
  particles.forEach(p => {
    p.scattered = false;
    p.el.style.transform = `translate(${p.x}px,${p.y}px)`;
  });
  // wait for page transition (0.7s) to finish before making words visible
  setTimeout(() => {
    document.body.classList.add('words-active');
    particles.forEach(p => {
      p.el.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1), opacity 0.5s ease';
      p.el.style.opacity    = String(p.op);
      // after animation completes: strip ALL inline transition so physics owns transform
      setTimeout(() => {
        p.el.style.transition = '';
        p.el.style.opacity    = '';
      }, 550);
    });
  }, 750);
}

function hideFloatingWords() {
  if (particles && particles.length) {
    particles.forEach(p => { if (p.el) p.el.style.opacity = '0'; });
  }
  physicsRunning = false;
  document.body.classList.remove('words-active');
}

function playHomeMusic() {
  stopHomeMusic();
  homeMusicAudio = new Audio('nhachome.mp3');
  homeMusicAudio.loop = false;
  homeMusicAudio.play().catch(() => {});
}

function stopHomeMusic() {
  if (!homeMusicAudio) return;
  homeMusicAudio.pause();
  homeMusicAudio.currentTime = 0;
  homeMusicAudio = null;
}

window.hideFloatingWords = hideFloatingWords;
window.stopHomeMusic = stopHomeMusic;

function goToPage2() {
  hideFloatingWords();
  stopHomeMusic();
  resetAllPages();
  currentPage = 2;
  if (window.updateSideNav) updateSideNav(2);
  pushRoute('/about');
  if (portraitSrc) {
    document.getElementById('p2-portrait-img2').src = portraitSrc;
    document.getElementById('p2-portrait-img2').style.display = 'block';
    document.getElementById('p2-portrait-ph2').style.display  = 'none';
  }
  renderP2(currentLang);
  document.getElementById('p1').classList.add('slide-out');
  document.getElementById('p2').classList.add('slide-in');
  document.getElementById('p2-left').scrollTop  = 0;
  document.getElementById('p2-right').scrollTop = 0;
  positionP2Block();
  const p2hint = document.getElementById('p2-hint');
  if (p2hint && !isMobile) {
    p2hint.textContent = currentLang === 'vi' ? 'bấm vào ảnh để liên hệ' : 'click portrait to contact me';
    p2hint.style.display = 'block';
  }
  setTimeout(() => {
    document.getElementById('p2-portrait-fixed').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p2-left').classList.add('in');
    document.getElementById('p2-right').classList.add('in');
  }, 340);
  if (window.updateMenuState) updateMenuState();
}

function goToPage1() {
  if (currentPage === 1) return;
  resetAllPages();
  currentPage = 1;
  pushRoute('/');
  if (window.updateSideNav) updateSideNav(1);
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p2').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p2-portrait-fixed').classList.remove('in');
    document.getElementById('p2-left').classList.remove('in');
    document.getElementById('p2-right').classList.remove('in');
  }, 720);
  returnWords();
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.style.display = 'none';
  if (window.updateMenuState) updateMenuState();
}

/* ══ PAGE 3 NAVIGATION ═══════════════════════ */

let _projFromPage = 0;

function _resolveVideoEmbed(url) {
  if (!url) return null;
  let m;

  // YouTube: youtube.com/watch?v=ID  or  youtu.be/ID
  m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return 'https://www.youtube.com/embed/' + m[1] + '?rel=0';

  // Vimeo: vimeo.com/ID
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return 'https://player.vimeo.com/video/' + m[1];

  // Google Drive: drive.google.com/file/d/FILE_ID/...
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';

  // Facebook: any facebook.com URL (share/v/, watch/?v=, /videos/, etc.)
  if (/facebook\.com/.test(url)) return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false&width=640&autoplay=false';

  // Instagram: instagram.com/p/ID/ or instagram.com/reel/ID/
  m = url.match(/instagram\.com\/(?:p|reel|tv)\/([\/\w-]+?)(?:\?|\/$|$)/);
  if (m) return 'https://www.instagram.com/p/' + m[1].replace(/\//g,'') + '/embed/';
  return null;
}

function goToProjectPage(id, fromPage) {
  const maps = { 3: P3_PROJECTS, 4: P4_PROJECTS, 5: P5_PROJECTS, 6: P6_PROJECTS };
  const colors = { 3: '#00e676', 4: '#1a6fff', 5: '#ff1a1a', 6: '#ffe000' };
  const proj = (maps[fromPage] || []).find(p => p.id === id);
  if (!proj) return;
  _projFromPage = fromPage;

  const overlay = document.getElementById('proj-overlay');
  overlay.style.setProperty('--proj-color', colors[fromPage] || '#f5f2ee');
  const isEn = currentLang === 'en';

  document.getElementById('proj-eyebrow').textContent  = proj.year + ' — ' + (isEn ? proj.role : (proj.role_vi || proj.role));
  document.getElementById('proj-title').textContent    = isEn && proj.en ? proj.en : proj.title;
  document.getElementById('proj-en-title').textContent = '';
  document.getElementById('proj-en-title').style.display = 'none';

  // Section labels (language-aware)
  document.querySelector('#proj-section-about .proj-section-label').textContent  = isEn ? 'About Project'    : 'Về Dự Án';
  document.querySelector('#proj-section-video .proj-section-label').textContent  = isEn ? 'Watch'            : 'Xem phim';
  document.querySelector('#proj-section-credit .proj-section-label').textContent = 'Credit';
  document.querySelector('#proj-section-stills .proj-section-label').textContent = isEn ? 'Still Frame'      : 'Ảnh tĩnh';
  document.querySelector('#proj-section-bts .proj-section-label').textContent    = isEn ? 'Behind the Scene' : 'Hậu trường';
  document.getElementById('proj-back').textContent = isEn ? '← back' : '← quay lại';

  // ABOUT PROJECT
  const aboutParas = (isEn && proj.about_en && proj.about_en.length)
    ? proj.about_en
    : (proj.about && proj.about.length ? proj.about : [proj.desc]);
  document.getElementById('proj-about-text').innerHTML = aboutParas.map(p => `<p>${p}</p>`).join('');

  // VIDEO EMBED
  const videoSection = document.getElementById('proj-section-video');
  const videoWrap    = document.getElementById('proj-video-wrap');
  if (proj.video) {
    const embedUrl = _resolveVideoEmbed(proj.video);
    if (embedUrl) {
      videoWrap.innerHTML = `<div class="proj-video-embed"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    } else {
      videoWrap.innerHTML = `<a class="proj-watch-btn" href="${proj.video}" target="_blank" rel="noopener noreferrer">&#9654; ${isEn ? 'Watch Video' : 'Xem phim'}</a>`;
    }
    videoSection.style.display = '';
  } else {
    videoSection.style.display = 'none';
  }

  // CREDIT
  const creditSection = document.getElementById('proj-section-credit');
  if (proj.credits && proj.credits.length) {
    document.getElementById('proj-credits').innerHTML = proj.credits.map(c => `<div class="proj-credit-row"><span class="proj-credit-label">${isEn ? c.label : (c.label_vi || c.label)}</span><span class="proj-credit-value">${c.value}</span></div>`).join('');
    creditSection.style.display = '';
  } else {
    creditSection.style.display = 'none';
  }

  // EXTRA SECTIONS (e.g. VFX Breakdown)
  const extrasContainer = document.getElementById('proj-extras');
  if (extrasContainer) {
    if (proj.extras && proj.extras.length) {
      extrasContainer.innerHTML = proj.extras.map(ext => {
        const label = isEn && ext.label_en ? ext.label_en : ext.label;
        const embedUrl = ext.url ? _resolveVideoEmbed(ext.url) : null;
        let content;
        if (embedUrl) {
          content = `<div class="proj-video-embed"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
        } else if (ext.url) {
          content = `<a class="proj-watch-btn" href="${ext.url}" target="_blank" rel="noopener noreferrer">&#9654; ${isEn ? 'Watch' : 'Xem'}</a>`;
        } else {
          content = ext.html || '';
        }
        return `
      <section class="proj-section">
        <div class="proj-section-label">${label}</div>
        <div class="proj-extra-content">${content}</div>
      </section>`;
      }).join('');
      extrasContainer.style.display = '';
    } else {
      extrasContainer.innerHTML = '';
      extrasContainer.style.display = 'none';
    }
  }

  // STILL FRAME
  const stillsSection = document.getElementById('proj-section-stills');
  if (proj.stills && proj.stills.length) {
    document.getElementById('proj-stills').innerHTML = proj.stills.map(s => `<img src="${s}" loading="lazy" alt="Still frame"/>`).join('');
    stillsSection.style.display = '';
  } else {
    stillsSection.style.display = 'none';
  }

  // BEHIND THE SCENE
  const btsSection = document.getElementById('proj-section-bts');
  if (proj.bts && proj.bts.length) {
    document.getElementById('proj-bts').innerHTML = proj.bts.map(s => `<img src="${s}" loading="lazy" alt="Behind the scene"/>`).join('');
    btsSection.style.display = '';
  } else {
    btsSection.style.display = 'none';
  }

  overlay.classList.add('slide-in');
  pushRoute('/' + ROLE_PREFIX[fromPage] + '/' + id);
  document.getElementById('proj-back').classList.add('vis');
  setTimeout(() => {
    document.getElementById('proj-header').classList.add('in');
    document.getElementById('proj-divider').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('proj-body').classList.add('in');
  }, 340);
}

function closeProjectPage() {
  pushRoute(PAGE_ROUTE[_projFromPage] || '/');
  document.getElementById('proj-overlay').classList.remove('slide-in');
  document.getElementById('proj-back').classList.remove('vis');
  setTimeout(() => {
    document.getElementById('proj-header').classList.remove('in');
    document.getElementById('proj-divider').classList.remove('in');
    document.getElementById('proj-body').classList.remove('in');
  }, 720);

  // If not already on parent role page, navigate there
  if (currentPage !== _projFromPage) {
    const goFn = { 3: goToPage3, 4: goToPage4, 5: goToPage5, 6: goToPage6 };
    if (goFn[_projFromPage]) goFn[_projFromPage]();
  }
}


/* ══ PORTRAIT UPLOAD ═════════════════════════ */
function openUpload()  { document.getElementById('upload-ov').classList.add('vis'); }
function closeUpload() { document.getElementById('upload-ov').classList.remove('vis'); }
function loadPortrait(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    portraitSrc = ev.target.result;
    ['p1-portrait-img','p2-portrait-img2'].forEach(id => {
      const img = document.getElementById(id);
      img.src = portraitSrc; img.style.display = 'block';
    });
    document.getElementById('p1-portrait-ph').style.display  = 'none';
    document.getElementById('p2-portrait-ph2').style.display = 'none';
    closeUpload();
    showToast('Portrait loaded — click to navigate');
  };
  reader.readAsDataURL(file);
}

/* ══ FLOATING WORDS — PHYSICS ════════════════ */
const ROLES = [
  {label:'DIRECTOR',           label_vi:'ĐẠO DIỄN',           color:'#1a6fff', page:'page3'},
  {label:'ASSISTANT DIRECTOR', label_vi:'TRỢ LÝ ĐẠO DIỄN',   color:'#ff1a1a', page:'page4'},
  {label:'PRODUCTION',         label_vi:'SẢN XUẤT',           color:'#00e676', page:'page5'},
  {label:'EDITOR',             label_vi:'DỰNG PHIM',          color:'#ffe000', page:'page6'},
];
const COUNT = 8, VEL_SMP = 6;
let particles = [], activeDrag = null, loopStarted = false, physicsRunning = false;
let gMX = 0, gMY = 0;
let stage = 1, collisionEnabled = false, lerpActive = false, lerpStartTime = 0;
let menuMyProjectsExpanded = true;
let portraitCenterX = 0, portraitCenterY = 0;
const FLOAT_MIN_SPEED = 0.22;

const CZ = () => ({
  x0:window.innerWidth*.19, x1:window.innerWidth*.81,
  y0:window.innerHeight*.11, y1:window.innerHeight*.89,
});

function safeSpawn() {
  const cz = CZ(); let x,y,t=0;
  do {
    x = 30 + Math.random()*(window.innerWidth-60);
    y = window.innerHeight*.08 + Math.random()*(window.innerHeight*.84);
    t++;
  } while(t<40 && x>cz.x0 && x<cz.x1 && y>cz.y0 && y<cz.y1);
  return {x,y};
}

function safeSpawnNoOverlap(placed, w, h) {
  const pad = 14;
  let x, y, t = 0;
  do {
    x = 30 + Math.random() * Math.max(10, window.innerWidth  - 60 - w);
    y = window.innerHeight * .08 + Math.random() * Math.max(10, window.innerHeight * .84 - h);
    t++;
    if (t > 100) break;
    const ok = placed.every(p =>
      x + w + pad < p.x || x > p.x + p.w + pad ||
      y + h + pad < p.y || y > p.y + p.h + pad
    );
    if (ok) break;
  } while (true);
  return { x, y };
}

function launchParticles() {
  // ── STAGE 1 reset ──
  stage = 1; collisionEnabled = false; lerpActive = false;

  // portrait center for initial cluster position
  const wrap = document.getElementById('p1-portrait-wrap');
  const rect = wrap.getBoundingClientRect();
  const pcx = rect.left + rect.width / 2;
  const pcy = rect.top + rect.height / 2;
  portraitCenterX = pcx; portraitCenterY = pcy;

  const mobileCount = isMobile ? 5 : COUNT;
  ROLES.forEach(role => {
    for (let i = 0; i < mobileCount; i++) {
      const el = document.createElement('span');
      el.className = 'rw rw-behind';
      el.textContent = currentLang === 'vi' ? (role.label_vi || role.label) : role.label;
      el.style.color = role.color;
      const op = 0.55 + Math.random() * .40;
      el.style.setProperty('--op', op);
      el.style.opacity = '0';
      document.body.appendChild(el);
      const w = el.offsetWidth || 120, h = el.offsetHeight || 22;
      // spawn at portrait center ± 30px random offset
      const x = pcx - w / 2 + (Math.random() - 0.5) * 60;
      const y = pcy - h / 2 + (Math.random() - 0.5) * 60;
      const p = { el, role, op, w, h,
        x, y, vx: 0, vy: 0,
        dragging: false, velHistory: [], _click: true, scattered: false,
        settled: false, targetX: 0, targetY: 0 };
      el.addEventListener('mousedown', e => onDown(e, p));
      el.addEventListener('touchend', e => {
        if (window.innerWidth > 768) return;
        if (currentPage !== 1 || isTransitioning) return;
        e.preventDefault(); e.stopPropagation();
        lockNav(1500);
        const navMap = {
          'PRODUCTION':         () => scatterWords(() => goToPage3()),
          'DIRECTOR':           () => scatterWords(() => goToPage4()),
          'ASSISTANT DIRECTOR': () => scatterWords(() => goToPage5()),
          'EDITOR':             () => scatterWords(() => goToPage6()),
        };
        if (navMap[p.role.label]) navMap[p.role.label]();
        else showToast('\u2192 ' + p.role.label);
      });
      addHC(el);
      applyRW(p);
      particles.push(p);
    }
  });
  requestAnimationFrame(() => particles.forEach(p => p.el.classList.add('visible')));
  if (!loopStarted) { loopStarted = true; physicsRunning = true; requestAnimationFrame(loop); }

  // Stage 1 hint
  const hint = document.getElementById('p1-hint');
  hint.style.display = '';
  hint.classList.remove('fade-out');
  const s1 = { en: 'click portrait to start', vi: 'bấm vào hình ảnh để bắt đầu' };
  hint.textContent = s1[currentLang] || s1.en;
}

function spawnParticle(role) {
  const el = document.createElement('span');
  el.className = 'rw';
  el.textContent = currentLang === 'vi' ? (role.label_vi || role.label) : role.label;
  el.style.color = role.color;
  const op = 0.55 + Math.random()*.40;
  el.style.setProperty('--op', op);
  document.body.appendChild(el);

  const w = el.offsetWidth||120, h = el.offsetHeight||22;
  const pos = safeSpawn();
  const spd = 0.22 + Math.random()*.38;
  const ang = Math.random()*Math.PI*2;

  const p = { el,role,op,w,h,
    x:pos.x, y:pos.y,
    vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd,
    dragging:false, velHistory:[], _click:true, scattered:false };

  el.addEventListener('mousedown', e => onDown(e,p));
  el.addEventListener('touchend', e => {
    if (window.innerWidth > 768) return;
    if (currentPage !== 1 || isTransitioning) return;
    e.preventDefault(); e.stopPropagation();
    lockNav(1500);
    const navMap = {
      'PRODUCTION':         () => scatterWords(() => goToPage3()),
      'DIRECTOR':           () => scatterWords(() => goToPage4()),
      'ASSISTANT DIRECTOR': () => scatterWords(() => goToPage5()),
      'EDITOR':             () => scatterWords(() => goToPage6()),
    };
    if (navMap[p.role.label]) navMap[p.role.label]();
    else showToast('\u2192 ' + p.role.label);
  });
  addHC(el);
  requestAnimationFrame(()=>{ el.classList.add('visible'); applyRW(p); });
  particles.push(p);
}

function applyRW(p) { p.el.style.transform = `translate(${p.x}px,${p.y}px)`; }

/* ── drag & throw ── */
document.addEventListener('mousemove', e => {
  gMX=e.clientX; gMY=e.clientY;
  if (isMobile || !activeDrag) return;
  const p=activeDrag;
  // update logical position (physics loop will NOT overwrite because p.dragging=true)
  p.x = Math.max(0, Math.min(e.clientX - p._gx, window.innerWidth  - p.w));
  p.y = Math.max(0, Math.min(e.clientY - p._gy, window.innerHeight - p.h));
  applyRW(p); // immediately write to DOM
  // record velocity history for throw
  p.velHistory.push({x:e.clientX, y:e.clientY, t:performance.now()});
  if (p.velHistory.length > VEL_SMP) p.velHistory.shift();
  p._click = false;
});

document.addEventListener('mouseup', () => {
  if (isMobile || !activeDrag) return;
  const p = activeDrag;
  // compute throw velocity from recent history
  let tvx=0, tvy=0;
  const h = p.velHistory;
  if (h.length >= 2) {
    const newest=h[h.length-1], oldest=h[0];
    const dt = Math.max(newest.t - oldest.t, 8);
    tvx = ((newest.x - oldest.x) / dt) * 16 * 0.06;
    tvy = ((newest.y - oldest.y) / dt) * 16 * 0.06;
  }
  // clamp throw speed
  const spd = Math.hypot(tvx, tvy);
  if (spd > 2.5)  { tvx *= 2.5/spd; tvy *= 2.5/spd; }
  if (spd < 0.12) { tvx=(Math.random()-.5)*.4; tvy=(Math.random()-.5)*.4; }
  p.vx=tvx; p.vy=tvy;
  // strip inline transition so physics owns the transform from this frame onward
  p.el.style.transition = 'none';
  // hand back to physics
  p.dragging = false; p.velHistory = [];
  p.el.classList.remove('is-dragging');
  activeDrag = null;
  $cur.classList.remove('dg'); $cur.classList.remove('h');
  setTimeout(()=>{ p._click=true; }, 80);
});

document.addEventListener('touchmove', e => {
  if (isMobile || !activeDrag) return;
  e.preventDefault();
  const t = e.touches[0];
  const p = activeDrag;
  p.x = Math.max(0, Math.min(t.clientX - p._gx, window.innerWidth  - p.w));
  p.y = Math.max(0, Math.min(t.clientY - p._gy, window.innerHeight - p.h));
  applyRW(p);
  p.velHistory.push({x:t.clientX, y:t.clientY, t:performance.now()});
  if (p.velHistory.length > VEL_SMP) p.velHistory.shift();
  p._click = false;
}, {passive:false});

document.addEventListener('touchend', () => {
  if (isMobile || !activeDrag) return;
  const p = activeDrag;
  let tvx=0, tvy=0;
  const h = p.velHistory;
  if (h.length >= 2) {
    const newest=h[h.length-1], oldest=h[0];
    const dt = Math.max(newest.t - oldest.t, 8);
    tvx = ((newest.x - oldest.x) / dt) * 16 * 0.06;
    tvy = ((newest.y - oldest.y) / dt) * 16 * 0.06;
  }
  const spd = Math.hypot(tvx, tvy);
  if (spd > 2.5)  { tvx *= 2.5/spd; tvy *= 2.5/spd; }
  if (spd < 0.12) { tvx=(Math.random()-.5)*.4; tvy=(Math.random()-.5)*.4; }
  p.vx=tvx; p.vy=tvy;
  p.el.style.transition = 'none';
  p.dragging = false; p.velHistory = [];
  p.el.classList.remove('is-dragging');
  activeDrag = null;
  setTimeout(()=>{ p._click=true; }, 80);
});

function onDown(e, p) {
  if (currentPage !== 1) return;
  // On mobile: no drag — only click-to-navigate (touchend handles it)
  if (isMobile) return;
  e.preventDefault(); e.stopPropagation();
  // strip any lingering CSS transition so drag is instant (no CSS fighting physics)
  p.el.style.transition = 'none';
  // grab offset = cursor position relative to word's current top-left
  p._gx = e.clientX - p.x;
  p._gy = e.clientY - p.y;
  p.dragging = true; p._click = true;
  p.velHistory = [{x:e.clientX, y:e.clientY, t:performance.now()}];
  activeDrag = p;
  p.el.classList.add('is-dragging');
  $cur.classList.remove('h'); $cur.classList.add('dg');
  p.el.onclick = () => {
    if (!p._click || isTransitioning) return;
    lockNav(1500);
    const nav = {
      'PRODUCTION':         () => scatterWords(() => goToPage3()),
      'DIRECTOR':           () => scatterWords(() => goToPage4()),
      'ASSISTANT DIRECTOR': () => scatterWords(() => goToPage5()),
      'EDITOR':             () => scatterWords(() => goToPage6()),
    };
    if (nav[p.role.label]) nav[p.role.label]();
    else showToast('→ '+p.role.label);
  };
  setTimeout(()=>{ p._click=false; }, 150);
}

/* ── Shake to scatter — mobile Stage 2 only ── */
if (window.DeviceMotionEvent) {
  let lastShakeTime = 0;
  const SHAKE_THRESHOLD = 15;
  const SHAKE_COOLDOWN  = 1000;
  window.addEventListener('devicemotion', (e) => {
    if (!isMobile || stage !== 2) return;
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    const now   = Date.now();
    if (total > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_COOLDOWN) {
      lastShakeTime = now;
      particles.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 6;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });
    }
  });
}

/* physics */
function loop() {
  if (physicsRunning) {
    const ww=window.innerWidth,wh=window.innerHeight,m=2;
    const minY=wh*.08+m;
    const elapsed=lerpActive?Date.now()-lerpStartTime:0;
    let lerpAllSettled=true;
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      if(p.dragging||p.scattered) continue;
      const mxX=ww-p.w-m, mxY=wh-p.h-m;
      if (lerpActive && !p.settled) {
        // ── lerp toward target ──
        const dx=p.targetX-p.x, dy=p.targetY-p.y;
        const dist=Math.hypot(dx,dy);
        let lvx=dx*0.025, lvy=dy*0.025;
        let lspd=Math.hypot(lvx,lvy);
        if (lspd<FLOAT_MIN_SPEED && dist>5) {
          const sc=FLOAT_MIN_SPEED/(lspd||0.0001);
          lvx*=sc; lvy*=sc; lspd=FLOAT_MIN_SPEED;
        }
        if (lspd<=FLOAT_MIN_SPEED*1.05 && dist<30) {
          p.vx=lvx; p.vy=lvy; p.settled=true;
        } else {
          p.x+=lvx; p.y+=lvy; p.vx=lvx; p.vy=lvy; lerpAllSettled=false;
        }
      } else {
        // ── normal physics ──
        p.x+=p.vx; p.y+=p.vy;
        const spd=Math.hypot(p.vx,p.vy);
        if(spd>1.4)         {p.vx*=1.4/spd;p.vy*=1.4/spd;}
        if(spd>0&&spd<0.10) {p.vx*=0.10/spd;p.vy*=0.10/spd;}
      }
      // edge bounce — always active
      if(p.x<=m)   {p.x=m;   p.vx= Math.abs(p.vx)*(0.8+Math.random()*.25);}
      if(p.x>=mxX) {p.x=mxX; p.vx=-Math.abs(p.vx)*(0.8+Math.random()*.25);}
      if(p.y<=minY){p.y=minY;p.vy= Math.abs(p.vy)*(0.8+Math.random()*.25);}
      if(p.y>=mxY) {p.y=mxY; p.vy=-Math.abs(p.vy)*(0.8+Math.random()*.25);}
      applyRW(p);
    }
    if (collisionEnabled) {
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const pi=particles[i],pj=particles[j];
          if(pi.dragging||pj.dragging||pi.scattered||pj.scattered) continue;
          const ox=Math.min(pi.x+pi.w-pj.x, pj.x+pj.w-pi.x);
          const oy=Math.min(pi.y+pi.h-pj.y, pj.y+pj.h-pi.y);
          if(ox>0&&oy>0){
            if(ox<oy){
              const push=ox/2;
              if(pi.x<pj.x){pi.x-=push;pj.x+=push;}else{pi.x+=push;pj.x-=push;}
              pi.vx*=-0.6; pj.vx*=-0.6;
            } else {
              const push=oy/2;
              if(pi.y<pj.y){pi.y-=push;pj.y+=push;}else{pi.y+=push;pj.y-=push;}
              pi.vy*=-0.6; pj.vy*=-0.6;
            }
          }
        }
      }
    }
    if (lerpActive) {
      if (elapsed>=3000 && !lerpAllSettled) {
        particles.forEach(p => { p.settled=true; }); lerpAllSettled=true;
      }
      if (lerpAllSettled) { lerpActive=false; setTimeout(()=>{ collisionEnabled=true; }, 500); }
    }
  }
  requestAnimationFrame(loop);
}

/* ══ PARALLAX ════════════════════════════════ */
document.addEventListener('mousemove', e => {
  if(currentPage!==1) return;
  const xr=(e.clientX/window.innerWidth-.5)*2, yr=(e.clientY/window.innerHeight-.5)*2;
  const w=document.getElementById('p1-portrait-wrap');
  if(w) w.style.transform=`translate(${xr*6}px,${yr*5}px)`;
});

/* ══ TOAST ═══════════════════════════════════ */
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2500);
}

// renderP2 is called inside chooseLang() on language selection.


/* ══ PAGE 7 NAVIGATION ═══════════════════════ */
const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME';   // ← your GitHub username
const GITHUB_REPO  = 'YOUR_REPOSITORY_NAME';   // ← repository name
const GITHUB_BRANCH = 'main';                  // ← branch (usually 'main')
const GITHUB_PATH  = 'content/content.json';   // ← path inside the repo

(function loadContentJSON() {
  /* Build the raw.githubusercontent URL with a cache-buster so the
     browser never serves a stale file from disk cache. */
  const rawBase = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}`;
  const url = rawBase + '?v=' + Date.now();

  fetch(url)
    .then(r => r.ok ? r.json() : Promise.reject('not found'))
    .then(data => {

      /* ── 1. Merge JSON language data into C[] ──────────────
         C[] is what renderP2() reads. We overwrite only the
         fields the editor can change; anything absent in JSON
         keeps the hardcoded fallback value.                   */
      ['en', 'vi'].forEach(lang => {
        const jl = data[lang];
        if (!jl) return;
        const cl = C[lang];                  // reference to existing object
        if (jl.nsub)    cl.nsub    = jl.nsub;
        if (jl.resFile) cl.resFile = jl.resFile;
        if (jl.resTxt)  cl.resTxt  = jl.resTxt;
        if (jl.lblAbout) cl.lblAbout = jl.lblAbout;
        if (jl.lblFilms) cl.lblFilms = jl.lblFilms;
        if (jl.lblSw)    cl.lblSw    = jl.lblSw;
        if (jl.lblExp)   cl.lblExp   = jl.lblExp;
        if (Array.isArray(jl.about) && jl.about.length)  cl.about = jl.about;
        if (jl.quote)                                      cl.quote = jl.quote;
        if (Array.isArray(jl.films) && jl.films.length)  cl.films = jl.films;
        if (Array.isArray(jl.sw)    && jl.sw.length)     cl.sw    = jl.sw;
        if (Array.isArray(jl.exp)   && jl.exp.length)    cl.exp   = jl.exp;
      });

      /* Re-render About page if it is already visible */
      if (currentPage === 2) renderP2(currentLang);

      /* ── 2. Portrait ───────────────────────────────────────
         If the editor exported a base64 portrait, apply it to
         both the P1 portrait and the P2 fixed portrait.       */
      const ct = data.contact;
      if (ct && ct.portrait) {
        portraitSrc = ct.portrait;
        /* P1 portrait img */
        const p1img = document.querySelector('#p1-portrait-wrap img');
        if (p1img) {
          p1img.src = ct.portrait;
          p1img.style.display = 'block';
        }
        const p1ph = document.getElementById('p1-portrait-ph');
        if (p1ph) p1ph.style.display = 'none';
        /* P2 / P7 fixed portrait */
        const p2img = document.querySelector('#p2-portrait-fixed img');
        if (p2img) {
          p2img.src = ct.portrait;
          p2img.style.display = 'block';
        }
      }

      /* ── 3. Contact page (P7) ──────────────────────────── */
      if (ct) {
        const q = document.getElementById('p7-quote-text');
        if (q && ct.quote) q.textContent = '\u201C' + ct.quote + '\u201D';

        const ph = document.getElementById('p7-phone-link');
        if (ph && ct.phone) {
          ph.href = 'tel:' + ct.phone.replace(/\s/g,'');
          ph.textContent = ct.phone;
        }
        const em = document.getElementById('p7-email-link');
        if (em && ct.email) {
          em.href = 'mailto:' + ct.email;
          em.textContent = ct.email;
        }
        const fb = document.getElementById('p7-facebook-link');
        if (fb && ct.facebook) {
          fb.href = ct.facebook.link || fb.href;
          fb.textContent = ct.facebook.name || fb.textContent;
        }
        const ig = document.getElementById('p7-instagram-link');
        if (ig && ct.instagram) {
          ig.href = ct.instagram.link || ig.href;
          ig.textContent = ct.instagram.name || ig.textContent;
        }
      }

      /* ── 4. Project arrays (P3–P6) ─────────────────────── */
      const pr = data.projects;
      if (pr) {
        if (pr.production) window._P3 = pr.production;
        if (pr.director)   window._P4 = pr.director;
        if (pr.ad)         window._P5 = pr.ad;
        if (pr.editor)     window._P6 = pr.editor;
      }

    })
    .catch(() => { /* fetch failed — all hardcoded C[] fallbacks remain */ });
})();


(function () {
  const nav     = document.getElementById('side-nav');
  const panel   = document.getElementById('menu-panel');
  const overlay = document.getElementById('menu-overlay');

  // Map page number → CSS class for highlight
  const pgClass = { 1:'pg1', 2:'pg2', 3:'pg3', 4:'pg4', 5:'pg5', 6:'pg6', 7:'pg7' };

  // Show hamburger after language is chosen — only if not on page 1
  function showSideNav() {
    if (currentPage !== 1) nav.classList.add('vis');
  }

  // Update panel highlight class; always show hamburger
  function updateSideNav(page) {
    panel.className = panel.className.replace(/\bpg\d+\b/g, '').trim();
    if (pgClass[page]) panel.classList.add(pgClass[page]);
    nav.classList.add('vis');
    if (page === 1) closeMenu();
    if (typeof updateMenuState === 'function') updateMenuState();
  }

  function toggleMyProjects() {
    menuMyProjectsExpanded = !menuMyProjectsExpanded;
    updateMenuState();
  }

  function updateMenuState() {
    const subgroup = document.getElementById('myproj-subgroup');
    const myProjBtn = panel.querySelector('.myproj-btn');
    if (!subgroup) return;
    subgroup.classList.toggle('subgroup-hidden', !menuMyProjectsExpanded);
    if (myProjBtn) myProjBtn.classList.toggle('expanded', menuMyProjectsExpanded);
  }

  // Open menu
  function openMenu() {
    nav.classList.add('open');
    panel.classList.add('vis');
    overlay.classList.add('vis');
    panel.setAttribute('aria-hidden', 'false');
  }

  // Close menu
  function closeMenu() {
    nav.classList.remove('open');
    panel.classList.remove('vis');
    overlay.classList.remove('vis');
    panel.setAttribute('aria-hidden', 'true');
  }

  // Toggle
  window.snavToggle = function () {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  };
  window.snavClose = closeMenu;

  // Central dispatcher — unchanged navigation logic
  window.snavGo = function (target) {
    if (isTransitioning) return;
    if (target === currentPage) { closeMenu(); return; }
    lockNav(2200);

    if (target === 1) {
      if      (currentPage === 2) goToPage1();
      else if (currentPage === 3) goToPage1FromP3();
      else if (currentPage === 4) goToPage1FromP4();
      else if (currentPage === 5) goToPage1FromP5();
      else if (currentPage === 6) goToPage1FromP6();
      else if (currentPage === 7) goToPage1FromP7();
      updateSideNav(1);
      return;
    }

    if (target === 2) {
      if (currentPage !== 1) snavGo(1);
      setTimeout(() => {
        if (currentPage === 1) handlePortraitClick();
      }, currentPage === 1 ? 0 : 750);
      return;
    }

    if (target === 7) {
      if (currentPage !== 1) {
        snavGo(1);
        setTimeout(() => { scatterWords(() => goToPage7()); }, 750);
      } else {
        scatterWords(() => goToPage7());
      }
      return;
    }

    const goFn = { 3: goToPage3, 4: goToPage4, 5: goToPage5, 6: goToPage6 };
    if (goFn[target]) {
      if (currentPage !== 1) {
        snavGo(1);
        setTimeout(() => { scatterWords(() => goFn[target]()); }, 750);
      } else {
        scatterWords(() => goFn[target]());
      }
    }
    updateSideNav(target);
  };

  // Expose globals
  window.updateSideNav    = updateSideNav;
  window.showSideNav      = showSideNav;
  window.toggleMyProjects = toggleMyProjects;
  window.updateMenuState  = updateMenuState;
  window.resetAllPages    = resetAllPages;
  window.pushRoute        = pushRoute;

  // Navigate directly to a project from side nav
  window.snavToProj = function(id, fromPage) {
    snavClose();
    goToProjectPage(id, fromPage);
  };

  // Cursor hover on all interactive nav elements
  document.querySelectorAll('.snav-item, .snav-sub, .snav-proj, .myproj-btn, #snav-burger').forEach(el => addHC(el));
  document.querySelectorAll('a.p7-cval, .p7-cval[href]').forEach(el => addHC(el));
})();

