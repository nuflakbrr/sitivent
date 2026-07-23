# Test Case: Edit Event Details (TC034)

## Skenario Pengujian
Memastikan Admin dapat memperbarui rincian data event yang sudah ada.

## Prasyarat
- Admin ter-login dan berada di `/admin/master/events`.

## Kondisi
- **Input**: Ubah judul event menjadi `Workshop UI/UX Update`
- **Output yang Diharapkan**:
  - Judul event berhasil diperbarui di database dan tabel UI.

## Langkah-Langkah Pengujian
1. Buka `/admin/master/events`.
2. Klik tombol Edit pada event.
3. Ubah judul event dan klik Simpan.
4. Verifikasi perubahan judul event.
