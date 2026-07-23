# Test Case: Login Empty Input Validation (TC058)

## Skenario Pengujian
Memastikan pengiriman form login dengan bidang kosong menampilkan pesan validasi error.

## Prasyarat
- Halaman login `/login`.

## Kondisi
- **Input**: Email dan password kosong.
- **Output yang Diharapkan**:
  - Validasi form menolak pengiriman dan menampilkan pesan error wajib diisi.

## Langkah-Langkah Pengujian
1. Buka `/login`.
2. Klik tombol "Masuk" tanpa mengisi input.
3. Verifikasi pesan validasi error.
