# Test Case: Logout Success (TC017)

## Skenario Pengujian
Memastikan pengguna yang sudah login dapat keluar (logout) dari sistem dengan berhasil dan halaman di-reload kembali ke halaman utama.

## Prasyarat
- Pengguna sudah dalam kondisi terautentikasi / ter-login di sistem.

## Kondisi
- **Input**:
  - Klik tombol avatar pengguna di Navbar.
  - Klik opsi "Keluar".
  - Konfirmasi modal alert logout.
- **Output yang Diharapkan**:
  - Session terhapus.
  - Notifikasi toast sukses "Berhasil keluar. Sampai jumpa!" muncul.
  - Halaman ter-reload dan mengarah ke `/`.

## Langkah-Langkah Pengujian
1. Buka halaman utama atau dashboard pengguna yang sedang login.
2. Klik menu avatar pengguna pada Navbar.
3. Klik opsi "Keluar" untuk membuka modal konfirmasi.
4. Klik tombol konfirmasi keluar pada modal.
5. Verifikasi pengalihan/reload halaman ke `/` dan session pengguna telah berakhir.
