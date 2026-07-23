# Test Case: Create Event Benefits & Material Link (TC060)

## Skenario Pengujian
Memastikan Admin dapat menambahkan daftar benefit dan tautan materi event.

## Prasyarat
- Admin ter-login di `/admin/master/events/create`.

## Kondisi
- **Input**: Benefit `E-Sertifikat`, Tautan Materi `https://drive.google.com/sample`
- **Output yang Diharapkan**:
  - Benefit dan link materi tersimpan.

## Langkah-Langkah Pengujian
1. Isi formulir event beserta benefit dan materi.
2. Simpan event.
3. Verifikasi halaman publik event menampilkan benefit.
