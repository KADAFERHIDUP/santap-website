// Semua isi yang sering diubah ada di file ini: kontak, jam buka, menu, promo.
// Foto dari Unsplash (Unsplash License). `frame: [zoom, x%, y%]` mengatur bingkai foto di lingkaran
// supaya piringnya memenuhi lingkaran. Kalau punya foto tanpa background (PNG transparan), simpan di
// img/menu/ lalu tambahkan `cutout: 'img/menu/nama.png'` di hidangannya; foto itu dipakai menggantikan foto Unsplash.
// Foto dari Unsplash (Unsplash License). Unsplash meminta foto dimuat langsung dari server mereka
// dan nama fotografer dicantumkan, jadi setiap foto menyimpan id foto dan fotografernya.
const U = (id) => `https://images.unsplash.com/${id}?ixlib=rb-4.1.0`;

export const SHOP = {
  name: 'Santap',
  tagline: 'Dapur rumahan di Lhokseumawe',
  owner: 'Ahmad Umraithi',
  whatsapp: '6282276078880',
  phoneDisplay: '0822-7607-8880',
  email: 'umraithi769@gmail.com',
  instagram: 'https://www.instagram.com/ahmadumraithi',
  city: 'Lhokseumawe, Aceh',
  mapsQuery: 'Lhokseumawe, Aceh',
  // jam buka (WIB). Ubah sesuai jam dapur yang sebenarnya.
  hours: { open: 10, close: 22, label: 'Setiap hari, 10.00–22.00 WIB' },
};

export const CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'nasi-mie', label: 'Nasi & mie' },
  { id: 'western', label: 'Western' },
  { id: 'camilan', label: 'Camilan' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'penutup', label: 'Penutup' },
];

const P = (user, name) => ({ credit: name, creditUrl: `https://unsplash.com/@${user}` });

