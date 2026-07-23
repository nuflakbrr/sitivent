# Test Case: Gallery Management (TC025)

## Skenario Pengujian
Memastikan Admin dapat menambahkan foto dokumentasi ke galeri event.

## Prasyarat
- Admin ter-login dan berada di `/admin/master/galleries`.

## Kondisi
- **Input**:
  - Event: `Seminar Teknologi`
  - Gambar: URL / File foto dokumentasi
- **Output yang Diharapkan**:
  - Foto dokumentasi terdaftar di galeri event.

## Langkah-Langkah Pengujian
1. Buka `/admin/master/galleries`.
2. Klik tombol "+ Tambah Galeri".
3. Pilih event dan unggah foto dokumentasi.
4. Klik tombol "Simpan".
5. Verifikasi foto tampil pada grid galeri.
