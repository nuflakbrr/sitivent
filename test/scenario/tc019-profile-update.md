# Test Case: Profile Update (TC019)

## Skenario Pengujian
Memastikan peserta dapat memperbarui nama dan profil di portal peserta.

## Prasyarat
- Peserta sudah ter-login dan berada di halaman `/participant/profile`.

## Kondisi
- **Input**:
  - Nama Lengkap (`#name`): `Peserta Terbaru`
- **Output yang Diharapkan**:
  - Data nama berhasil diperbarui di database dan tampilan UI.
  - Toast sukses pembaruan profil muncul.

## Langkah-Langkah Pengujian
1. Buka `/participant/profile`.
2. Ubah bidang nama menjadi `Peserta Terbaru`.
3. Klik tombol "Simpan Perubahan".
4. Verifikasi notifikasi sukses dan pembaruan nama di header profil.
