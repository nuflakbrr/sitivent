# Test Case: Support Message Reply Email (TC084)

## Skenario Pengujian
Memastikan balasan pesan dari Admin ter-queue untuk dikirimkan ke email penanya.

## Prasyarat
- Admin membalas pesan di `/admin/support/inbox`.

## Kondisi
- **Input**: Isi Balasan: `Terima kasih, sertifikat dapat diunduh pada tab sertifikat.`
- **Output yang Diharapkan**:
  - Email balasan ter-queue di `email_queues` dan status pesan ter-update `REPLIED`.

## Langkah-Langkah Pengujian
1. Balas pesan penanya di inbox admin.
2. Verifikasi email balasan masuk ke antrean email.
