# Test Case: Banned User Login Block (TC029)

## Skenario Pengujian
Memastikan akun pengguna yang dibanned tidak dapat melakukan login ke sistem.

## Prasyarat
- Akun `banneduser@gmail.com` dalam status dibanned oleh admin.

## Kondisi
- **Input**:
  - Email: `banneduser@gmail.com`
  - Password: `Password123`
- **Output yang Diharapkan**:
  - Login ditolak.
  - Pesan error "Akun Anda telah dibanned" beserta alasannya muncul.

## Langkah-Langkah Pengujian
1. Buka `/login`.
2. Masukkan email pengguna ter-ban dan password.
3. Klik tombol "Masuk".
4. Verifikasi kemunculan notifikasi error pemblokiran akun.
