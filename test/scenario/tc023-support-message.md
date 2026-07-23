# Test Case: Support Message / Contact Form (TC023)

## Skenario Pengujian
Memastikan pengunjung/pengguna dapat mengirimkan pesan pertanyaan atau keluhan via bantuan pelanggan.

## Prasyarat
- Formulir pesan pusat bantuan di halaman `/help` atau `/contact` tersedia.

## Kondisi
- **Input**:
  - Nama: `Penanya`
  - Email: `penanya@gmail.com`
  - Subjek: `Pertanyaan Sertifikat`
  - Pesan: `Bagaimana cara mengunduh sertifikat digital?`
- **Output yang Diharapkan**:
  - Pesan masuk ke `SupportMessage` di database.
  - Toast sukses "Pesan Anda berhasil dikirim" muncul.

## Langkah-Langkah Pengujian
1. Buka halaman `/help`.
2. Masukkan nama `Penanya`, email `penanya@gmail.com`, subjek `Pertanyaan Sertifikat`, dan isi pesan.
3. Klik tombol "Kirim Pesan".
4. Verifikasi notifikasi pengiriman berhasil.
