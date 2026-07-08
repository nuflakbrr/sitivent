# Test Case: Register Participant Success (TC004)

## Skenario Pengujian
Memastikan calon peserta baru dapat mendaftarkan akun secara mandiri melalui form pendaftaran.

## Prasyarat
- Email `pesertabaru@gmail.com` belum pernah terdaftar di sistem.

## Kondisi
- **Input**:
  - Nama Lengkap: `Peserta Baru`
  - Email: `pesertabaru@gmail.com`
  - Password: `Password123`
  - Konfirmasi Password: `Password123`
- **Output yang Diharapkan**:
  - Pendaftaran berhasil.
  - Pengguna dialihkan ke halaman verifikasi atau diarahkan ke halaman login dengan pesan sukses.

## Langkah-Langkah Pengujian
1. Buka halaman register `/register`.
2. Masukkan nama lengkap `Peserta Baru` pada input nama.
3. Masukkan email `pesertabaru@gmail.com` pada input email.
4. Masukkan password `Password123` pada input password.
5. Masukkan konfirmasi password `Password123` pada input konfirmasi password.
6. Klik tombol "Daftar".
7. Verifikasi pendaftaran berhasil (pengguna dialihkan ke `/login` atau halaman verifikasi, serta muncul notifikasi sukses).
