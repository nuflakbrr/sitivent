# Test Case: User Role Management (TC026)

## Skenario Pengujian
Memastikan Super Admin dapat mengelola jabatan/role pengguna.

## Prasyarat
- Super Admin ter-login dan berada di `/admin/managements/users`.

## Kondisi
- **Input**:
  - Pengguna: `peserta@gmail.com`
  - Jabatan/Role baru: `Panitia` / `Admin`
- **Output yang Diharapkan**:
  - Jabatan pengguna berhasil diperbarui di database dan tabel pengguna UI.

## Langkah-Langkah Pengujian
1. Buka `/admin/managements/users`.
2. Klik tombol aksi (tiga titik) pada baris pengguna.
3. Klik "Edit".
4. Ubah Jabatan ke role yang diinginkan.
5. Klik "Simpan".
6. Verifikasi kolom "Jabatan" pada pengguna memperbarui role baru.
