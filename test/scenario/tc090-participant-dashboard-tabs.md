# Test Case: Participant Dashboard Event Tabs (TC090)

## Skenario Pengujian
Memastikan tab penyaringan di portal peserta memisahkan event mendatang (Upcoming) dan event yang telah diikuti (Past).

## Prasyarat
- Peserta ter-login di `/participant/dashboard`.

## Kondisi
- **Input**: Klik tab "Event Lampau / Selesai".
- **Output yang Diharapkan**:
  - Hanya menampilkan event yang sudah selesai.

## Langkah-Langkah Pengujian
1. Buka dashboard peserta.
2. Pindah antar tab event.
3. Verifikasi daftar event terfilter.
