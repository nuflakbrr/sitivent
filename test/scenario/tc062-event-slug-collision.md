# Test Case: Event Slug Collision Handling (TC062)

## Skenario Pengujian
Memastikan pembuatan dua event dengan judul yang sama menghasilkan slug unik tanpa bentrok database.

## Prasyarat
- Admin membuat event dengan judul persis sama.

## Kondisi
- **Input**: Judul event `Seminar Web Dev 2026`
- **Output yang Diharapkan**:
  - Event pertama slug `seminar-web-dev-2026`, event kedua `seminar-web-dev-2026-1`.

## Langkah-Langkah Pengujian
1. Buat event pertama dengan judul `Seminar Web Dev 2026`.
2. Buat event kedua dengan judul yang sama.
3. Verifikasi kedua event tersimpan dengan slug berbeda.
