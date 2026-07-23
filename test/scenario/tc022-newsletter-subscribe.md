# Test Case: Newsletter Subscription (TC022)

## Skenario Pengujian
Memastikan pengunjung dapat berlangganan newsletter melalui formulir newsletter.

## Prasyarat
- Email `langganan@gmail.com` belum pernah terdaftar di newsletter.

## Kondisi
- **Input**:
  - Email: `langganan@gmail.com`
- **Output yang Diharapkan**:
  - Email tersimpan di daftar `NewsletterSubscriber`.
  - Toast notifikasi "Berhasil berlangganan newsletter!" muncul.

## Langkah-Langkah Pengujian
1. Buka beranda `/`.
2. Scroll ke bagian formulir newsletter di footer/halaman.
3. Masukkan `langganan@gmail.com` pada input email newsletter.
4. Klik tombol "Langganan".
5. Verifikasi pesan sukses berlangganan.
