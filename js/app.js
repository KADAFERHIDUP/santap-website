import { SHOP, CATEGORIES, MENU, HERO, PROMO, CHEF, KITCHEN } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const byId = id => MENU.find(m => m.id === id);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
// Unsplash mengecilkan foto di server mereka; foto lokal dipakai apa adanya
const imgAt = (src, w) => /images\.unsplash\.com/.test(src) ? `${src}&auto=format&fit=crop&w=${w}&h=${w}&q=72` : src;
const utm = u => `${u}${u.includes('?') ? '&' : '?'}utm_source=santap&utm_medium=referral`;
const waUrl = text => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
const ICON = (id, cls = '') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;

let toastT = 0;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

// foto yang gagal dimuat (offline, diblokir) diganti ikon piring di latar kuning
const PLATE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="none" stroke="#151515" stroke-width="2.5" stroke-linecap="round"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="13"/><path d="M8 10v44M56 10c-3 2-4 6-4 10v6h4V10Zm0 16v28"/></g></svg>');
document.addEventListener('error', e => {
  const im = e.target;
  if (!(im instanceof HTMLImageElement) || im.dataset.failed) return;
  im.dataset.failed = '1';
  im.src = PLATE;
  im.parentElement?.classList.add('no-photo');
}, true);

// ---------------------------------------------------------------- toko: kontak, jam buka, kredit foto
function isOpen(d = new Date()) {
  // jam WIB (UTC+7), tidak bergantung zona waktu perangkat pengunjung
  const h = (d.getUTCHours() + 7) % 24 + d.getUTCMinutes() / 60;
  return h >= SHOP.hours.open && h < SHOP.hours.close;
}
function applyShop() {
  $('#hours-label').textContent = SHOP.hours.label;
  const st = $('#open-status');
  const open = isOpen();
  st.textContent = open ? 'Buka sekarang' : `Tutup, buka lagi pukul ${String(SHOP.hours.open).padStart(2, '0')}.00 WIB`;
  st.classList.toggle('open', open);
  $('#city-label').textContent = SHOP.city;
  $('#c-wa').href = `https://wa.me/${SHOP.whatsapp}`; $('#c-wa').textContent = SHOP.phoneDisplay;
  $('#c-mail').href = `mailto:${SHOP.email}`; $('#c-mail').textContent = SHOP.email;
  $('#c-ig').href = SHOP.instagram;
  $('#c-city').textContent = SHOP.city;
  $('#map').src = `https://www.google.com/maps?q=${encodeURIComponent(SHOP.mapsQuery)}&z=13&output=embed`;
  $('#catering-wa').href = waUrl('Halo Santap, saya mau tanya katering untuk acara. Jumlah orang: ..., tanggal: ...');
  $('#year').textContent = new Date().getFullYear();
  $('#chef-img').src = imgAt(CHEF.img, 160);
  $('#kitchen-img').src = imgAt(KITCHEN.img, 1100).replace('&h=1100', '&h=880');
  const people = new Map();
  [...MENU, CHEF, KITCHEN].forEach(p => people.set(p.credit, p.creditUrl));
  $('#credit-list').innerHTML = [...people].map(([n, u]) => `<a href="${esc(utm(u))}" target="_blank" rel="noopener">${esc(n)}</a>`).join(', ');
}

// ---------------------------------------------------------------- header
function setupHeader() {
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const nav = $('#nav'), toggle = $('#nav-toggle');
  const setNav = open => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi'); };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });
  document.addEventListener('click', e => { if (!e.target.closest('#nav, #nav-toggle')) setNav(false); });
  $('#search-open').addEventListener('click', () => { $('#menu').scrollIntoView({ behavior: calm() ? 'auto' : 'smooth' }); setTimeout(() => $('#menu-q').focus({ preventScroll: true }), calm() ? 0 : 450); });
  // tandai bagian yang sedang dibaca
  const links = $$('.nav a');
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['menu', 'cara-pesan', 'katering', 'tentang', 'kontak'].forEach(id => io.observe($('#' + id)));
}

