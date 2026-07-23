# Test Case: Register Participant Success (TC004)

## Skenario Pengujian
Memastikan calon peserta baru dapat mendaftarkan akun secara mandiri melalui form pendaftaran dan mendapatkan role default `Peserta`.

## Prasyarat
- Email `pesertabaru@gmail.com` belum pernah terdaftar di sistem.
- Role `Peserta` tersedia di sistem (akan dibuat secara otomatis jika belum ada).

## Kondisi
- **Input**:
  - Nama Lengkap (`#reg-name`): `Peserta Baru`
  - Email (`#reg-email`): `pesertabaru@gmail.com`
  - Password (`#reg-password`): `Password123`
- **Output yang Diharapkan**:
  - Pendaftaran berhasil.
  - Akun baru terdaftar dengan role default `Peserta`.
  - Email ucapan selamat datang masuk ke antrean email queue.
  - Pengguna dialihkan ke halaman `/login` dengan notifikasi sukses.

## Langkah-Langkah Pengujian
1. Buka halaman register `/register`.
2. Masukkan nama lengkap `Peserta Baru` pada input `#reg-name`.
3. Masukkan email `pesertabaru@gmail.com` pada input `#reg-email`.
4. Masukkan password `Password123` pada input `#reg-password`.
5. Klik tombol `#btn-register-submit`.
6. Verifikasi pendaftaran berhasil (pengguna dialihkan ke `/login` serta muncul notifikasi sukses).
7. Verifikasi role pengguna ter-assign sebagai `Peserta`.
