# Test Case: Download Certificate Success (TC015)

## Skenario Pengujian
Memastikan peserta yang hadir (`status === CHECKED_IN`) dapat mengunduh sertifikat event setelah event tersebut dinyatakan selesai (`COMPLETED`).

## Prasyarat
- Peserta sudah masuk ke dalam sistem.
- Peserta terdaftar pada event `event-gratis-1` dengan status kehadiran `CHECKED_IN`.
- Event `event-gratis-1` mengaktifkan fitur sertifikat (`certificateEnabled === true`) dan status event sudah `COMPLETED`.

## Kondisi
- **Input**:
  - Aksi: Klik tombol "Unduh Sertifikat" pada baris event di tabel riwayat.
- **Output yang Diharapkan**:
  - Download file PDF sertifikat terinisiasi.
  - Berkas PDF yang diunduh valid.

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta, buka dashboard peserta `/participant/dashboard`.
2. Buka tab atau bagian "Riwayat Event".
3. Temukan baris event `event-gratis-1` (status event: `COMPLETED`, status kehadiran: `CHECKED_IN`).
4. Klik tombol "Unduh Sertifikat" (`#btn-download-cert-event-gratis-1`).
5. Verifikasi pengunduhan file berhasil dimulai dan file berformat PDF.
