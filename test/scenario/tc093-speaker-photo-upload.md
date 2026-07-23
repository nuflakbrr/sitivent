# Test Case: Event Speaker Photo Upload (TC093)

## Skenario Pengujian
Memastikan foto narasumber/pembicara event dapat diunggah dan ditayangkan di detail event.

## Prasyarat
- Admin menambahkan narasumber event.

## Kondisi
- **Input**: Unggah berkas foto pembicara.
- **Output yang Diharapkan**:
  - Foto narasumber tampil pada section "Pembicara Event" di `/events/[slug]`.

## Langkah-Langkah Pengujian
1. Unggah foto pembicara.
2. Buka detail event publik.
3. Verifikasi foto pembicara tampil.
