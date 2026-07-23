# Test Case: Upload Invalid Payment Proof (TC039)

## Skenario Pengujian
Memastikan unggah bukti pembayaran gagal jika format berkas bukan gambar/PDF atau ukuran melebihi batas 5MB.

## Prasyarat
- Halaman unggah bukti pembayaran `/participant/dashboard`.

## Kondisi
- **Input**: Berkas `.txt` atau berkas melebihi 5MB.
- **Output yang Diharapkan**:
  - Unggah ditolak dengan notifikasi "Format berkas tidak didukung atau ukuran melebihi batas".

## Langkah-Langkah Pengujian
1. Buka modal unggah bukti pembayaran.
2. Pilih berkas invalid `.txt`.
3. Klik simpan/unggah.
4. Verifikasi notifikasi error validasi berkas.