// ---------------------------------------------------------------- hero
let heroIdx = 0, heroT = 0;
function setupHero() {
  const dots = $('#hero-dots');
  dots.innerHTML = HERO.map((id, i) => `<button type="button" data-hero="${i}" aria-label="Tampilkan ${esc(byId(id).name)}"></button>`).join('');
  dots.addEventListener('click', e => { const b = e.target.closest('[data-hero]'); if (b) { showHero(Number(b.dataset.hero), true); restartHero(); } });
  $('#hero-add').addEventListener('click', () => {
    add(HERO[heroIdx]);
    const b = $('#hero-add'); b.classList.remove('added'); void b.offsetWidth; b.classList.add('added');
  });
  const hero = $('.hero');
  hero.addEventListener('pointerenter', () => clearInterval(heroT));
  hero.addEventListener('pointerleave', restartHero);
  hero.addEventListener('focusin', () => clearInterval(heroT));
  showHero(0, false);
  restartHero();
}
function showHero(i, animate) {
  heroIdx = i;
  const d = byId(HERO[i]);
  const [l1, l2] = d.lines || [d.name, ''];
  $('#hero-l1').textContent = l1;
  $('#hero-l2').textContent = l2;
  $('#hero-desc').textContent = d.desc;
  $('#hero-price').textContent = rp(d.price);
  $('#hero-was').textContent = d.was ? rp(d.was) : '';
  $('#hero-was').hidden = !d.was;
  const img = $('#hero-img');
  delete img.dataset.failed;
  img.parentElement.classList.remove('no-photo');
  img.src = imgAt(d.img, 1100);
  img.srcset = `${imgAt(d.img, 640)} 640w, ${imgAt(d.img, 1100)} 1100w`;
  img.sizes = '(max-width: 980px) 78vw, 36vw';
  img.alt = d.name;
  $$('#hero-dots button').forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
  if (animate && !calm()) { const p = $('#hero-plate'); p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); }
}
function restartHero() {
  clearInterval(heroT);
  if (calm()) return;
  heroT = setInterval(() => { if (!document.hidden && scrollY < innerHeight * .6) showHero((heroIdx + 1) % HERO.length, true); }, 7000);
}

// ---------------------------------------------------------------- promo (kartu bergaris putus-putus)
let promoIdx = 0;
function showPromo(i) {
  promoIdx = (i + PROMO.length) % PROMO.length;
  const d = byId(PROMO[promoIdx]);
  const box = $('#promo');
  box.innerHTML = `<img src="${esc(imgAt(d.img, 200))}" alt="" width="78" height="78">
    <div><h3>${esc(d.name)}</h3><span class="mins">${ICON('clock')} ± ${d.mins} menit</span></div>
    <p class="coupon-price"><s>${rp(d.was)}</s>${rp(d.price)}</p>
    <button type="button" class="coupon-add" data-add="${d.id}" aria-label="Tambah ${esc(d.name)} ke keranjang">${ICON('plus')} Tambah</button>`;
  if (!calm()) { box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap'); }
}

// ---------------------------------------------------------------- menu
const F = { cat: 'semua', q: '' };
const chipList = () => [CATEGORIES[0], { id: 'favorit', label: 'Favorit' }, ...CATEGORIES.slice(1)];
const inChip = (m, id) => id === 'semua' || (id === 'favorit' ? m.tags.includes('favorit') : m.cat === id);
function setupMenu() {
  $('#chips').innerHTML = chipList().map(c => `<button type="button" role="tab" class="chip" data-cat="${c.id}" aria-selected="${c.id === F.cat}">${esc(c.label)} <small>${MENU.filter(m => inChip(m, c.id)).length}</small></button>`).join('');
  $('#chips').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) setCat(b.dataset.cat); });
  let t = 0;
  $('#menu-q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { F.q = e.target.value.trim().toLowerCase(); renderMenu(); }, 120); });
  $('#menu-reset').addEventListener('click', () => { $('#menu-q').value = ''; F.q = ''; setCat('semua'); });
  $$('[data-filter]').forEach(a => a.addEventListener('click', () => setCat(a.dataset.filter)));
  renderMenu();
}
function setCat(id) {
  F.cat = id;
  $$('.chip').forEach(c => c.setAttribute('aria-selected', String(c.dataset.cat === id)));
  renderMenu();
}
function tagsOf(m) {
  const t = [];
  if (m.was) t.push(`<span class="tag promo">Promo</span>`);
  if (m.tags.includes('favorit')) t.push(`<span class="tag favorit">${ICON('heart')}<span class="lbl">Favorit</span></span>`);
  if (m.tags.includes('pedas')) t.push(`<span class="tag pedas">${ICON('flame')}<span class="lbl">Pedas</span></span>`);
  return t.join('');
}
function buyControl(id, name) {
  const q = cart.get(id) || 0;
  return q ? `<div class="stepper" role="group" aria-label="Jumlah ${esc(name)}">
      <button type="button" data-dec="${id}" aria-label="Kurangi ${esc(name)}">${ICON('minus')}</button>
      <output aria-live="polite">${q}</output>
      <button type="button" data-inc="${id}" aria-label="Tambah ${esc(name)}">${ICON('plus')}</button></div>`
    : `<button type="button" class="add" data-add="${id}" aria-label="Tambah ${esc(name)} ke keranjang"><i>${ICON('plus')}</i>Tambah</button>`;
}
function renderMenu() {
  const list = MENU.filter(m => inChip(m, F.cat) && (!F.q || `${m.name} ${m.desc}`.toLowerCase().includes(F.q)));
  $('#menu-grid').innerHTML = list.map(m => `<article class="dish-card" data-id="${m.id}">
      <div class="tags">${tagsOf(m)}</div>
      <button type="button" class="dish-open" data-open="${m.id}" aria-label="Lihat detail ${esc(m.name)}">
        <div class="dish-photo"><img src="${esc(imgAt(m.img, 400))}" alt="${esc(m.name)}" loading="lazy" width="150" height="150"></div>
        <h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p>
      </button>
      <div class="dish-foot"><p class="price">${m.was ? `<s>${rp(m.was)}</s>` : ''}${rp(m.price)}</p><span class="buy-slot">${buyControl(m.id, m.name)}</span></div>
    </article>`).join('');
  $('#menu-empty').hidden = list.length > 0;
}
function refreshBuy(id) {
  const m = byId(id);
  $$(`.dish-card[data-id="${id}"] .buy-slot, #dish .buy-slot[data-id="${id}"]`).forEach(s => {
    const hadFocus = s.contains(document.activeElement);
    const which = document.activeElement?.dataset?.inc ? 'inc' : document.activeElement?.dataset?.dec ? 'dec' : 'add';
    s.innerHTML = buyControl(id, m.name);
    if (hadFocus) (s.querySelector(`[data-${which}]`) || s.querySelector('button'))?.focus();
  });
}

