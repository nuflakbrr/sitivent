# Test Case: Unauthorized Admin Access (TC030)

## Skenario Pengujian
Memastikan pengguna biasa (Peserta) atau tamu yang belum login tidak dapat mengakses halaman Admin Dashboard.

## Prasyarat
- Pengguna login sebagai `Peserta` atau belum login.

## Kondisi
- **Input**: Navigasi ke `/admin/dashboard`
- **Output yang Diharapkan**:
  - Akses ditolak dan dialihkan ke `/login` atau `/403`.

## Langkah-Langkah Pengujian
1. Buka URL `/admin/dashboard`.
2. Verifikasi sistem melakukan redirect ke `/login` atau menampilkan halaman Forbidden.
