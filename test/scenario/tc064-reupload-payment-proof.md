# Test Case: Re-upload Payment Proof Post Rejection (TC064)

## Skenario Pengujian
Memastikan peserta dapat mengunggah ulang bukti pembayaran jika bukti sebelumnya ditolak admin.

## Prasyarat
- Pendaftaran berstatus `REJECTED`.

## Kondisi
- **Input**: Berkas bukti transfer baru valid.
- **Output yang Diharapkan**:
  - Status pembayaran kembali menjadi `PENDING` untuk ditinjau ulang admin.

## Langkah-Langkah Pengujian
1. Buka `/participant/dashboard`.
2. Unggah ulang bukti transfer baru.
3. Verifikasi status pembayaran kembali `PENDING`.
