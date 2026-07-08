# Dokumentasi Fitur: Pendaftaran Peserta - SITIVENT

Modul ini mengelola pendaftaran peserta ke event yang tersedia di sistem SITIVENT.

---

## 1. Alur Pendaftaran Event

Peserta mendaftar ke event publik dengan tahapan berikut:
1. **Validasi Ketersediaan**: Sistem memeriksa apakah event masih berstatus `PUBLISHED`, kuota masih tersedia, dan deadline pendaftaran belum terlewati.
2. **Pengecekan Duplikasi**: Peserta hanya boleh mendaftar **satu kali** pada event yang sama. Pengecekan didasarkan pada kombinasi `userId` dan `eventId` di database.
3. **Penyimpanan Registrasi**:
   * Data disimpan di Prisma model `Registration`.
   * Sistem menghasilkan **Nomor Registrasi** unik serta **QR Token** acak yang aman.

---

## 2. Status Registrasi (Registration Status)

Setiap pendaftaran memiliki status:
* **WAITING_PAYMENT**: Menunggu proses pembayaran selesai dan diverifikasi (untuk event berbayar).
* **REGISTERED**: Terdaftar secara resmi. QR Code aktif untuk check-in.
* **CANCELLED**: Pendaftaran dibatalkan secara manual oleh peserta atau sistem.
* **CHECKED_IN**: Peserta telah hadir di lokasi event dan QR Code-nya telah berhasil divalidasi.

---

## 3. Validasi & Aturan Bisnis

AI Agent wajib memastikan bahwa server-side action untuk pendaftaran memverifikasi hal berikut:
* Event masih aktif (`status === 'PUBLISHED'`).
* Sisa kuota (`quota - total_registered > 0`).
* Tanggal saat ini belum melewati `registrationDeadline`.
* Validasi input parameter menggunakan Zod.
