const P4_PROJECTS = [
  {
    id:'ha-canh',
    video:null,
    title:'Hạ Cánh',
    en:'Landing',
    year:'2023',
    role:'Director',
    desc:'A quiet story about homecoming — visual language built around stillness and long takes.',
    about:[
      'Hạ Cánh là câu chuyện trầm lặng về sự trở về — ngôn ngữ hình ảnh được xây dựng xung quanh sự tĩnh lặng và những cú máy dài. Bộ phim khám phá không gian nội tâm của nhân vật trong khoảnh khắc trở về nơi quen thuộc.',
    ],
    credits:[
      { label:'Director',    value:'Quốc Hưng' },
      { label:'D.O.P',       value:'—' },
      { label:'Sound',       value:'—' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'dem-cuoi',
    video:null,
    title:'Đêm Cuối',
    en:'The Last Night',
    year:'2024',
    role:'Director',
    desc:'Short fiction about the last night before departure — directed for international festival circuit.',
    about:[
      'Đêm Cuối là một phim ngắn hư cấu về đêm cuối cùng trước khi chia xa — được thực hiện cho vòng liên hoan phim quốc tế. Bộ phim đi sâu vào những cảm xúc không thể nói thành lời trong khoảnh khắc từ biệt.',
    ],
    credits:[
      { label:'Director',    value:'Quốc Hưng' },
      { label:'D.O.P',       value:'—' },
      { label:'Cast',        value:'—' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'lang-le-troi-ve',
    video:null,
    title:'Lặng Lẽ Trôi Về',
    en:'Quietly Drifting Back',
    year:'2026',
    role:'Director',
    desc:"Jury's Winner — Filmmaker Lift-Off Sessions 2026. Nominated Lift-Off Season Awards 2026.",
    about:[
      'Lặng Lẽ Trôi Về là bộ phim đoạt giải Jury tại Filmmaker Lift-Off Sessions 2026 và được đề cử tại Lift-Off Season Awards 2026. Bộ phim là hành trình nội tâm về ký ức, về những gì đã mất và những điều lặng lẽ trôi về theo dòng thời gian.',
    ],
    credits:[
      { label:'Director',    value:'Quốc Hưng' },
      { label:'Editor',      value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'them-mot-dau-phay',
    video:null,
    title:'Thêm Một "Dấu Phẩy"',
    en:'One More Comma',
    year:'2024',
    role:'Director',
    desc:'Audience Choice Winner — Lift-Off Sessions 2026. Selected for Xinê Xem Fest & Lagi Short Film Night.',
    about:[
      'Thêm Một "Dấu Phẩy" là bộ phim đoạt giải Khán giả bình chọn tại Lift-Off Sessions 2026, được chọn chiếu tại Xinê Xem Fest và Lagi Short Film Night. Bộ phim là câu chuyện về những khoảng dừng trong cuộc sống — như dấu phẩy trong một câu văn, không kết thúc nhưng tạo nên nhịp điệu.',
    ],
    credits:[
      { label:'Director',    value:'Quốc Hưng' },
      { label:'Editor',      value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
];


function renderP4() {
  const projects = window._P4 || P4_PROJECTS;
  const grid = document.getElementById('p4-grid');
  grid.innerHTML = projects.map(proj => `
    <div class="p4-card" onclick="goToProjectPage('${proj.id}',4)">
      <div class="p4-card-img-wrap">
        ${proj.img
          ? `<img src="${proj.img}" alt="${proj.title}"/>
             <div class="p4-card-img-overlay"></div>`
          : `<div class="p4-card-img-placeholder">
               <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                 <rect x="4" y="10" width="40" height="28" rx="2" stroke="#1a6fff" stroke-width=".8"/>
                 <circle cx="16" cy="20" r="4" stroke="#1a6fff" stroke-width=".8"/>
                 <path d="M4 34 L16 22 L26 32 L34 24 L44 34" stroke="#1a6fff" stroke-width=".8" fill="none"/>
               </svg>
             </div>`
        }
      </div>
      <div class="p4-card-body">
        <div class="p4-card-title">${proj.title}</div>
        <div class="p4-card-meta">${proj.year} — ${proj.role}</div>
        <div class="p4-card-desc">${proj.desc}</div>
      </div>
    </div>`).join('');
}

function goToPage4() {
  if (currentPage === 4) return;
  if (window.resetAllPages) resetAllPages();
  currentPage = 4;
  if (window.pushRoute) pushRoute('/director');
  if (window.updateSideNav) updateSideNav(4);
  renderP4();
  document.getElementById('p1').classList.add('slide-out');
  document.getElementById('p4').classList.add('slide-in');
  document.getElementById('p4-scroll').scrollTop = 0;
  setTimeout(() => {
    document.getElementById('p4-header').classList.add('in');
    document.getElementById('p4-divider').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p4-grid').classList.add('in');
  }, 340);
}

function goToPage1FromP4() {
  if (currentPage !== 4) return;
  currentPage = 1;
  if (window.pushRoute) pushRoute('/');
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p4').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p4-header').classList.remove('in');
    document.getElementById('p4-divider').classList.remove('in');
    document.getElementById('p4-grid').classList.remove('in');
  }, 720);
  returnWords();
  showToast('← Back to home');
}

