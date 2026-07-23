# Test Case: User Banning & Unbanning (TC051)

## Skenario Pengujian
Memastikan Super Admin dapat melakukan pemblokiran (ban) dan pembukaan blokir (unban) akun pengguna.

## Prasyarat
- Super Admin ter-login di `/admin/managements/users`.

## Kondisi
- **Input**:
  - Alasan Ban: `Pelanggaran syarat & ketentuan`
- **Output yang Diharapkan**:
  - Status `banned` pengguna diperbarui di database.

## Langkah-Langkah Pengujian
1. Buka `/admin/managements/users`.
2. Pilih pengguna dan klik "Ban User".
3. Masukkan alasan pemblokiran dan simpan.
4. Verifikasi status pengguna ter-ban.
