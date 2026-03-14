const P6_PROJECTS = [
  {
    id:'edit-lang-le',
    video:null,
    title:'Lặng Lẽ Trôi Về',
    en:'Quietly Drifting Back',
    year:'2026',
    role:'Editor',
    desc:"Jury's Grand Prize — Lift-Off Sessions 2026. Picture edit, colour grade, and sound mix.",
    about:[
      'Lặng Lẽ Trôi Về đoạt Jury Grand Prize tại Lift-Off Sessions 2026. Với vai trò editor, đảm nhận toàn bộ dựng hình, chỉnh màu và mix âm thanh — xây dựng nhịp điệu phim xung quanh sự lặng lẽ và những khoảng trống giàu cảm xúc.',
    ],
    credits:[
      { label:'Director',      value:'Quốc Hưng' },
      { label:'Editor',        value:'Quốc Hưng' },
      { label:'Colour Grade',  value:'Quốc Hưng' },
      { label:'Sound Mix',     value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'edit-dau-phay',
    video:null,
    title:'Thêm Một "Dấu Phẩy"',
    en:'One More Comma',
    year:'2024',
    role:'Editor',
    desc:'Documentary short — assembly through fine cut, pacing built around observational long takes.',
    about:[
      'Thêm Một "Dấu Phẩy" — dựng phim ngắn tài liệu từ assembly cut đến fine cut, xây dựng nhịp điệu xung quanh những cú máy quan sát dài. Bộ phim đoạt giải Khán giả bình chọn tại Lift-Off Sessions 2026.',
    ],
    credits:[
      { label:'Director',  value:'Quốc Hưng' },
      { label:'Editor',    value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'edit-hanh-phuc',
    video:null,
    title:'Hạnh Phúc Của Ánh Dương',
    en:"Sunshine's Happiness",
    year:'2023',
    role:'Editor',
    desc:'Best Short Film — 1 Minute to Shine 2023. Edited on Premiere Pro with custom LUT colour grade.',
    about:[
      'Hạnh Phúc Của Ánh Dương đoạt giải Phim Ngắn Hay Nhất tại 1 Minute to Shine 2023. Dựng trên Premiere Pro với bảng màu LUT tùy chỉnh, tạo nên tone màu ấm áp và nhất quán xuyên suốt bộ phim.',
    ],
    credits:[
      { label:'Director',      value:'—' },
      { label:'Editor',        value:'Quốc Hưng' },
      { label:'Colour Grade',  value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'edit-chuyen-cu',
    video:null,
    title:'Chuyện Cũ',
    en:'Old Story',
    year:'2024',
    role:'Editor',
    desc:'Narrative short — dialogue-heavy scenes cut for rhythm and emotional pacing.',
    about:[
      'Chuyện Cũ là phim ngắn tự sự với nhiều cảnh thoại nặng — được dựng để tạo nhịp điệu và cảm xúc tự nhiên. Thách thức chính là giữ được sự mạch lạc câu chuyện trong khi cho phép những khoảng im lặng cần thiết.',
    ],
    credits:[
      { label:'Director',  value:'—' },
      { label:'Editor',    value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
];

function renderP6() {
  const projects = window._P6 || P6_PROJECTS;
  const grid = document.getElementById('p6-grid');
  grid.innerHTML = projects.map(proj => `
    <div class="p6-card" onclick="goToProjectPage('${proj.id}',6)">
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
        <div class="p6-card-title">${currentLang === 'en' && proj.en ? proj.en : proj.title}</div>
        <div class="p6-card-meta">${proj.year} — ${proj.role}</div>
        <div class="p6-card-desc">${proj.desc}</div>
      </div>
    </div>`).join('');
}

function goToPage6() {
  if (currentPage === 6) return;
  if (window.hideFloatingWords) hideFloatingWords();
  if (window.stopHomeMusic) stopHomeMusic();
  if (window.resetAllPages) resetAllPages();
  currentPage = 6;
  if (window.pushRoute) pushRoute('/editor');
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
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.style.display = 'none';
  if (window.updateMenuState) updateMenuState();
}

function goToPage1FromP6() {
  if (currentPage !== 6) return;
  currentPage = 1;
  if (window.pushRoute) pushRoute('/');
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p6').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p6-header').classList.remove('in');
    document.getElementById('p6-divider').classList.remove('in');
    document.getElementById('p6-grid').classList.remove('in');
  }, 720);
  returnWords();
  if (window.updateMenuState) updateMenuState();
}

