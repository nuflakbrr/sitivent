# Test Case: Submit Event Testimonial (TC045)

## Skenario Pengujian
Memastikan peserta yang telah hadir di event dapat memberikan ulasan dan rating testimoni.

## Prasyarat
- Peserta ter-login dan telah berstatus `ATTENDED` pada event.

## Kondisi
- **Input**: Rating 5 Bintang, Komentar `Event sangat bermanfaat dan narasumber hebat!`
- **Output yang Diharapkan**:
  - Testimoni tersimpan di database.

## Langkah-Langkah Pengujian
1. Buka halaman detail event atau dashboard peserta.
2. Masukkan rating dan ulasan.
3. Klik "Kirim Testimoni".
4. Verifikasi ulasan tersimpan.
