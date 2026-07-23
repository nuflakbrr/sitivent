# Test Case: Email Queue Processing & Retry (TC053)

## Skenario Pengujian
Memastikan antrean email memproses pesan status `PENDING` dan melakukan retry maksimal 3 kali jika terjadi kegagalan.

## Prasyarat
- Layanan pengiriman email `processEmailQueue` aktif.

## Kondisi
- **Input**: Data email di `email_queues` dengan `attempts < 3`.
- **Output yang Diharapkan**:
  - Email sukses terkirim (`SENT`) atau diubah menjadi `FAILED` apabila percobaan mencapai 3 kali.

## Langkah-Langkah Pengujian
1. Antrekan email baru via `queueEmail`.
2. Jalankan `processEmailQueue`.
3. Verifikasi pembaruan status antrean email di database.
