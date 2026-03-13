const P3_PROJECTS = [
  {
    id:'phia-sau-nguoi-linh',
    title:'Phía Sau Người Lính',
    en:'Behind the Soldier',
    year:'2023',
    role:'Production Assistant',
    desc:'Short film exploring life behind the journey of a soldier — logistics, coordination, and on-set support.',
    about:[
      'Phía Sau Người Lính (Behind the Soldier) là một dự án phim ngắn sinh viên của trường Đại học Văn Lang, do đạo diễn Lê Diễm Quỳnh thực hiện. Bộ phim khai thác cuộc sống và những hy sinh thầm lặng của người lính và gia đình họ.',
    ],
    credits:[
      { label:'Director',      value:'Lê Diễm Quỳnh' },
      { label:'1st AD',        value:'Phạm Hữu Trí' },
      { label:'Producer',      value:'Thục Mai' },
      { label:'Production Assistant', value:'Quốc Hưng' },
      { label:'D.O.P',         value:'Mạch Mẫn Nhi' },
    ],
    stills:[],
    bts:[],
    video:'https://www.youtube.com/watch?v=4hfUn5yGVwI',
    img:null,
  },
  {
    id:'canh-dong-bat-tan',
    video:null,
    title:'Cánh Đồng Bất Tận',
    en:'Endless Field',
    year:'2023',
    role:'Production Coordinator',
    desc:'A rural drama production requiring multi-location scheduling and crew management across three provinces.',
    about:[
      'Cánh Đồng Bất Tận là một dự án phim ngắn được sản xuất tại nhiều địa điểm khác nhau, đòi hỏi sự phối hợp chặt chẽ giữa các đoàn phim trải dài trên ba tỉnh thành. Bộ phim là câu chuyện về người nông dân và những vùng đất bất tận.',
    ],
    credits:[
      { label:'Director',            value:'—' },
      { label:'Production Coordinator', value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'nguoi-o-lai',
    video:null,
    title:'Người Ở Lại',
    en:'The One Who Stays',
    year:'2024',
    role:'Line Producer',
    desc:'Independent short film — full production lifecycle from pre-production planning through post-delivery.',
    about:[
      'Người Ở Lại là một phim ngắn độc lập đi qua toàn bộ vòng đời sản xuất, từ giai đoạn tiền kỳ lên kế hoạch cho đến hậu kỳ hoàn thiện. Bộ phim kể câu chuyện về những người ở lại và sự hi sinh thầm lặng trong cuộc sống.',
    ],
    credits:[
      { label:'Line Producer', value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
    img:null,
  },
  {
    id:'nua-to-giay',
    video:null,
    title:'Nửa Tờ Giấy Gặp Bấy Nhiêu Tay',
    en:'Half a Page Through Many Hands',
    year:'2025',
    role:'Producer',
    desc:'Golden Kite Award — Certificate of Merit 2025. Produced in collaboration with director Hà Tất Thành.',
    about:[
      'Nửa Tờ Giấy Gặp Bấy Nhiêu Tay là bộ phim ngắn đạt Bằng Khen tại Liên hoan phim Cánh Diều Vàng 2025. Bộ phim được sản xuất với đạo diễn Hà Tất Thành, khai thác hành trình của những mảnh giấy — biểu tượng cho ký ức và kết nối con người.',
    ],
    credits:[
      { label:'Director', value:'Hà Tất Thành' },
      { label:'Producer', value:'Quốc Hưng' },
    ],
    stills:[],
    bts:[],
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
