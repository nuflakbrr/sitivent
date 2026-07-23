# Test Case: Forgot Password Request (TC018)

## Skenario Pengujian
Memastikan pengguna dapat meminta link reset password melalui formulir lupa password.

## Prasyarat
- Email pengguna `peserta@gmail.com` terdaftar di sistem.

## Kondisi
- **Input**:
  - Email (`#email`): `peserta@gmail.com`
- **Output yang Diharapkan**:
  - Notifikasi sukses "Email instruksi reset password telah dikirim" atau serupa muncul.
  - Email reset password ter-queue di `email_queues`.

## Langkah-Langkah Pengujian
1. Buka halaman `/forgot-password`.
2. Masukkan email `peserta@gmail.com` pada input `#email`.
3. Klik tombol "Kirim Link Reset".
4. Verifikasi munculnya pesan konfirmasi pengiriman email reset password.
