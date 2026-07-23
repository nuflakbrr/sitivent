# Test Case: Delete Event (TC035)

## Skenario Pengujian
Memastikan Admin dapat menghapus event dari sistem.

## Prasyarat
- Admin ter-login dan berada di `/admin/master/events`.

## Kondisi
- **Input**: Klik Hapus pada baris event dan konfirmasi modal alert.
- **Output yang Diharapkan**:
  - Event terhapus dari daftar event.

## Langkah-Langkah Pengujian
1. Buka `/admin/master/events`.
2. Klik aksi Hapus pada event.
3. Konfirmasi penghapusan di modal dialog.
4. Verifikasi event hilang dari tabel.
