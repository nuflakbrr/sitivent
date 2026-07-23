# Test Case: Event Category Delete Constraint (TC081)

## Skenario Pengujian
Memastikan kategori event yang masih terhubung dengan event aktif ditolak saat akan dihapus.

## Prasyarat
- Kategori terhubung dengan minimal 1 event di database.

## Kondisi
- **Input**: Hapus kategori.
- **Output yang Diharapkan**:
  - Penghapusan ditolak dengan pesan "Kategori tidak dapat dihapus karena masih digunakan oleh event."

## Langkah-Langkah Pengujian
1. Coba hapus kategori yang terikat event.
2. Verifikasi pesan penolakan hapus kategori.
