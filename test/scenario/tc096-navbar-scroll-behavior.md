# Test Case: Navbar Scroll Behavior (TC096)

## Skenario Pengujian
Memastikan latar belakang Navbar berubah dari transparan ke solid backdrop-blur saat pengguna melakukan scroll > 20px.

## Prasyarat
- Halaman beranda `/`.

## Kondisi
- **Input**: Scroll layar > 20px.
- **Output yang Diharapkan**:
  - Class `bg-[#FFFFFF]/96 backdrop-blur-md` aktif pada header.

## Langkah-Langkah Pengujian
1. Buka beranda `/`.
2. Lakukan scroll ke bawah.
3. Verifikasi perubahan tampilan navbar.
