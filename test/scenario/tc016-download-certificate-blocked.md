# Test Case: Certificate Download Blocked for Non-Attendees (TC016)

## Skenario Pengujian
Memastikan peserta yang tidak hadir (status registrasi `REGISTERED` atau `WAITING_PAYMENT`, bukan `CHECKED_IN`) tidak diperbolehkan mengunduh sertifikat event meskipun event tersebut sudah selesai (`COMPLETED`).

## Prasyarat
- Peserta sudah masuk ke dalam sistem.
- Peserta terdaftar pada event `event-gratis-2` dengan status kehadiran `REGISTERED` (tidak melakukan check-in / tidak hadir).
- Event `event-gratis-2` statusnya sudah `COMPLETED`.

## Kondisi
- **Input**:
  - Akses Halaman: Dashboard peserta `/participant/dashboard`
- **Output yang Diharapkan**:
  - Tombol "Unduh Sertifikat" tidak ditampilkan untuk event `event-gratis-2`.
  - Jika peserta memanggil endpoint download sertifikat secara langsung via URL bypass, server memblokir dan mengembalikan error otorisasi/akses ditolak.

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta, buka dashboard peserta `/participant/dashboard`.
2. Buka tab atau bagian "Riwayat Event".
3. Temukan baris event `event-gratis-2` (status event: `COMPLETED`, status kehadiran: `REGISTERED`).
4. Verifikasi bahwa tombol "Unduh Sertifikat" untuk event ini tidak terlihat di halaman.
5. (Opsional) Coba akses URL direct download sertifikat tersebut, verifikasi server mengembalikan error 403 Forbidden atau error sejenis.
