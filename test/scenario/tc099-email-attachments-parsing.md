# Test Case: Email Attachments Parsing (TC099)

## Skenario Pengujian
Memastikan antrean pengiriman email yang menyertakan lampiran JSON lampiran terurai tanpa menghentikan pemrosesan antrean.

## Prasyarat
- Modul `processEmailQueue` membaca lampiran `attachments`.

## Kondisi
- **Input**: Email dengan lampiran JSON stringified.
- **Output yang Diharapkan**:
  - Lampiran berhasil di-parse dan dikirim via transporter.

## Langkah-Langkah Pengujian
1. Kirim email berlampiran.
2. Verifikasi parser lampiran memproses berkas tanpa melempar kecelakaan error.
