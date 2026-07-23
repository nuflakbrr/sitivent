# Test Case: Simulated Email Environment Fallback (TC075)

## Skenario Pengujian
Memastikan sistem melakukan fallback simulasi email konsol apabila kredensial SMTP tidak terdefinisi di variabel lingkungan.

## Prasyarat
- Variabel `SMTP_USER` atau `SMTP_PASS` menggunakan kredensial dummy/kosong.

## Kondisi
- **Input**: `queueEmail` dipanggil.
- **Output yang Diharapkan**:
  - `getTransporter()` mengembalikan `null`, log `[SIMULATED EMAIL]` dicetak di konsol, dan status email diset `SENT`.

## Langkah-Langkah Pengujian
1. Panggil pengiriman email saat kredensial dummy.
2. Verifikasi status email tetap menjadi `SENT` melalui simulasi.
