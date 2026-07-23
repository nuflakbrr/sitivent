# Test Case: Auto Login Post Register State (TC057)

## Skenario Pengujian
Memastikan konfigurasi `autoSignIn: false` memaksa pendaftar baru untuk login manual di `/login`.

## Prasyarat
- Pendaftaran akun baru di `/register`.

## Kondisi
- **Input**: Berhasil registrasi.
- **Output yang Diharapkan**:
  - Pengguna dialihkan ke `/login` dan belum dalam keadaan ter-login otomatis.

## Langkah-Langkah Pengujian
1. Lakukan pendaftaran akun baru.
2. Verifikasi halaman mendarat di `/login`.
