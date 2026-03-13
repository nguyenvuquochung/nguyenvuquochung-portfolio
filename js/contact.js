function goToPage7() {
  if (currentPage === 7) return;
  currentPage = 7;
  if (window.pushRoute) pushRoute('/contact');
  if (window.updateSideNav) updateSideNav(7);
  if (portraitSrc) {
    document.getElementById('p2-portrait-img2').src = portraitSrc;
    document.getElementById('p2-portrait-img2').style.display = 'block';
    document.getElementById('p2-portrait-ph2').style.display  = 'none';
  }
  document.getElementById('p1').classList.add('slide-out');
  document.getElementById('p7').classList.add('slide-in');
  document.getElementById('p7-left').scrollTop  = 0;
  document.getElementById('p7-right').scrollTop = 0;
  setTimeout(() => {
    document.getElementById('p2-portrait-fixed').classList.add('in');
  }, 120);
  setTimeout(() => {
    document.getElementById('p7-left').classList.add('in');
    document.getElementById('p7-right').classList.add('in');
  }, 340);
}

function goToPage1FromP7() {
  if (currentPage !== 7) return;
  currentPage = 1;
  if (window.pushRoute) pushRoute('/');
  if (window.updateSideNav) updateSideNav(1);
  document.getElementById('p1').classList.remove('slide-out');
  document.getElementById('p7').classList.remove('slide-in');
  setTimeout(() => {
    document.getElementById('p2-portrait-fixed').classList.remove('in');
    document.getElementById('p7-left').classList.remove('in');
    document.getElementById('p7-right').classList.remove('in');
  }, 720);
  returnWords();
  showToast('← Back to home');
}

/* ══ CONTENT.JSON LOADER ══════════════════════
   Fetches content.json from GitHub (raw CDN) so the
   portfolio always reflects the latest committed data.
   Falls back silently to hardcoded C[] values if the
   fetch fails (offline / token not set / first load).

   ┌─ CONFIGURE ──────────────────────────────────────┐
   │ Set these to match your GitHub repository.       │
   │ They must match the values in editor/editor.html │
   └──────────────────────────────────────────────────┘ */
