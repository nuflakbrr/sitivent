# Test Case: Registration Unique Code Generation (TC078)

## Skenario Pengujian
Memastikan setiap pendaftaran menghasilkan kode pendaftaran unik (`registrationCode`).

## Prasyarat
- Pendaftaran event baru.

## Kondisi
- **Input**: Pendaftaran event.
- **Output yang Diharapkan**:
  - `registrationCode` berformat unik (contoh `REG-XXXXXX`) terbuat.

## Langkah-Langkah Pengujian
1. Lakukan pendaftaran event.
2. Verifikasi kode pendaftaran unik di tiket peserta.
