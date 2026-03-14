const P5_PROJECTS = [
  {
    id:'ad-hanh-phuc',
    video:null,
    title:'Hạnh Phúc Của Ánh Dương',
    en:"Sunshine's Happiness",
    year:'2023',
    role:'1st Assistant Director',
    desc:'Best Short Film — 1 Minute to Shine 2023 (FPT University). Coordinated a crew of 12 on a single-day shoot.',
    about:[
      'Hạnh Phúc Của Ánh Dương đoạt giải Phim Ngắn Hay Nhất tại 1 Minute to Shine 2023 (Đại học FPT). Với vai trò 1st AD, đã phối hợp điều phối ê-kíp 12 người trong một ngày quay duy nhất, đảm bảo tiến độ và chất lượng hình ảnh.',
    ],
    credits:[
      { label:'Director',    value:'—' },
      { label:'1st AD',      value:'Quốc Hưng' },
      { label:'Crew',        value:'12 người' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'ad-song-xanh',
    video:null,
    title:'Sóng Xanh',
    en:'Blue Wave',
    year:'2023',
    role:'Assistant Director',
    desc:'Coastal drama — managed locations, extras coordination, and daily shooting schedule across 4 days.',
    about:[
      'Sóng Xanh là một drama bối cảnh biển, đòi hỏi quản lý nhiều địa điểm, điều phối diễn viên quần chúng và lịch quay hàng ngày trong suốt 4 ngày. Đây là một trong những dự án thử thách lớn đầu tiên với vai trò AD.',
    ],
    credits:[
      { label:'Director',    value:'—' },
      { label:'AD',          value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'ad-buc-tranh',
    video:null,
    title:'Bức Tranh Cuối',
    en:'The Last Painting',
    year:'2024',
    role:'1st Assistant Director',
    desc:'Period piece set in the 1980s — led rehearsals, continuity supervision, and shot list management.',
    about:[
      'Bức Tranh Cuối là bộ phim phục trang lấy bối cảnh thập niên 1980. Với vai trò 1st AD, đã dẫn dắt buổi tập, giám sát tính liên tục và quản lý danh sách cảnh quay — đảm bảo sự nhất quán xuyên suốt quá trình sản xuất.',
    ],
    credits:[
      { label:'Director',    value:'—' },
      { label:'1st AD',      value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'ad-mot-buoi-sang',
    video:null,
    title:'Một Buổi Sáng',
    en:'One Morning',
    year:'2024',
    role:'Assistant Director',
    desc:'Character-driven slice-of-life short — tight single-location schedule, coordinated 8-person crew.',
    about:[
      'Một Buổi Sáng là phim ngắn slice-of-life lấy nhân vật làm trung tâm, quay trong một địa điểm duy nhất với lịch trình chặt chẽ. Đã phối hợp điều phối ê-kíp 8 người, đảm bảo nhịp điệu quay phù hợp với tính chất nhẹ nhàng của câu chuyện.',
    ],
    credits:[
      { label:'Director',    value:'—' },
      { label:'AD',          value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
];


function renderP5() {
  const projects = window._P5 || P5_PROJECTS;
  const grid = document.getElementById('p5-grid');
  grid.innerHTML = projects.map(proj => `
    <div class="p5-card" onclick="goToProjectPage('${proj.id}',5)">
      <div class="p5-card-img-wrap">
        ${proj.img
          ? `<img src="${proj.img}" alt="${proj.title}"/>
             <div class="p5-card-img-overlay"></div>`
          : `<div class="p5-card-img-placeholder">
               <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                 <rect x="4" y="10" width="40" height="28" rx="2" stroke="#ff1a1a" stroke-width=".8"/>
                 <circle cx="16" cy="20" r="4" stroke="#ff1a1a" stroke-width=".8"/>
                 <path d="M4 34 L16 22 L26 32 L34 24 L44 34" stroke="#ff1a1a" stroke-width=".8" fill="none"/>
               </svg>
             </div>`
        }
      </div>
      <div class="p5-card-body">
        <div class="p5-card-title">${proj.title}</div>
        <div class="p5-card-meta">${proj.year} — ${proj.role}</div>
        <div class="p5-card-desc">${proj.desc}</div>
      </div>
    </div>`).join('');
}

function goToPage5() {
  if (currentPage === 5) return;
  if (window.hideFloatingWords) hideFloatingWords();
  if (window.stopHomeMusic) stopHomeMusic();
  if (window.resetAllPages) resetAllPages();
  currentPage = 5;
  if (window.pushRoute) pushRoute('/assistant-director');
  if (window.updateSideNav) updateSideNav(5);
  renderP5();
  document.getElementById('p1').classList.add('slide-out');
  document.getElementById('p5').classList.add('slide-in');
  document.getElementById('p5-scroll').scrollTop = 0;
  setTimeout(() => {
    document.getElementById('p5-header').classList.add('in');
    document.getElementById('p5-divider').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p5-grid').classList.add('in');
  }, 340);
  const p2hint = document.getElementById('p2-hint');
  if (p2hint) p2hint.style.display = 'none';
  if (window.updateMenuState) updateMenuState();
}

function goToPage1FromP5() {
  if (currentPage !== 5) return;
  currentPage = 1;
  if (window.pushRoute) pushRoute('/');
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p5').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p5-header').classList.remove('in');
    document.getElementById('p5-divider').classList.remove('in');
    document.getElementById('p5-grid').classList.remove('in');
  }, 720);
  returnWords();
  if (window.updateMenuState) updateMenuState();
}

