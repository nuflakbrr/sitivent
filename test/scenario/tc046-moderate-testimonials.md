# Test Case: Moderate Testimonials (TC046)

## Skenario Pengujian
Memastikan Admin dapat menyetujui (approve) atau menayangkan testimoni di beranda utama.

## Prasyarat
- Admin ter-login di `/admin/publications/testimonies`.

## Kondisi
- **Input**: Klik "Tampilkan di Beranda / Setujui".
- **Output yang Diharapkan**:
  - Testimoni muncul pada komponen testimoni publik di homepage.

## Langkah-Langkah Pengujian
1. Buka `/admin/publications/testimonies`.
2. Klik sakelar/tombol tampilkan testimoni.
3. Buka homepage `/` dan verifikasi testimoni tampil.
