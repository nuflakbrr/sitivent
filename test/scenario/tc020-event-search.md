# Test Case: Event Search & Filter (TC020)

## Skenario Pengujian
Memastikan pengguna dapat mencari event berdasarkan kata kunci pada halaman eksplorasi event.

## Prasyarat
- Terdapat event yang telah dibuat di sistem (misal: "Seminar AI").

## Kondisi
- **Input**:
  - Kata Kunci pencarian: `Seminar`
- **Output yang Diharapkan**:
  - Daftar event menyaring dan hanya menampilkan event yang sesuai dengan kata kunci "Seminar".

## Langkah-Langkah Pengujian
1. Buka halaman katalog event `/events`.
2. Masukkan kata kunci `Seminar` pada input pencarian.
3. Tekan Enter atau tunggu filter otomatis.
4. Verifikasi kartu event yang tampil mengandung judul `Seminar`.
