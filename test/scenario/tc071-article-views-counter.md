# Test Case: Article Views Counter (TC071)

## Skenario Pengujian
Memastikan jumlah pembaca artikel (views count) bertambah saat halaman detail artikel dibuka oleh pembaca.

## Prasyarat
- Artikel publik di `/articles/[id]`.

## Kondisi
- **Input**: Buka detail artikel.
- **Output yang Diharapkan**:
  - Kolom `views` pada tabel artikel bertambah 1.

## Langkah-Langkah Pengujian
1. Buka halaman detail artikel `/articles/detail-id`.
2. Verifikasi jumlah views bertambah.
