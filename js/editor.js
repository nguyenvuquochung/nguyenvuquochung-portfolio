const P6_PROJECTS = [
  {
    id:'shipaholic-editor',
    video:'https://www.youtube.com/watch?v=7v4_zNXeUTc',
    title:'SHIPAHOLIC',
    en:'SHIPAHOLIC',
    year:'2025',
    role:'Assistant Director, Editor',
    role_vi:'Trợ lí đạo diễn, Dựng phim',
    desc:'A creative class project by RMIT students to promote the board game "Shipaholic".',
    desc_vi:'TVC là dự án học thuật của sinh viên trường RMIT, quảng bá cho trò chơi board game "Shipaholic".',
    about:[
      'Shipaholic là TVC thuộc dự án học thuật của sinh viên trường RMIT, được thực hiện để quảng bá cho trò chơi board game "Shipaholic".',
    ],
    about_en:[
      'Shipaholic is a creative class project by RMIT students, produced to promote the board game "Shipaholic".',
    ],
    credits:[],
    stills:[],
    bts:[
      'assets/myproject/ad/shipaholic/still/image (1).png',
      'assets/myproject/ad/shipaholic/still/image (2).png',
      'assets/myproject/ad/shipaholic/still/image.png',
      'assets/myproject/ad/shipaholic/still/IMG_0512.JPG.jpg',
      'assets/myproject/ad/shipaholic/still/IMG_0570.JPG.jpg',
      'assets/myproject/ad/shipaholic/still/IMG_0585.JPG.jpg',
      'assets/myproject/ad/shipaholic/still/IMG_3455.JPG.jpg',
      'assets/myproject/ad/shipaholic/still/IMG_3527.jpeg',
      'assets/myproject/ad/shipaholic/still/IMG_3539.jpeg',
    ],
    img:'assets/myproject/ad/shipaholic/Screenshot 2026-03-17 145902.png',
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
        <div class="p6-card-meta">${proj.year} — ${currentLang === 'en' ? proj.role : (proj.role_vi || proj.role)}</div>
        <div class="p6-card-desc">${currentLang === 'en' ? proj.desc : (proj.desc_vi || proj.desc)}</div>
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

