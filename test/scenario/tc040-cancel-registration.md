# Test Case: Cancel Registration (TC040)

## Skenario Pengujian
Memastikan peserta dapat membatalkan pendaftaran event yang masih berstatus pending.

## Prasyarat
- Peserta memiliki pendaftaran berstatus `PENDING` di `/participant/dashboard`.

## Kondisi
- **Input**: Klik "Batalkan Pendaftaran" dan konfirmasi.
- **Output yang Diharapkan**:
  - Pendaftaran dibatalkan dan status berubah menjadi `CANCELLED`.

## Langkah-Langkah Pengujian
1. Buka `/participant/dashboard`.
2. Klik tombol batalkan pada pendaftaran aktif.
3. Konfirmasi pembatalan.
4. Verifikasi status diperbarui.
