# Test Case: Register Participant Failed due to Duplicate Email (TC005)

## Skenario Pengujian
Memastikan sistem menolak pendaftaran akun baru jika email yang digunakan sudah terdaftar di sistem.

## Prasyarat
- Email `peserta@gmail.com` sudah terdaftar di database.

## Kondisi
- **Input**:
  - Nama Lengkap: `Peserta Duplikat`
  - Email: `peserta@gmail.com`
  - Password: `Password123`
  - Konfirmasi Password: `Password123`
- **Output yang Diharapkan**:
  - Pendaftaran gagal.
  - Halaman tetap di `/register`.
  - Notifikasi error / pesan kegagalan email duplikat terlihat di layar.

## Langkah-Langkah Pengujian
1. Buka halaman register `/register`.
2. Masukkan nama lengkap `Peserta Duplikat` pada input nama.
3. Masukkan email `peserta@gmail.com` pada input email.
4. Masukkan password `Password123` pada input password.
5. Masukkan konfirmasi password `Password123` pada input konfirmasi password.
6. Klik tombol "Daftar".
7. Verifikasi URL saat ini tetap di `/register`.
8. Verifikasi kemunculan pesan error notifikasi / toast error.
