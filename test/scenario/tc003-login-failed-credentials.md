# Test Case: Login Failed due to Invalid Credentials (TC003)

## Skenario Pengujian
Memastikan sistem memvalidasi dan menolak upaya login jika password yang dimasukkan salah, serta menampilkan pesan error yang relevan.

## Prasyarat
- Akun terdaftar dengan email `peserta@gmail.com` dan password `Password123`.

## Kondisi
- **Input**:
  - Email: `peserta@gmail.com`
  - Password: `PasswordSalah`
- **Output yang Diharapkan**:
  - Upaya login ditolak.
  - Halaman tetap di `/login`.
  - Pesan error notifikasi (seperti toast error) ditampilkan.

## Langkah-Langkah Pengujian
1. Buka halaman login `/login`.
2. Masukkan email `peserta@gmail.com` pada input email.
3. Masukkan password `PasswordSalah` pada input password.
4. Klik tombol "Masuk".
5. Verifikasi URL saat ini tetap `/login`.
6. Verifikasi munculnya pesan notifikasi error / toast error.
