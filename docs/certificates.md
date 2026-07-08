# Dokumentasi Fitur: Sertifikat Digital - SITIVENT

Modul sertifikat mengelola pembuatan template serta distribusi sertifikat kelulusan/partisipasi event kepada para peserta.

---

## 1. Syarat Pembuatan Sertifikat

Sertifikat hanya dapat diakses dan diunduh oleh peserta jika memenuhi seluruh kondisi berikut:
1. Event yang diikuti mengaktifkan fitur sertifikat (`certificateEnabled === true`).
2. Peserta terbukti hadir di event dengan status registrasi bernilai `CHECKED_IN`.
3. Event telah selesai diselenggarakan (`status === 'COMPLETED'` atau telah dikonfirmasi selesai oleh admin).

---

## 2. Pembuatan Template & PDF

Sistem menyediakan fitur bagi admin untuk mendesain sertifikat:
* **Template Management**: Admin dapat mengunggah file background template (format PDF atau gambar berkualitas tinggi).
* **PDF Rendering**: Server-side engine merender teks (nama peserta, judul event, peran) secara dinamis di atas template tersebut menggunakan data real database.
* **Storage & URL**: Hasil generate PDF disimpan di cloud / folder upload lokal, menghasilkan URL download yang aman.

---

## 3. Distribusi Sertifikat

Sertifikat dapat diunduh oleh peserta melalui dua jalur utama:
* **Dashboard**: Muncul tombol "Unduh Sertifikat" pada daftar riwayat event di dashboard peserta yang telah check-in.
* **Email**: PDF dikirimkan secara otomatis sebagai lampiran email setelah event selesai.
