// 19 sawir (JPEG): images/1.jpg ... images/19.jpg
// Beddel qaybta (cat) sawir kasta haddii aad rabto:
// portraits | nature | travel | fashion | friends
const cats = [
  'portraits','travel','fashion','fashion','travel','friends',
  'portraits','nature','nature','travel','fashion','friends',
  'portraits','nature','travel','fashion','friends','portraits','nature'
];
const photos = cats.map((cat, i) => ({ src: `images/${i + 1}.jpg`, cat, id: i + 1 }));

const PER_PAGE = 6;
let filter = 'all';
let page = 1;
let current = [];
let lbIndex = 0;
const liked = new Set(JSON.parse(localStorage.getItem('likedPhotos') || '[]'));

const grid = document.getElementById('grid');
const pager = document.getElementById('pager');

function visible() {
  return photos.filter(p => filter === 'all' || p.cat === filter);
}

function render() {
  current = visible();
  const pages = Math.max(1, Math.ceil(current.length / PER_PAGE));
  if (page > pages) page = pages;
  const slice = current.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  grid.innerHTML = '';
  slice.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'item';
    d.style.animationDelay = (i * 60) + 'ms';
    d.innerHTML = `
      <img src="${p.src}" alt="Sawir ${p.id}" loading="lazy"
           onerror="this.style.background='linear-gradient(135deg,#ff6fa8,#3b2a7a)';this.removeAttribute('src')">
      <button class="fav ${liked.has(p.id) ? 'on' : ''}" aria-label="Jecel">${liked.has(p.id) ? '♥' : '♡'}</button>`;
    d.querySelector('.fav').addEventListener('click', e => {
      e.stopPropagation();
      liked.has(p.id) ? liked.delete(p.id) : liked.add(p.id);
      localStorage.setItem('likedPhotos', JSON.stringify([...liked]));
      render();
    });
    d.addEventListener('click', () => openLb((page - 1) * PER_PAGE + i));
    grid.appendChild(d);
  });

  // pagination
  pager.innerHTML = '';
  if (pages > 1) {
    for (let n = 1; n <= pages; n++) {
      const b = document.createElement('button');
      b.textContent = n;
      if (n === page) b.className = 'active';
      b.onclick = () => { page = n; render(); document.getElementById('gallery').scrollIntoView({behavior:'smooth'}); };
      pager.appendChild(b);
    }
    const next = document.createElement('button');
    next.textContent = '→';
    next.onclick = () => { page = page % pages + 1; render(); };
    pager.appendChild(next);
  }
}

// filters
document.getElementById('filters').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  filter = chip.dataset.cat;
  page = 1;
  render();
});

// lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
function openLb(i) { lbIndex = i; lbImg.src = current[i].src; lb.classList.add('open'); }
function closeLb() { lb.classList.remove('open'); }
function step(d) { lbIndex = (lbIndex + d + current.length) % current.length; lbImg.src = current[lbIndex].src; }
document.getElementById('lbClose').onclick = closeLb;
document.getElementById('lbPrev').onclick = () => step(-1);
document.getElementById('lbNext').onclick = () => step(1);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

// search button: jump to gallery
document.getElementById('searchBtn').onclick = () => document.getElementById('gallery').scrollIntoView({behavior:'smooth'});

// menu active state
document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => {
  document.querySelectorAll('.menu a').forEach(x => x.classList.remove('active'));
  a.classList.add('active');
}));

render();
