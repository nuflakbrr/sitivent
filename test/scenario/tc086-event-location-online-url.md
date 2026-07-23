# Test Case: Event Location vs Online URL Validation (TC086)

## Skenario Pengujian
Memastikan tautan meeting online wajib diisi jika tipe event adalah `isOnline: true`.

## Prasyarat
- Admin membuat event online di `/admin/master/events/create`.

## Kondisi
- **Input**: `isOnline: true`, tautan meeting kosong.
- **Output yang Diharapkan**:
  - Validasi menolak pengisian dengan pesan "Tautan meeting wajib diisi untuk event online".

## Langkah-Langkah Pengujian
1. Pilih tipe event online tanpa mengisi link meeting.
2. Simpan.
3. Verifikasi pesan error validasi.
