# Santap: website dapur makanan

Website pemesanan makanan untuk dapur rumahan di Lhokseumawe, oleh **Ahmad Umraithi**. Pengunjung memilih menu, mengisi nama dan alamat, lalu pesanan tersusun otomatis di WhatsApp.

Tampilan mengikuti gaya desain *Fode* (Dribbble): halaman putih, panel hitam diagonal, aksen kuning, dan piring bulat yang "melayang" di atas garis panel.

## Fitur

- **Hero** dengan tiga hidangan pilihan yang berganti otomatis (berhenti saat kursor di atasnya), harga coret, dan tombol tambah ke keranjang.
- **Kartu promo** di panel hitam, dengan tombol sebelumnya/berikutnya.
- **Menu** 12 hidangan dalam 5 kategori plus filter *Favorit*, pencarian, label promo/favorit/pedas, dan panel detail (foto besar, waktu masak, jumlah).
- **Keranjang** yang tersimpan di browser: ubah jumlah, pilih diantar atau ambil sendiri, isi alamat dan catatan, lalu **pesan lewat WhatsApp** dengan pesan yang sudah tersusun rapi.
- **Cara pesan**, **katering** (nasi kotak, prasmanan, tumpeng), **tentang** dengan jam buka dan status buka/tutup otomatis (WIB), **kontak** (form ke WhatsApp + peta).
- Responsif dari HP 360 px sampai layar lebar, bisa dipakai dengan keyboard, dan menghormati pengaturan *reduced motion*.

## Mengubah isi

Semua isi yang sering diubah ada di **`js/data.js`**:

- `SHOP`: nama, nomor WhatsApp, email, Instagram, kota, jam buka.
- `MENU`: nama, kategori, harga, harga coret (`was`), waktu masak, label, deskripsi, foto.
- `HERO` dan `PROMO`: hidangan yang tampil di bagian atas dan di kartu promo.

Harga, jam buka, dan isi katering adalah **data contoh**. Sesuaikan sebelum dipakai sungguhan.

## Foto

Foto makanan berasal dari [Unsplash](https://unsplash.com) ([Unsplash License](https://unsplash.com/license), boleh dipakai gratis untuk usaha). Sesuai aturan Unsplash, foto dimuat langsung dari server Unsplash (butuh internet), dan nama fotografernya tampil di panel detail menu dan di bagian *Kredit foto* di footer. Kalau foto gagal dimuat, yang tampil ikon piring di latar kuning.

Untuk usaha sungguhan, ganti dengan foto masakan sendiri: simpan di folder `img/`, lalu ubah `img` di `js/data.js` menjadi misalnya `'img/nasi-goreng.webp'`.

## Menjalankan

Website ini statis (HTML, CSS, JavaScript tanpa framework). Karena memakai ES modules, buka lewat server lokal, bukan klik dua kali file:

- VS Code: klik kanan `index.html` → *Open with Live Server*, atau
- terminal: `python -m http.server 8000`, lalu buka http://localhost:8000

Untuk online, upload ke GitHub lalu aktifkan GitHub Pages (branch `main`, folder root).

## Struktur

```
index.html      halaman
css/style.css   tampilan
js/data.js      kontak, jam buka, menu, promo
js/app.js       hero, promo, menu, keranjang, WhatsApp
img/            favicon
```

Versi awal project ini memakai template "Delicious food". Desain dan kodenya sekarang ditulis ulang sepenuhnya.

## Kontak

- Email: umraithi769@gmail.com
- WhatsApp: 0822-7607-8880
