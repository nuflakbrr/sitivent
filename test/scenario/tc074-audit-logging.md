# Test Case: Audit Logging Action (TC074)

## Skenario Pengujian
Memastikan setiap tindakan penting (seperti menghapus event, verifikasi pembayaran, atau pemblokiran pengguna) tercatat pada tabel `AuditLog`.

## Prasyarat
- Admin melakukan tindakan sensitif.

## Kondisi
- **Input**: Verifikasi pembayaran peserta.
- **Output yang Diharapkan**:
  - Record baru pada tabel `AuditLog` dengan aksi `PAYMENT_VERIFIED` dan IP/User Agent ter-record.

## Langkah-Langkah Pengujian
1. Lakukan verifikasi pembayaran.
2. Periksa entri audit log di database.
