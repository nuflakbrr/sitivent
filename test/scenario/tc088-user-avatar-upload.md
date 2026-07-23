# Test Case: User Avatar Image Upload (TC088)

## Skenario Pengujian
Memastikan pengguna dapat mengunggah dan mengubah foto profil (avatar).

## Prasyarat
- Pengguna ter-login di `/participant/profile`.

## Kondisi
- **Input**: Unggah foto berkas gambar valid.
- **Output yang Diharapkan**:
  - Avatar diperbarui di database dan komponen UI Navbar.

## Langkah-Langkah Pengujian
1. Unggah foto avatar di profil.
2. Simpan.
3. Verifikasi avatar diperbarui di header profil dan navbar.
