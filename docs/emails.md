# Dokumentasi Arsitektur: Email & Antrean - SITIVENT

Modul email bertanggung jawab mengirimkan email transactional kepada pengguna dan peserta event secara handal menggunakan antrean (Queue) di latar belakang.

---

## 1. Desain Arsitektur Antrean (Email Queue)

Untuk menjaga performa loading page utama agar tetap cepat:
* **Asynchronous Delivery**: Pengiriman email **DILARANG** diproses secara langsung (synchronous) pada thread utama request Server Actions.
* **Database Queue / Redis Queue**: Data email (tujuan, subject, body html, attachments) disimpan ke tabel antrean pengiriman email.
* **Worker Process**: Background worker/cron service akan memproses antrean email secara berkala, mengirimkannya ke SMTP Server, lalu menandai status pengiriman (`success` / `failed` dengan log error).

---

## 2. Jenis Templat Email (Email Types)

Sistem SITIVENT mengirimkan beberapa jenis email berikut:
1. **Welcome & Verifikasi**: Pengiriman tautan verifikasi email saat akun dibuat.
2. **Registration Success**: Konfirmasi bahwa registrasi event berhasil dicatat.
3. **Payment Success & QR Code**: Dikirim setelah pembayaran diverifikasi oleh admin. Melampirkan gambar QR Code / menyisipkannya langsung di body email untuk check-in.
4. **Event Reminder**: Pengingat otomatis H-1 event kepada seluruh peserta terdaftar.
5. **Certificate Ready**: Dikirim setelah event selesai, melampirkan PDF sertifikat peserta yang hadir.
6. **Password Reset**: Tautan perubahan kata sandi aman.

---

## 3. Aturan & Standar Pengiriman

* **Attachment Handling**: Gambar QR Code dikompresi agar ukuran email tetap kecil. File PDF sertifikat dilampirkan langsung dari path penyimpanan lokal/cloud.
* **Consistent Template**: Menggunakan template HTML responsif yang konsisten di semua jenis email.
* **Failover Logic**: Jika pengiriman gagal (SMTP down), worker akan mencoba mengirim ulang (retry) maksimal 3 kali sebelum menandainya gagal permanen.
