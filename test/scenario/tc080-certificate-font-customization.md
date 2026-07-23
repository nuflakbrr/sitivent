# Test Case: Certificate Font Customization (TC080)

## Skenario Pengujian
Memastikan Admin dapat mengustomisasi koordinat X/Y, warna, dan ukuran font nama peserta pada template sertifikat.

## Prasyarat
- Admin di `/admin/master/certificates`.

## Kondisi
- **Input**: `nameX: 500`, `nameY: 300`, `fontSize: 32`, `fontColor: #D97757`
- **Output yang Diharapkan**:
  - Konfigurasi tata letak teks sertifikat tersimpan.

## Langkah-Langkah Pengujian
1. Atur posisi X/Y dan warna font pada editor sertifikat.
2. Klik simpan template.
3. Verifikasi tata letak pratinjau sertifikat.
