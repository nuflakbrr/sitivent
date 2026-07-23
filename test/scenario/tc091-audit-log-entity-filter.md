# Test Case: Audit Log Entity Filtering (TC091)

## Skenario Pengujian
Memastikan Admin dapat menyaring catatan log audit berdasarkan tipe entitas (Event, User, Payment, Registration).

## Prasyarat
- Admin di `/admin/managements/audit-logs`.

## Kondisi
- **Input**: Filter entitas `Payment`.
- **Output yang Diharapkan**:
  - Tabel audit log menyaring hanya aktivitas entitas `Payment`.

## Langkah-Langkah Pengujian
1. Buka audit logs.
2. Filter entitas `Payment`.
3. Verifikasi daftar audit log terfilter.
