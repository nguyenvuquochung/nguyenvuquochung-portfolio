/* ══ RENDER P2 ═══════════════════════════════ */
function renderP2(lang) {
  const c = C[lang];
  document.getElementById('p2-nsub').textContent     = c.nsub;
  document.getElementById('p2-res-txt').textContent  = c.resTxt;
  document.getElementById('p2-res-link').href        = c.resFile;
  document.getElementById('p2l-about').textContent   = c.lblAbout;
  document.getElementById('p2l-films').textContent   = c.lblFilms;
  document.getElementById('p2l-sw').textContent      = c.lblSw;
  document.getElementById('p2l-exp').textContent     = c.lblExp;

  document.getElementById('p2-about').innerHTML  = c.about.map(p=>`<p>${p}</p>`).join('');
  document.getElementById('p2-quote').textContent = c.quote;

  document.getElementById('p2-films').innerHTML = c.films.map(f=>`
    <div class="p2-film">
      <div class="p2-ftype">${f.type}</div>
      <div class="p2-ftitle">${f.title}</div>
      ${f.en?`<div class="p2-fen">${f.en}</div>`:''}
      ${f.credits?`<div class="p2-fcred">${f.credits}</div>`:''}
      <ul class="p2-awards">${f.awards.map(a=>`<li>${a}</li>`).join('')}</ul>
    </div>`).join('');

  document.getElementById('p2-sw').innerHTML = c.sw.map(s=>`
    <div class="p2-sw">
      <div class="p2-swn">${s.n}</div>
      <div class="p2-swd">${s.d}</div>
    </div>`).join('');

  document.getElementById('p2-exp').innerHTML = c.exp.map(e=>`<li>${e}</li>`).join('');
}
