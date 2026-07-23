# Test Case: Draft Article Preview (TC070)

## Skenario Pengujian
Memastikan artikel berstatus DRAFT tidak tampil di halaman publik `/articles`.

## Prasyarat
- Artikel berstatus DRAFT di database.

## Kondisi
- **Input**: Buka `/articles`.
- **Output yang Diharapkan**:
  - Artikel DRAFT tidak muncul pada daftar publik artikel.

## Langkah-Langkah Pengujian
1. Buka `/articles`.
2. Verifikasi artikel berstatus draft tidak ditampilkan.
