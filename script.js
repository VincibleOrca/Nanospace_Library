(function(){
  const books = [
    {code:"CS · 004.1\nALG-118", title:"Introduction to Algorithms", author:"Cormen, Leiserson, Rivest, Stein", fmt:"print", cat:"cs", avail:"available", isbn:"9780262033848"},
    {code:"CS · 006.3\nMLR-204", title:"Pattern Recognition and Machine Learning", author:"Christopher Bishop", fmt:"ebook", cat:"cs", avail:"available", isbn:"9780387310732"},
    {code:"CS · 005.1\nSYS-092", title:"Designing Data-Intensive Applications", author:"Martin Kleppmann", fmt:"print", cat:"cs", avail:"out", isbn:"9781449373320"},
    {code:"ECON · 332\nBLK-051", title:"Distributed Ledgers & Market Design", author:"S. Voshmgir", fmt:"print", cat:"econ", avail:"held"},
    {code:"ECON · 339\nFIN-140", title:"Principles of Corporate Finance", author:"Brealey, Myers, Allen", fmt:"course", cat:"econ", avail:"available"},
    {code:"ECON · 306\nMAC-077", title:"Foundations of Digital Currency", author:"A. Narayanan et al.", fmt:"ebook", cat:"econ", avail:"available"},
    {code:"PSY · 150\nCOG-033", title:"Cognitive Psychology: A Student's Handbook", author:"Eysenck, Keane", fmt:"print", cat:"psy", avail:"available"},
    {code:"PSY · 302\nSOC-118", title:"The Social Animal", author:"Elliot Aronson", fmt:"print", cat:"psy", avail:"out", isbn:"9781429233413"},
    {code:"PSY · 210\nDEV-064", title:"Developmental Psychology", author:"David Shaffer", fmt:"course", cat:"psy", avail:"available"},
    {code:"NEU · 411\nBRN-002", title:"Principles of Neural Science", author:"Kandel, Schwartz, Jessell", fmt:"print", cat:"neuro", avail:"out", isbn:"9780071390118"},
    {code:"NEU · 205\nCOG-091", title:"Cognitive Neuroscience: The Biology of the Mind", author:"Gazzaniga, Ivry, Mangun", fmt:"print", cat:"neuro", avail:"available"},
    {code:"NEU · 330\nNTX-018", title:"Neurotechnology and Society", author:"R. Yuste", fmt:"ebook", cat:"neuro", avail:"held"},
    {code:"GEN · 101\nWRT-004", title:"Academic Writing for University Studies", author:"META Writing Center", fmt:"course", cat:"gen", avail:"available"},
    {code:"GEN · 110\nMTH-012", title:"Calculus: Early Transcendentals", author:"James Stewart", fmt:"course", cat:"gen", avail:"available"},
    {code:"GEN · 220\nPHL-045", title:"A History of Western Philosophy", author:"Bertrand Russell", fmt:"print", cat:"gen", avail:"held", isbn:"9780671201581"},
    {code:"CS · 007.6\nDBS-133", title:"Database System Concepts", author:"Silberschatz, Korth, Sudarshan", fmt:"course", cat:"cs", avail:"available"},
    {code:"ECON · 315\nGAM-027", title:"Game Theory for Applied Economists", author:"Robert Gibbons", fmt:"print", cat:"econ", avail:"available"},
    {code:"PSY · 401\nCLN-058", title:"Abnormal Psychology", author:"Ronald Comer", fmt:"print", cat:"psy", avail:"available"}
  ];

  const availLabel = {available:"В наличии", held:"В резерве", out:"На руках"};
  const fmtLabel = {print:"Печатное", ebook:"Электронное", course:"Учебное пособие"};

  const listEl = document.getElementById('catalogList');
  const emptyEl = document.getElementById('emptyNote');
  const countEl = document.getElementById('resultCount');
  let activeFilter = 'all';
  let query = '';

  function render(){
    const fmtChecked = Array.from(document.querySelectorAll('[data-fmt]')).filter(c=>c.checked).map(c=>c.dataset.fmt);
    const availChecked = Array.from(document.querySelectorAll('[data-avail]')).filter(c=>c.checked).map(c=>c.dataset.avail);
    const q = query.trim().toLowerCase();

    const filtered = books.filter(b=>{
      if(activeFilter!=='all' && b.cat!==activeFilter) return false;
      if(!fmtChecked.includes(b.fmt)) return false;
      if(!availChecked.includes(b.avail)) return false;
      if(q && !(b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.code.toLowerCase().includes(q))) return false;
      return true;
    });

    listEl.innerHTML = filtered.map(b=>{
      const disabled = b.avail !== 'available' ? 'disabled' : '';
      const btnText = b.avail === 'available' ? 'Забронировать' : (b.avail === 'held' ? 'В очереди' : 'Ожидать возврата');
      return `<div class="book-row">
        <div class="book-code">${b.code.replace('\n','<br>')}</div>
        <div class="book-main">
          <div class="title">${b.title}</div>
          <div class="meta">${b.author} · ${fmtLabel[b.fmt]}</div>
        </div>
        <div class="tag ${b.avail}">${availLabel[b.avail]}</div>
        <div class="row-action"><button ${disabled}>${btnText}</button></div>
      </div>`;
    }).join('');

    emptyEl.style.display = filtered.length ? 'none' : 'block';
    countEl.textContent = filtered.length + (filtered.length===1?' издание':' изданий');
  }

  document.getElementById('chipRow').addEventListener('click', e=>{
    const chip = e.target.closest('.chip');
    if(!chip) return;
    document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));
    chip.setAttribute('aria-pressed','true');
    activeFilter = chip.dataset.filter;
    render();
  });

  document.querySelectorAll('.wing').forEach(w=>{
    w.addEventListener('click', ()=>{
      const f = w.dataset.filter;
      const chip = document.querySelector(`.chip[data-filter="${f}"]`);
      if(chip) chip.click();
      document.getElementById('catalog').scrollIntoView({behavior:'smooth'});
    });
  });

  document.querySelectorAll('[data-fmt],[data-avail]').forEach(c=>c.addEventListener('change', render));

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', e=>{ query = e.target.value; render(); });
  document.getElementById('searchBtn').addEventListener('click', ()=>render());
  searchInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); render(); }});

  render();

  // zone tabs
  document.querySelectorAll('.zone-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.zone-tab').forEach(t=>t.setAttribute('aria-selected','false'));
      document.querySelectorAll('.zone-panel').forEach(p=>p.classList.remove('active'));
      tab.setAttribute('aria-selected','true');
      document.querySelector(`.zone-panel[data-zone="${tab.dataset.zone}"]`).classList.add('active');
    });
  });

  // hours table + live status, based on real current time
  const days = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  const now = new Date();
  const day = now.getDay();
  const isWeekend = (day===0 || day===6);
  const schedule = [
    {d:"Понедельник – Пятница", h:"08:00 – 22:00"},
    {d:"Суббота – Воскресенье", h:"10:00 – 18:00"}
  ];
  const table = document.getElementById('hoursTable');
  table.innerHTML = schedule.map(row=>{
    const todayMatch = (isWeekend && row.d.includes('Суббота')) || (!isWeekend && row.d.includes('Понедельник'));
    return `<tr class="${todayMatch?'today':''}"><td>${row.d}${todayMatch?' · сегодня':''}</td><td>${row.h}</td></tr>`;
  }).join('');

  const openHour = isWeekend ? 10 : 8;
  const closeHour = isWeekend ? 18 : 22;
  const hour = now.getHours() + now.getMinutes()/60;
  const isOpen = hour >= openHour && hour < closeHour;
  const statusLine = document.getElementById('statusLine');
  const dot = document.querySelector('.status-dot');
  if(isOpen){
    statusLine.textContent = `Открыто сейчас · закрытие в ${closeHour}:00`;
  } else {
    statusLine.textContent = `Сейчас закрыто · откроется в ${openHour}:00`;
    dot.style.background = 'var(--out-fg)';
  }
  document.getElementById('openStat').textContent = isOpen ? 'открыто' : 'закрыто';

  // ---------- new arrivals shelf (cover images) ----------
  const shelfGrid = document.getElementById('shelfGrid');
  const shelfBooks = books.filter(b => b.isbn).slice(0, 6);
  shelfGrid.innerHTML = shelfBooks.map(b => {
    const initials = b.title.split(' ').slice(0,3).join(' ');
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`;
    return `<div class="shelf-book" data-filter="${b.cat}">
      <div class="shelf-cover">
        <span class="dot ${b.avail}" title="${availLabel[b.avail]}"></span>
        <img src="${coverUrl}" alt="Обложка: ${b.title}"
             onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'fallback',textContent:'${initials.replace(/'/g,"\\'")}'}))">
      </div>
      <div class="title">${b.title}</div>
      <div class="author">${b.author}</div>
    </div>`;
  }).join('');

  shelfGrid.querySelectorAll('.shelf-book').forEach(card=>{
    card.addEventListener('click', ()=>{
      const f = card.dataset.filter;
      const chip = document.querySelector(`.chip[data-filter="${f}"]`);
      if(chip) chip.click();
      document.getElementById('catalog').scrollIntoView({behavior:'smooth'});
    });
  });

  // ---------- theme toggle (light / dark) ----------
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '◑' : '◐';
    themeBtn.setAttribute('aria-pressed', theme === 'dark');
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('nanospace-theme'); } catch(e) {}
  if(savedTheme === 'light' || savedTheme === 'dark'){
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  themeBtn.addEventListener('click', ()=>{
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('nanospace-theme', next); } catch(e) {}
  });
})();
