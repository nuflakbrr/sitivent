# Test Case: Admin Dashboard Quick Stats (TC089)

## Skenario Pengujian
Memastikan Admin Dashboard menampilkan statistik total event, jumlah pendaftar, pendapatan, dan total pengguna dengan akurat.

## Prasyarat
- Admin di `/admin/dashboard`.

## Kondisi
- **Input**: Buka `/admin/dashboard`.
- **Output yang Diharapkan**:
  - Kartu statistik menampilkan data aktual dari agregasi Prisma.

## Langkah-Langkah Pengujian
1. Buka admin dashboard.
2. Verifikasi angka statistik tampil.
