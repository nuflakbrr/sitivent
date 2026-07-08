# Dokumentasi Fitur: QR Code & Kehadiran - SITIVENT

Modul kehadiran mengelola pencatatan check-in peserta menggunakan QR Code secara offline pada hari H event.

---

## 1. Mekanisme QR Code

* **QR Code Generation**: QR Code berisi token unik yang aman diproduksi secara otomatis setelah status pendaftaran peserta bernilai `REGISTERED`.
* **Keamanan Token**:
  * Token dienkripsi / dibuat secara acak (tidak menggunakan format ID database berurutan) agar tidak mudah didebak.
  * Satu token berlaku terbatas hanya untuk kombinasi event dan peserta terkait.

---

## 2. Validasi & Scan QR Code

Proses check-in dilakukan oleh scanner di lokasi event:
1. Scanner memindai QR Code peserta.
2. Server memvalidasi token QR:
   * **Valid**: Status registrasi berubah menjadi `CHECKED_IN`, dan waktu scan dicatat di database.
   * **QR_ALREADY_USED**: Jika status pendaftaran peserta sudah `CHECKED_IN`, berikan pesan bahwa QR telah dipakai.
   * **INVALID_QR**: Token tidak dikenali atau salah.
3. **Penyimpanan Log Kehadiran**: Setiap check-in yang berhasil dicatat di tabel audit kehadiran yang menyimpan waktu scan, ID scanner, dan status.

---

## 3. Aturan Kehadiran (Attendance Rules)

* **Offline Event ONLY**: Fitur absensi/scan QR hanya berlaku untuk event dengan tipe `OFFLINE`.
* **Event Deadline Guard**: Absensi tidak dapat dilakukan jika status event sudah `COMPLETED` atau tanggal event sudah selesai.
* **Double Check-In Protection**: Admin/Scanner dilarang melakukan scan ulang peserta yang sudah hadir.
