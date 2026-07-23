# Test Case: Storage Upload Handler (TC073)

## Skenario Pengujian
Memastikan modul pengunggahan berkas mengembalikan URL lokasi penyimpanan yang valid.

## Prasyarat
- Layanan pengunggahan berkas `uploads.ts`.

## Kondisi
- **Input**: Unggah gambar banner event.
- **Output yang Diharapkan**:
  - URL publik berkas tersimpan dan dapat diakses.

## Langkah-Langkah Pengujian
1. Unggah berkas gambar via form.
2. Verifikasi respons pengunggahan menghasilkan URL gambar valid.