export const MENU = [
  { id: 'dimsum-ayam', frame: [1.12, 55, 58], cat: 'camilan', name: 'Dimsum Ayam Kukus', lines: ['Dimsum Ayam', 'Saus Chili Spesial'], price: 22000, was: 26000, mins: 15, tags: ['favorit'],
    desc: 'Empat dimsum ayam dan udang, dikukus saat dipesan, dengan saus chili buatan dapur.', img: U('photo-1708782341487-6544f0d9efe8'), ...P('rimshaj123', 'Rimsha Noor') },
  { id: 'nasi-goreng-kampung', frame: [1.15, 50, 50], cat: 'nasi-mie', name: 'Nasi Goreng Kampung', lines: ['Nasi Goreng', 'Kampung Terasi'], price: 25000, was: 28000, mins: 15, tags: ['favorit', 'pedas'],
    desc: 'Bumbu terasi dan cabai rawit, ayam suwir, telur dadar, kerupuk, dan acar.', img: U('photo-1715854501867-5533189a5e71'), ...P('markuswinkler', 'Markus Winkler') },
  { id: 'nasi-goreng-telur', frame: [1.55, 50, 52], cat: 'nasi-mie', name: 'Nasi Goreng Telur Ceplok', price: 23000, mins: 15, tags: [],
    desc: 'Nasi goreng kecap manis dengan telur mata sapi setengah matang di atasnya.', img: U('photo-1694111134002-2b5e13d848fe'), ...P('krisnapepe', 'Krisna Putra Pratama') },
  { id: 'sate-ayam', frame: [1.25, 50, 50], cat: 'nasi-mie', name: 'Sate Ayam Bumbu Kacang', price: 28000, mins: 20, tags: ['favorit'],
    desc: 'Sepuluh tusuk sate ayam bakar arang, bumbu kacang, kecap, dan lontong.', img: U('photo-1562607635-4608ff48a859'), ...P('baiqdaling', 'Baiq Daling') },
  { id: 'mie-kuah-ayam', frame: [1.3, 52, 50], cat: 'nasi-mie', name: 'Mie Kuah Ayam Jamur', price: 24000, mins: 15, tags: [],
    desc: 'Mie kenyal dalam kaldu ayam bening, ayam kecap, jamur, dan sawi.', img: U('photo-1725121463846-b23056f190df'), ...P('praharaa', 'Bayu Prahara') },
  { id: 'spaghetti-bolognese', frame: [1.6, 50, 50], cat: 'western', name: 'Spaghetti Bolognese', lines: ['Spaghetti', 'Bolognese Sapi'], price: 35000, was: 42000, mins: 20, tags: [],
    desc: 'Saus tomat dengan daging sapi cincang yang dimasak lama, taburan keju parmesan.', img: U('photo-1676471771228-c4cdbfbd2a7f'), ...P('nimanaseri', 'Nima Naseri') },
  { id: 'burger-sapi', frame: [1.0, 50, 50], cat: 'western', name: 'Burger Sapi Keju', price: 38000, was: 44000, mins: 20, tags: ['favorit'],
    desc: 'Daging sapi 120 g, keju cheddar, selada, tomat, dan saus rumah di roti brioche.', img: U('photo-1586190848861-99aa4a171e90'), ...P('phototastyfood', 'David Foodphototasty') },
  { id: 'pizza-pepperoni', frame: [1.1, 50, 50], cat: 'western', name: 'Pizza Pepperoni Sapi', price: 65000, was: 75000, mins: 25, tags: [],
    desc: 'Pizza 25 cm, pepperoni sapi, mozzarella, dan saus tomat oregano.', img: U('photo-1628840042765-356cda07504e'), ...P('thisisnando', 'Fernando Andrade') },
  { id: 'es-kopi-susu', frame: [1.0, 50, 50], cat: 'minuman', name: 'Es Kopi Susu Aren', price: 18000, mins: 5, tags: ['favorit'],
    desc: 'Espresso, susu segar, dan gula aren cair. Bisa minta kurang manis.', img: U('photo-1710811891354-163b00ebcc74'), ...P('qqquack_', 'Youwoon Park') },
  { id: 'kopi-susu-literan', frame: [1.0, 50, 50], cat: 'minuman', name: 'Kopi Susu Literan', price: 75000, mins: 10, tags: [],
    desc: 'Satu liter kopi susu aren dalam botol, cukup untuk 4–5 gelas. Tahan 3 hari di kulkas.', img: U('photo-1686794154400-271773c5e99d'), ...P('kurisuchanxx', 'Christian Dala') },
  { id: 'brownies-stroberi', frame: [1.1, 50, 50], cat: 'penutup', name: 'Brownies Cokelat Stroberi', price: 26000, was: 30000, mins: 5, tags: [],
    desc: 'Brownies cokelat yang lembut di tengah, dengan stroberi segar dan ganache.', img: U('photo-1686736314846-6675fa64f161'), ...P('rosasepanta', 'Rosa Sepanta') },
  { id: 'choco-jar', frame: [1.0, 50, 50], cat: 'penutup', name: 'Kue Cokelat dalam Toples', price: 22000, mins: 5, tags: [],
    desc: 'Lapisan kue cokelat, krim, dan remahan cokelat dalam toples. Enak dingin.', img: U('photo-1590080874810-8180c3eb1016'), ...P('americanheritagechocolate', 'American Heritage Chocolate') },
];

// hero: hidangan yang tampil bergantian di bagian atas
export const HERO = ['dimsum-ayam', 'nasi-goreng-kampung', 'spaghetti-bolognese'];
// kartu promo di panel hitam
export const PROMO = ['pizza-pepperoni', 'burger-sapi', 'brownies-stroberi'];

export const CHEF = { img: U('photo-1583394293214-28ded15ee548'), ...P('rccf', 'Rc Cf') };
export const KITCHEN = { img: U('photo-1622021142947-da7dedc7c39a'), ...P('novokayn', 'Pylyp Sukhenko') };
