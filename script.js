(function(){
  const books = [
    {title:"Introduction to Algorithms", author:"Cormen, Leiserson, Rivest, Stein", avail:"available", isbn:"9780262033848"},
    {title:"Pattern Recognition and Machine Learning", author:"Christopher Bishop", avail:"available", isbn:"9780387310732"},
    {title:"Designing Data-Intensive Applications", author:"Martin Kleppmann", avail:"out", isbn:"9781449373320"},
    {title:"Database System Concepts", author:"Silberschatz, Korth, Sudarshan", avail:"available", isbn:"9780078022159"},
    {title:"Blockchain Revolution", author:"Don Tapscott", avail:"held", isbn:"9781101980132"},
    {title:"Bitcoin and Cryptocurrency Technologies", author:"Arvind Narayanan et al.", avail:"available", isbn:"9780691171692"},
    {title:"Principles of Corporate Finance", author:"Brealey, Myers, Allen", avail:"available", isbn:"9781260013900"},
    {title:"Game Theory for Applied Economists", author:"Robert Gibbons", avail:"available", isbn:"9780691003955"},
    {title:"Cognitive Psychology: A Student's Handbook", author:"Eysenck, Keane", avail:"available", isbn:"9781138482210"},
    {title:"The Social Animal", author:"Elliot Aronson", avail:"out", isbn:"9781429233413"},
    {title:"Developmental Psychology", author:"David Shaffer", avail:"available", isbn:"9781305257023"},
    {title:"Abnormal Psychology", author:"Ronald Comer", avail:"available", isbn:"9781319190712"},
    {title:"Principles of Neural Science", author:"Kandel, Schwartz, Jessell", avail:"out", isbn:"9780071390118"},
    {title:"Cognitive Neuroscience", author:"Gazzaniga, Ivry, Mangun", avail:"available", isbn:"9780393603170"},
    {title:"The Brain That Changes Itself", author:"Norman Doidge", avail:"held", isbn:"9780143113102"},
    {title:"They Say / I Say", author:"Graff, Birkenstein", avail:"available", isbn:"9780393631678"},
    {title:"Calculus: Early Transcendentals", author:"James Stewart", avail:"available", isbn:"9781285741550"},
    {title:"A History of Western Philosophy", author:"Bertrand Russell", avail:"held", isbn:"9780671201581"}
  ];
  const label = {available:"В наличии", held:"В резерве", out:"На руках"};

  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const count = document.getElementById('count');
  const input = document.getElementById('search');

  function esc(s){ return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function render(){
    const q = input.value.trim().toLowerCase();
    const list = books.filter(b => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    grid.innerHTML = list.map(b => `
      <article class="book">
        <div class="cover">
          <span class="dot ${b.avail}"></span>
          <img src="https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg?default=false" alt="Обложка: ${esc(b.title)}" loading="lazy">
        </div>
        <div class="title">${esc(b.title)}</div>
        <div class="author">${esc(b.author)}</div>
        <div class="status ${b.avail}">${label[b.avail]}</div>
      </article>`).join('');

    // если обложка не загрузилась — показываем заглушку с названием
    grid.querySelectorAll('.cover img').forEach((img, i) => {
      img.addEventListener('error', () => {
        const f = document.createElement('div');
        f.className = 'fallback';
        f.textContent = list[i].title;
        img.replaceWith(f);
      });
    });

    empty.style.display = list.length ? 'none' : 'block';
    count.textContent = list.length + ' ' + (list.length === 1 ? 'книга' : 'книг');
  }
  input.addEventListener('input', render);
  render();

  // переключатель темы
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  function apply(t){ root.setAttribute('data-theme', t); btn.textContent = t === 'dark' ? '◑' : '◐'; }
  let saved = null;
  try { saved = localStorage.getItem('meta-theme'); } catch(e) {}
  apply(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('meta-theme', next); } catch(e) {}
  });
})();