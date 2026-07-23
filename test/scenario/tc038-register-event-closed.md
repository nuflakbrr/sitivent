# Test Case: Register Event Closed Block (TC038)

## Skenario Pengujian
Memastikan pendaftaran ditolak jika tanggal pelaksanaan event telah lewat.

## Prasyarat
- Event dengan tanggal pelaksanaan di masa lalu.

## Kondisi
- **Input**: Buka detail event lampau.
- **Output yang Diharapkan**:
  - Tombol pendaftaran dinonaktifkan dengan status "Pendaftaran Ditutup" / "Event Selesai".

## Langkah-Langkah Pengujian
1. Buka detail event yang sudah berakhir.
2. Verifikasi status pendaftaran ditutup.
