# Test Case: Checkin Outside Event Window (TC043)

## Skenario Pengujian
Memastikan presensi ditolak apabila dilakukan sebelum jam mulai atau setelah jam selesai event.

## Prasyarat
- Event belum dimulai atau telah berakhir.

## Kondisi
- **Input**: Scan presensi di luar jadwal pelaksanaan.
- **Output yang Diharapkan**:
  - Presensi ditolak dengan pesan "Presensi belum dibuka / sudah ditutup".

## Langkah-Langkah Pengujian
1. Lakukan presensi untuk event luar jam tayang.
2. Verifikasi kemunculan pesan error penolakan presensi.
