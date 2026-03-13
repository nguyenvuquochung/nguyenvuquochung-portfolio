const P3_PROJECTS = [
  {
    id:'phia-sau-nguoi-linh',
    title:'Phía Sau Người Lính',
    year:'2023',
    role:'Production Assistant',
    desc:'Short film exploring life behind the journey of a soldier — logistics, coordination, and on-set support.',
    img:null,
  },
  {
    id:'canh-dong-bat-tan',
    title:'Cánh Đồng Bất Tận',
    year:'2023',
    role:'Production Coordinator',
    desc:'A rural drama production requiring multi-location scheduling and crew management across three provinces.',
    img:null,
  },
  {
    id:'nguoi-o-lai',
    title:'Người Ở Lại',
    year:'2024',
    role:'Line Producer',
    desc:'Independent short film — full production lifecycle from pre-production planning through post-delivery.',
    img:null,
  },
  {
    id:'nua-to-giay',
    title:'Nửa Tờ Giấy Gặp Bấy Nhiêu Tay',
    year:'2025',
    role:'Producer',
    desc:'Golden Kite Award — Certificate of Merit 2025. Produced in collaboration with director Hà Tất Thành.',
    img:null,
  },
];



function renderP3() {
  const projects = window._P3 || P3_PROJECTS;
  const grid = document.getElementById('p3-grid');
  grid.innerHTML = projects.map(proj => `
    <div class="p3-card" onclick="goToProjectPage('${proj.id}',3)">
      <div class="p3-card-img-wrap">
        ${proj.img
          ? `<img src="${proj.img}" alt="${proj.title}"/>
             <div class="p3-card-img-overlay"></div>`
          : `<div class="p3-card-img-placeholder">
               <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                 <rect x="4" y="10" width="40" height="28" rx="2" stroke="#00e676" stroke-width=".8"/>
                 <circle cx="16" cy="20" r="4" stroke="#00e676" stroke-width=".8"/>
                 <path d="M4 34 L16 22 L26 32 L34 24 L44 34" stroke="#00e676" stroke-width=".8" fill="none"/>
               </svg>
             </div>`
        }
      </div>
      <div class="p3-card-body">
        <div class="p3-card-title">${proj.title}</div>
        <div class="p3-card-meta">${proj.year} — ${proj.role}</div>
        <div class="p3-card-desc">${proj.desc}</div>
      </div>
    </div>`).join('');
}

function goToPage3() {
  if (currentPage === 3) return;
  if (window.resetAllPages) resetAllPages();
  currentPage = 3;
  if (window.pushRoute) pushRoute('/production');
  if (window.updateSideNav) updateSideNav(3);
  renderP3();
  document.getElementById('p1').classList.add('slide-out');
  document.getElementById('p3').classList.add('slide-in');
  document.getElementById('p3-scroll').scrollTop = 0;
  setTimeout(() => {
    document.getElementById('p3-header').classList.add('in');
    document.getElementById('p3-divider').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p3-grid').classList.add('in');
  }, 340);
}

function goToPage1FromP3() {
  if (currentPage !== 3) return;
  currentPage = 1;
  if (window.pushRoute) pushRoute('/');
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p3').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p3-header').classList.remove('in');
    document.getElementById('p3-divider').classList.remove('in');
    document.getElementById('p3-grid').classList.remove('in');
  }, 720);
  returnWords();
  showToast('← Back to home');
}
