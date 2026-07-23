# Test Case: Multiple Roles Assignment (TC092)

## Skenario Pengujian
Memastikan sistem dapat menangani pengguna yang disematkan beberapa role melalui relasi `RoleToUser`.

## Prasyarat
- User disematkan role `Panitia` dan `Peserta`.

## Kondisi
- **Input**: Assign 2 role pada user.
- **Output yang Diharapkan**:
  - Hak akses dari kedua role ter-gabung (merged) dengan benar.

## Langkah-Langkah Pengujian
1. Sematkan role tambahan pada user.
2. Verifikasi gabungan izin pengguna.
