# Test Case: Register Invalid Password (TC031)

## Skenario Pengujian
Memastikan pendaftaran akun baru gagal apabila password kurang dari 8 karakter.

## Prasyarat
- Halaman pendaftaran `/register`.

## Kondisi
- **Input**:
  - Nama: `User Pendek`
  - Email: `shortpass@gmail.com`
  - Password: `123`
- **Output yang Diharapkan**:
  - Form validasi gagal dan menampilkan pesan "Password minimal 8 karakter".

## Langkah-Langkah Pengujian
1. Buka `/register`.
2. Masukkan data dengan password pendek `123`.
3. Klik "Buat Akun Sekarang".
4. Verifikasi munculnya pesan error validasi password.