// ---------------------------------------------------------------- keranjang
const store = {
  get() { try { return new Map(JSON.parse(localStorage.getItem('santap-cart') || '[]')); } catch { return new Map(); } },
  set(m) { try { localStorage.setItem('santap-cart', JSON.stringify([...m])); } catch { /* penyimpanan tidak tersedia */ } },
};
let cart = new Map([...store.get()].filter(([id, q]) => byId(id) && q > 0));
const total = () => [...cart].reduce((s, [id, q]) => s + byId(id).price * q, 0);
const itemCount = () => [...cart.values()].reduce((s, q) => s + q, 0);
function setQty(id, q) {
  if (q > 0) cart.set(id, Math.min(q, 50)); else cart.delete(id);
  store.set(cart);
  refreshBuy(id);
  renderCart();
}
function add(id) {
  const had = cart.get(id) || 0;
  setQty(id, had + 1);
  if (!had) toast(`${byId(id).name} masuk keranjang`);
  const c = $('#cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
}
function renderCart() {
  const n = itemCount();
  $('#cart-count').hidden = !n; $('#cart-count').textContent = n;
  $('#cart-open').setAttribute('aria-label', n ? `Buka keranjang, ${n} item` : 'Buka keranjang');
  $('#cart-bar').hidden = !n;
  $('#bar-count').textContent = n; $('#bar-total').textContent = rp(total());
  $('#cart-total').textContent = rp(total());
  $('#cart-list').innerHTML = [...cart].map(([id, q]) => {
    const m = byId(id);
    return `<li class="cart-item"><img src="${esc(imgAt(m.img, 160))}" alt="" width="64" height="64">
      <div><h3>${esc(m.name)}</h3><p>${rp(m.price)} × ${q} = ${rp(m.price * q)}</p></div>
      <div class="stepper" role="group" aria-label="Jumlah ${esc(m.name)}">
        <button type="button" data-dec="${id}" aria-label="Kurangi ${esc(m.name)}">${ICON('minus')}</button><output>${q}</output>
        <button type="button" data-inc="${id}" aria-label="Tambah ${esc(m.name)}">${ICON('plus')}</button></div></li>`;
  }).join('');
  $('#cart-empty').hidden = n > 0;
  $('#order-form').hidden = !n;
  $('#cart-foot').hidden = !n;
}
function openSheet(d) {
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
}
function setupCart() {
  const dlg = $('#cart');
  $('#cart-open').addEventListener('click', () => openSheet(dlg));
  $('#cart-bar').addEventListener('click', () => openSheet(dlg));
  const form = $('#order-form');
  const syncMode = () => { $('#addr-field').hidden = form.mode.value !== 'antar'; };
  form.addEventListener('change', syncMode);
  syncMode();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('.form-msg', form);
    $$('.field', form).forEach(f => f.classList.remove('bad'));
    const bad = [];
    if (!form.name.value.trim()) bad.push('name');
    if (form.mode.value === 'antar' && form.address.value.trim().length < 8) bad.push('address');
    if (bad.length) {
      bad.forEach(n => form[n].closest('.field').classList.add('bad'));
      msg.className = 'form-msg err';
      msg.textContent = bad.includes('name') ? 'Tulis namamu dulu.' : 'Tulis alamat lengkap supaya kurir tidak tersesat.';
      form[bad[0]].focus();
      return;
    }
    const lines = [...cart].map(([id, q], i) => { const m = byId(id); return `${i + 1}. ${m.name} × ${q} = ${rp(m.price * q)}`; });
    const text = ['Halo Santap, saya mau pesan:', '', ...lines, '', `Subtotal: ${rp(total())}`,
      `Cara terima: ${form.mode.value === 'antar' ? 'Diantar' : 'Ambil sendiri'}`, `Nama: ${form.name.value.trim()}`,
      ...(form.mode.value === 'antar' ? [`Alamat: ${form.address.value.trim()}`] : []),
      ...(form.note.value.trim() ? [`Catatan: ${form.note.value.trim()}`] : []), '', 'Mohon info ongkir dan totalnya. Terima kasih.'].join('\n');
    const url = waUrl(text);
    window.open(url, '_blank', 'noopener');
    msg.className = 'form-msg';
    msg.innerHTML = `Pesanan sudah disusun di WhatsApp. Tekan kirim di sana untuk menyelesaikan pesanan. Kalau WhatsApp tidak terbuka, <a class="link" href="${esc(url)}" target="_blank" rel="noopener">buka di sini</a>.`;
  });
}

