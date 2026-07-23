# Test Case: Newsletter Unsubscribe Request (TC087)

## Skenario Pengujian
Memastikan subscriber newsletter dapat berhenti berlangganan.

## Prasyarat
- Email terdaftar di `NewsletterSubscriber`.

## Kondisi
- **Input**: Klik tautan berhenti berlangganan.
- **Output yang Diharapkan**:
  - Field `isSubscribed` berubah menjadi `false`.

## Langkah-Langkah Pengujian
1. Akses tautan berhenti berlangganan.
2. Verifikasi status berlangganan diperbarui.
