'use strict';

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
  if (p === '/about')              { triggerPage2(); return; }
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

/* ══ STATE ═══════════════════════════════════ */
let currentLang = 'en';
let portraitSrc = null;
let currentPage = 1;
let isTransitioning = false;

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
function chooseLang(lang) {
  currentLang = lang;
  document.getElementById('lang-screen').classList.add('out');
  document.getElementById('p1-sub').textContent  = C[lang].sub;
  document.getElementById('p1-hint').textContent = C[lang].hint;
  renderP2(lang);
  setTimeout(() => {
    document.getElementById('lang-screen').style.display = 'none';
    document.getElementById('p1-portrait-wrap').classList.add('play');
    document.getElementById('p1-name-block').classList.add('play');
    launchParticles();
    document.body.classList.add('words-active');
    if (window.showSideNav) showSideNav();
    // Navigate to initial URL path if not home
    const initPath = location.pathname;
    if (initPath && initPath !== '/') setTimeout(() => navigateToPath(initPath), 200);
  }, 950);
}

/* ══ RENDER P2 ═══════════════════════════════ */

/* ══ PAGE TRANSITIONS ════════════════════════ */

// Called when portrait is clicked on P1
function triggerPage2() {
  if (currentPage === 2 || isTransitioning) return;
  lockNav(1500);
  // ripple
  const r = document.getElementById('p1-ripple');
  r.classList.remove('fire'); void r.offsetWidth; r.classList.add('fire');
  // scatter words, then navigate
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

function goToPage2() {
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
  setTimeout(() => {
    document.getElementById('p2-portrait-fixed').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p2-left').classList.add('in');
    document.getElementById('p2-right').classList.add('in');
  }, 340);
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
  showToast('← Back to home');
}

/* ══ PAGE 3 NAVIGATION ═══════════════════════ */

let _projFromPage = 0;

function goToProjectPage(id, fromPage) {
  const maps = { 3: P3_PROJECTS, 4: P4_PROJECTS, 5: P5_PROJECTS, 6: P6_PROJECTS };
  const colors = { 3: '#00e676', 4: '#1a6fff', 5: '#ff1a1a', 6: '#ffe000' };
  const proj = (maps[fromPage] || []).find(p => p.id === id);
  if (!proj) return;
  _projFromPage = fromPage;

  const overlay = document.getElementById('proj-overlay');
  overlay.style.setProperty('--proj-color', colors[fromPage] || '#f5f2ee');
  document.getElementById('proj-eyebrow').textContent  = proj.year + ' — ' + proj.role;
  document.getElementById('proj-title').textContent    = proj.title;
  document.getElementById('proj-en-title').textContent = proj.en || '';

  // ABOUT PROJECT
  document.getElementById('proj-about-text').innerHTML =
    (proj.about && proj.about.length)
      ? proj.about.map(p => `<p>${p}</p>`).join('')
      : `<p>${proj.desc}</p>`;

  // VIDEO LINK
  const videoSection = document.getElementById('proj-section-video');
  const videoWrap    = document.getElementById('proj-video-wrap');
  if (proj.video) {
    videoWrap.innerHTML = `<a class="proj-watch-btn" href="${proj.video}" target="_blank" rel="noopener noreferrer">&#9654; Watch Video</a>`;
    videoSection.style.display = '';
  } else {
    videoSection.style.display = 'none';
  }

  // CREDIT
  document.getElementById('proj-credits').innerHTML =
    (proj.credits && proj.credits.length)
      ? proj.credits.map(c => `<div class="proj-credit-row"><span class="proj-credit-label">${c.label}</span><span class="proj-credit-value">${c.value}</span></div>`).join('')
      : '<div class="proj-no-content">—</div>';

  // STILL FRAME
  document.getElementById('proj-stills').innerHTML =
    (proj.stills && proj.stills.length)
      ? proj.stills.map(s => `<img src="${s}" loading="lazy" alt="Still frame"/>`).join('')
      : '<div class="proj-no-content">No stills yet</div>';

  // BEHIND THE SCENE
  document.getElementById('proj-bts').innerHTML =
    (proj.bts && proj.bts.length)
      ? proj.bts.map(s => `<img src="${s}" loading="lazy" alt="Behind the scene"/>`).join('')
      : '<div class="proj-no-content">No BTS yet</div>';

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
  {label:'DIRECTOR',           color:'#1a6fff', page:'page3'},
  {label:'ASSISTANT DIRECTOR', color:'#ff1a1a', page:'page4'},
  {label:'PRODUCTION',         color:'#00e676', page:'page5'},
  {label:'EDITOR',             color:'#ffe000', page:'page6'},
];
const COUNT = 8, VEL_SMP = 6;
let particles = [], activeDrag = null, loopStarted = false, physicsRunning = false;
let gMX = 0, gMY = 0;

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

function launchParticles() {
  let d = 0;
  ROLES.forEach(role => {
    for (let i=0;i<COUNT;i++) { setTimeout(()=>spawnParticle(role), d); d+=95; }
  });
  if (!loopStarted) { loopStarted=true; physicsRunning=true; requestAnimationFrame(loop); }
}

function spawnParticle(role) {
  const el = document.createElement('span');
  el.className = 'rw';
  el.textContent = role.label;
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
  addHC(el);
  requestAnimationFrame(()=>{ el.classList.add('visible'); applyRW(p); });
  particles.push(p);
}

function applyRW(p) { p.el.style.transform = `translate(${p.x}px,${p.y}px)`; }

/* ── drag & throw ── */
document.addEventListener('mousemove', e => {
  gMX=e.clientX; gMY=e.clientY;
  if (!activeDrag) return;
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
  if (!activeDrag) return;
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

function onDown(e, p) {
  if (currentPage !== 1) return;
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

/* physics */
function loop() {
  if (physicsRunning) {
    const ww=window.innerWidth,wh=window.innerHeight,m=2;
    const minY=wh*.08+m;
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      if(p.dragging||p.scattered) continue;
      p.x+=p.vx; p.y+=p.vy;
      const mxX=ww-p.w-m, mxY=wh-p.h-m;
      if(p.x<=m)   {p.x=m;   p.vx= Math.abs(p.vx)*(0.8+Math.random()*.25);}
      if(p.x>=mxX) {p.x=mxX; p.vx=-Math.abs(p.vx)*(0.8+Math.random()*.25);}
      if(p.y<=minY){p.y=minY;p.vy= Math.abs(p.vy)*(0.8+Math.random()*.25);}
      if(p.y>=mxY) {p.y=mxY; p.vy=-Math.abs(p.vy)*(0.8+Math.random()*.25);}  /* mxY now defined above */
      const spd=Math.hypot(p.vx,p.vy);
      if(spd>1.4)         {p.vx*=1.4/spd;p.vy*=1.4/spd;}
      if(spd>0&&spd<0.10) {p.vx*=0.10/spd;p.vy*=0.10/spd;}
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j];if(q.dragging||q.scattered) continue;
        const dx=(q.x+q.w*.5)-(p.x+p.w*.5),dy=(q.y+q.h*.5)-(p.y+p.h*.5);
        const dist=Math.hypot(dx,dy)||.001,minD=(p.w+q.w)*.4;
        if(dist<minD){
          const nx=dx/dist,ny=dy/dist;
          const rel=(p.vx-q.vx)*nx+(p.vy-q.vy)*ny;
          if(rel>0){const imp=rel*.88;p.vx-=imp*nx;p.vy-=imp*ny;q.vx+=imp*nx;q.vy+=imp*ny;}
          const push=(minD-dist)*.52;p.x-=nx*push;p.y-=ny*push;q.x+=nx*push;q.y+=ny*push;
        }
      }
      applyRW(p);
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

  // Update highlight class on the panel; hide burger on page 1
  function updateSideNav(page) {
    panel.className = panel.className.replace(/\bpg\d+\b/g, '').trim();
    if (pgClass[page]) panel.classList.add(pgClass[page]);
    // Page 1 = home/physics page — hide hamburger completely
    if (page === 1) {
      nav.classList.remove('vis');
      closeMenu();
    } else {
      nav.classList.add('vis');
    }
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
        if (currentPage === 1) triggerPage2();
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
  window.updateSideNav  = updateSideNav;
  window.showSideNav    = showSideNav;
  window.resetAllPages  = resetAllPages;
  window.pushRoute      = pushRoute;

  // Navigate directly to a project from side nav
  window.snavToProj = function(id, fromPage) {
    snavClose();
    goToProjectPage(id, fromPage);
  };

  // Cursor hover on all interactive nav elements
  document.querySelectorAll('.snav-item, .snav-sub, .snav-proj, #snav-burger').forEach(el => addHC(el));
})();

