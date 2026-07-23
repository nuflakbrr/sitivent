# Test Case: Testimonial Rating Boundary (TC083)

## Skenario Pengujian
Memastikan nilai rating testimoni dibatasi hanya pada skala 1 hingga 5 bintang.

## Prasyarat
- Peserta ter-login dan mengirimkan ulasan event.

## Kondisi
- **Input**: Rating: `5`
- **Output yang Diharapkan**:
  - Rating tersimpan dengan benar di range 1-5.

## Langkah-Langkah Pengujian
1. Kirim ulasan dengan rating 5 bintang.
2. Verifikasi bintang rating tampil sesuai input di UI.
