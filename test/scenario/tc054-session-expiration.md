# Test Case: Session Expiration & Refresh (TC054)

## Skenario Pengujian
Memastikan sesi pengguna yang telah kadaluarsa mengarahkan ulang (redirect) pengguna ke halaman login.

## Prasyarat
- Session token kadaluarsa di browser.

## Kondisi
- **Input**: Akses halaman terproteksi `/participant/dashboard`.
- **Output yang Diharapkan**:
  - Dialihkan ke `/login`.

## Langkah-Langkah Pengujian
1. Akses `/participant/dashboard` dengan cookie sesi kadaluarsa.
2. Verifikasi halaman dialihkan ke `/login`.
