# Dokumentasi Fitur: Pembayaran & Transaksi - SITIVENT

Modul pembayaran menangani pemrosesan transaksi biaya pendaftaran event berbayar di SITIVENT.

---

## 1. Alur Pembayaran

Pembayaran dibedakan berdasarkan jenis event:
* **Event Gratis (`price === 0`)**:
  * Status registrasi langsung berubah menjadi `REGISTERED`.
  * Tidak ada transaksi pembayaran yang dibuat di database.
* **Event Berbayar (`price > 0`)**:
  * Status registrasi awal diset ke `WAITING_PAYMENT`.
  * Peserta melakukan transfer manual dan mengunggah bukti pembayaran.
  * Status pembayaran diatur ke `WAITING`.

---

## 2. Status Transaksi Pembayaran

Tabel pembayaran menyimpan status transaksi berikut:
* **WAITING**: Menunggu verifikasi bukti transfer oleh admin.
* **PAID**: Bukti transfer valid dan disetujui. Registrasi otomatis berubah ke `REGISTERED`.
* **FAILED**: Transaksi ditolak (bukti transfer palsu/salah nominal).
* **REFUNDED**: Dana dikembalikan kepada peserta karena event dibatalkan atau alasan tertentu.

---

## 3. Verifikasi & Audit Log

* **Admin Only Action**: Verifikasi status pembayaran dari `WAITING` menjadi `PAID` atau `FAILED` hanya dapat dilakukan oleh Admin yang memiliki hak akses `payments.verify`.
* **Audit Trail**: Setiap perubahan status pembayaran wajib dicatat di audit log server yang melacak identitas admin pengubah, waktu perubahan, dan alasan penolakan/persetujuan.
