# Test Case: Bulk Certificate Generation (TC068)

## Skenario Pengujian
Memastikan Admin dapat melakukan penerbitan sertifikat sekaligus (bulk) untuk seluruh peserta terkonfirmasi hadir.

## Prasyarat
- Admin di `/admin/master/certificates`.

## Kondisi
- **Input**: Klik "Generate Semua Sertifikat".
- **Output yang Diharapkan**:
  - Berkas sertifikat ter-generate untuk seluruh peserta `ATTENDED`.

## Langkah-Langkah Pengujian
1. Buka manajemen sertifikat.
2. Klik generate massal.
3. Verifikasi jumlah sertifikat ter-generate.
