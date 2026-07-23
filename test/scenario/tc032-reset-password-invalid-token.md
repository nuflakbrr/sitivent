# Test Case: Reset Password Invalid Token (TC032)

## Skenario Pengujian
Memastikan tautan reset password dengan token tidak valid atau kadaluarsa menolak perubahan kata sandi.

## Prasyarat
- Halaman reset password `/reset-password?token=invalid-token`.

## Kondisi
- **Input**: Token tidak valid
- **Output yang Diharapkan**:
  - Pesan error "Token tidak valid atau kadaluarsa" ditampilkan.

## Langkah-Langkah Pengujian
1. Buka `/reset-password?token=invalid-token-123`.
2. Masukkan password baru dan konfirmasi.
3. Klik "Reset Password".
4. Verifikasi notifikasi error penolakan token.
