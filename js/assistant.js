const P5_PROJECTS = [
  {
    id:'hoa-no-tren-tan-thuoc',
    video:'https://www.facebook.com/watch/?v=3537786149858442',
    title:'HOA NỞ TRÊN TÀN THUỐC',
    en:'FLOWERS BLOOM ON CIGARETTE ASHES',
    year:'2024',
    role:'Assistant Director',
    role_vi:'Trợ lí đạo diễn',
    desc:'A student short film from Van Lang University. Screened at Lift Off Session 2026 Volume 1, FABA Film Festival, and selected for Węgiel Film Festival.',
    desc_vi:'Phim ngắn sinh viên của trường Đại học Văn Lang. Phim được trình chiếu tại Lift Off Session 2026 Volume 1, FABA Film Festival và được chọn tham gia Węgiel Film Festival.',
    about:[
      'Hoa Nở Trên Tàn Thuốc là phim ngắn sinh viên của trường Đại học Văn Lang, được trình chiếu tại Lift Off Session 2026 Volume 1, FABA Film Festival và được chọn tham gia Węgiel Film Festival.',
    ],
    about_en:[
      'Flowers Bloom on Cigarette Ashes is a student short film from Van Lang University, screened at Lift Off Session 2026 Volume 1, FABA Film Festival, and selected for Węgiel Film Festival.',
    ],
    credits:[
      { label:'Director', label_vi:'Đạo diễn', value:'Huỳnh Việt Bảo Phúc' },
      { label:'1st Assistant Director', label_vi:'Trợ lí đạo diễn 1', value:'Quốc Hưng' },
      { label:'Producer', label_vi:'Sản xuất', value:'Phan Quốc Anh, Phan Thiện Anh, Vũ Đức Hùng, Huỳnh Việt Bảo Phúc' },
      { label:'Director of Photography', label_vi:'Quay phim', value:'Hà Tất Thành' },
      { label:'Gaffer', label_vi:'Gaffer', value:'Trần Thành Công' },
      { label:'Art Director', label_vi:'Giám đốc nghệ thuật', value:'Phạm Kim Mỹ' },
      { label:'Starring', label_vi:'Diễn viên', value:'Vũ Đức Hùng, Mai Ngọc Nhi, Lê Nguyễn Duy, …' },
    ],
    stills:[
      'assets/myproject/ad/hoa nở trên tàn thuốc/1.jpg',
      'assets/myproject/ad/hoa nở trên tàn thuốc/2.jpg',
      'assets/myproject/ad/hoa nở trên tàn thuốc/3.jpg',
      'assets/myproject/ad/hoa nở trên tàn thuốc/4.jpg',
      'assets/myproject/ad/hoa nở trên tàn thuốc/5.jpg',
      'assets/myproject/ad/hoa nở trên tàn thuốc/6.jpg',
      'assets/myproject/ad/hoa nở trên tàn thuốc/7.png',
    ],
    bts:[],
    img:'assets/myproject/ad/hoa nở trên tàn thuốc/1.jpg',
  },
  {
    id:'shipaholic',
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
        <div class="p5-card-title">${currentLang === 'en' && proj.en ? proj.en : proj.title}</div>
        <div class="p5-card-meta">${proj.year} — ${currentLang === 'en' ? proj.role : (proj.role_vi || proj.role)}</div>
        <div class="p5-card-desc">${currentLang === 'en' ? proj.desc : (proj.desc_vi || proj.desc)}</div>
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