// ---------------------------------------------------------------- detail hidangan
function openDish(id) {
  const m = byId(id);
  $('#dish-body').innerHTML = `
    <div class="dish-hero">
      <button type="button" class="round-btn" data-close aria-label="Tutup">${ICON('x')}</button>
      <img src="${esc(imgAt(m.img, 700))}" alt="${esc(m.name)}" width="300" height="300">
    </div>
    <div class="dish-info">
      <div class="dish-meta">${tagsOf(m)}<span class="tag">${ICON('clock')} ± ${m.mins} menit</span></div>
      <h2 id="dish-title">${esc(m.name)}</h2>
      <p>${esc(m.desc)}</p>
      <div class="dish-buy"><p class="price">${m.was ? `<s>${rp(m.was)}</s>` : ''}${rp(m.price)}</p><span class="buy-slot" data-id="${m.id}">${buyControl(m.id, m.name)}</span></div>
      <p class="photo-credit">Foto: <a href="${esc(utm(m.creditUrl))}" target="_blank" rel="noopener">${esc(m.credit)}</a> di <a href="${esc(utm('https://unsplash.com'))}" target="_blank" rel="noopener">Unsplash</a></p>
    </div>`;
  openSheet($('#dish'));
}

// ---------------------------------------------------------------- kontak
function setupContact() {
  const form = $('#contact-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('.form-msg', form);
    $$('.field', form).forEach(f => f.classList.remove('bad'));
    const name = form.name.value.trim(), text = form.message.value.trim();
    if (!name || text.length < 10) {
      const f = !name ? form.name : form.message;
      f.closest('.field').classList.add('bad');
      msg.className = 'form-msg err';
      msg.textContent = !name ? 'Tulis namamu dulu.' : 'Pesan minimal 10 huruf.';
      f.focus();
      return;
    }
    const url = waUrl(`Halo Santap, saya ${name}.\n\n${text}`);
    window.open(url, '_blank', 'noopener');
    msg.className = 'form-msg';
    msg.innerHTML = `Pesan dibuka di WhatsApp. Kalau tidak terbuka, <a class="link" href="${esc(url)}" target="_blank" rel="noopener">buka di sini</a>.`;
  });
}

// ---------------------------------------------------------------- klik
function setupClicks() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (a) { add(a.dataset.add); return; }
    const inc = e.target.closest('[data-inc]'); if (inc) { setQty(inc.dataset.inc, (cart.get(inc.dataset.inc) || 0) + 1); return; }
    const dec = e.target.closest('[data-dec]'); if (dec) { setQty(dec.dataset.dec, (cart.get(dec.dataset.dec) || 0) - 1); return; }
    const o = e.target.closest('[data-open]'); if (o) { openDish(o.dataset.open); return; }
    const c = e.target.closest('[data-close]'); if (c) { c.closest('dialog')?.close(); }
  });
  // klik di luar panel menutup dialog
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
  $('#promo-prev').addEventListener('click', () => showPromo(promoIdx - 1));
  $('#promo-next').addEventListener('click', () => showPromo(promoIdx + 1));
}

applyShop();
setupHeader();
setupClicks();
setupHero();
showPromo(0);
setupMenu();
setupCart();
renderCart();
setupContact();
