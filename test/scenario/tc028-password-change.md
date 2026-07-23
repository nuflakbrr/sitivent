# Test Case: Password Change (TC028)

## Skenario Pengujian
Memastikan pengguna dapat mengubah kata sandi akun mereka dari pengaturan profil.

## Prasyarat
- Pengguna ter-login dan berada di `/participant/profile` atau `/admin/profile`.

## Kondisi
- **Input**:
  - Password Lama: `Password123`
  - Password Baru: `PasswordBaru456`
  - Konfirmasi Password Baru: `PasswordBaru456`
- **Output yang Diharapkan**:
  - Password berhasil diubah.
  - Toast notifikasi "Password berhasil diperbarui" muncul.

## Langkah-Langkah Pengujian
1. Buka halaman pengaturan profil.
2. Masukkan password lama dan password baru.
3. Klik "Ubah Password".
4. Verifikasi notifikasi sukses.
