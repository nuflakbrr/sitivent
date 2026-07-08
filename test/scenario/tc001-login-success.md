# Test Case: Login Participant Success (TC001)

## Skenario Pengujian
Memastikan peserta dapat melakukan login ke dashboard peserta menggunakan alamat email dan password yang valid.

## Prasyarat
- Akun peserta dengan email `peserta@gmail.com` dan password `Password123` sudah terdaftar di sistem.

## Kondisi
- **Input**:
  - Email: `peserta@gmail.com`
  - Password: `Password123`
- **Output yang Diharapkan**:
  - Pengguna dialihkan ke halaman dashboard peserta `/participant/dashboard`.
  - Sesi login aktif terdeteksi.

## Langkah-Langkah Pengujian
1. Buka halaman login `/login`.
2. Masukkan email `peserta@gmail.com` pada input email.
3. Masukkan password `Password123` pada input password.
4. Klik tombol "Masuk".
5. Verifikasi URL saat ini adalah `/participant/dashboard`.
