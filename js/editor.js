const P6_PROJECTS = [
  {
    id:'edit-lang-le',
    title:'Lặng Lẽ Trôi Về',
    year:'2026',
    role:'Editor',
    desc:"Jury's Grand Prize — Lift-Off Sessions 2026. Picture edit, colour grade, and sound mix.",
    img:null,
  },
  {
    id:'edit-dau-phay',
    title:'Thêm Một "Dấu Phẩy"',
    year:'2024',
    role:'Editor',
    desc:'Documentary short — assembly through fine cut, pacing built around observational long takes.',
    img:null,
  },
  {
    id:'edit-hanh-phuc',
    title:'Hạnh Phúc Của Ánh Dương',
    year:'2023',
    role:'Editor',
    desc:'Best Short Film — 1 Minute to Shine 2023. Edited on Premiere Pro with custom LUT colour grade.',
    img:null,
  },
  {
    id:'edit-chuyen-cu',
    title:'Chuyện Cũ',
    year:'2024',
    role:'Editor',
    desc:'Narrative short — dialogue-heavy scenes cut for rhythm and emotional pacing.',
    img:null,
  },
];

function renderP6() {
  const projects = window._P6 || P6_PROJECTS;
  const grid = document.getElementById('p6-grid');
  grid.innerHTML = projects.map(proj => `
    <div class="p6-card" onclick="goToProjectPage('${proj.id}')">
      <div class="p6-card-img-wrap">
        ${proj.img
          ? `<img src="${proj.img}" alt="${proj.title}"/>
             <div class="p6-card-img-overlay"></div>`
          : `<div class="p6-card-img-placeholder">
               <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                 <rect x="4" y="10" width="40" height="28" rx="2" stroke="#ffe000" stroke-width=".8"/>
                 <circle cx="16" cy="20" r="4" stroke="#ffe000" stroke-width=".8"/>
                 <path d="M4 34 L16 22 L26 32 L34 24 L44 34" stroke="#ffe000" stroke-width=".8" fill="none"/>
               </svg>
             </div>`
        }
      </div>
      <div class="p6-card-body">
        <div class="p6-card-title">${proj.title}</div>
        <div class="p6-card-meta">${proj.year} — ${proj.role}</div>
        <div class="p6-card-desc">${proj.desc}</div>
      </div>
    </div>`).join('');
}

function goToPage6() {
  if (currentPage === 6) return;
  currentPage = 6;
  if (window.updateSideNav) updateSideNav(6);
  renderP6();
  document.getElementById('p1').classList.add('slide-out');
  document.getElementById('p6').classList.add('slide-in');
  document.getElementById('p6-scroll').scrollTop = 0;
  setTimeout(() => {
    document.getElementById('p6-header').classList.add('in');
    document.getElementById('p6-divider').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p6-grid').classList.add('in');
  }, 340);
}

function goToPage1FromP6() {
  if (currentPage !== 6) return;
  currentPage = 1;
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p6').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p6-header').classList.remove('in');
    document.getElementById('p6-divider').classList.remove('in');
    document.getElementById('p6-grid').classList.remove('in');
  }, 720);
  returnWords();
  showToast('← Back to home');
}

