# Test Case: Event Category Management (TC036)

## Skenario Pengujian
Memastikan Admin dapat menambah kategori event baru.

## Prasyarat
- Admin ter-login dan berada di `/admin/master/categories`.

## Kondisi
- **Input**: nama kategori `Artificial Intelligence`
- **Output yang Diharapkan**:
  - Kategori baru tersimpan di database.

## Langkah-Langkah Pengujian
1. Buka `/admin/master/categories`.
2. Klik "+ Tambah Kategori".
3. Masukkan `Artificial Intelligence` dan klik Simpan.
4. Verifikasi kategori muncul di tabel.
