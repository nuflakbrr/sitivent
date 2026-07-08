# Test Case: Login Admin Success (TC002)

## Skenario Pengujian
Memastikan administrator (Admin/Superadmin) dapat login ke dashboard admin menggunakan email dan password yang valid.

## Prasyarat
- Akun administrator dengan email `admin@gmail.com` dan password `Password123` sudah terdaftar dengan role `Admin`.

## Kondisi
- **Input**:
  - Email: `admin@gmail.com`
  - Password: `Password123`
- **Output yang Diharapkan**:
  - Pengguna dialihkan ke halaman dashboard admin `/admin/dashboard`.
  - Sidebar menu admin (seperti Event, Registrasi, Pembayaran) terlihat.

## Langkah-Langkah Pengujian
1. Buka halaman login `/login`.
2. Masukkan email `admin@gmail.com` pada input email.
3. Masukkan password `Password123` pada input password.
4. Klik tombol "Masuk".
5. Verifikasi URL saat ini adalah `/admin/dashboard`.
6. Verifikasi sidebar navigasi admin terlihat di layar.
