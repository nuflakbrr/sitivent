# Test Case: Admin Impersonate User (TC076)

## Skenario Pengujian
Memastikan Super Admin dapat melakukan impersonasi sesi pengguna lain untuk keperluan pengujian/bantuan.

## Prasyarat
- Super Admin ter-login di `/admin/managements/users`.

## Kondisi
- **Input**: Klik "Impersonate / Masuk Sebagai User".
- **Output yang Diharapkan**:
  - Sesi berubah menjadi pengguna yang dituju dengan `impersonatedBy` ter-record.

## Langkah-Langkah Pengujian
1. Akses manajemen user.
2. Klik tombol impersonate.
3. Verifikasi perpindahan sesi ke user tersebut.
