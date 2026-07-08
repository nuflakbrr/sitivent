# Test Case: Double Registration Guard (TC010)

## Skenario Pengujian
Memastikan sistem memblokir pendaftaran berulang jika peserta yang sama sudah pernah terdaftar pada event tersebut.

## Prasyarat
- Peserta sudah masuk ke dalam sistem.
- Peserta sudah terdaftar pada event `event-gratis-1` (status pendaftaran `REGISTERED` atau `WAITING_PAYMENT`).

## Kondisi
- **Input**:
  - Event ID / Slug: `event-gratis-1` (event yang sudah didaftar)
- **Output yang Diharapkan**:
  - Tombol "Daftar Event" pada halaman detail dinonaktifkan / menyembunyikan opsi pendaftaran, atau jika dipaksa submit, backend memblokir dan mengembalikan error "User belum pernah mendaftar" / "Anda sudah terdaftar".

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta yang sudah terdaftar pada `event-gratis-1`.
2. Buka halaman detail event `/events/event-gratis-1`.
3. Verifikasi tombol "Daftar Event" dinonaktifkan atau menampilkan teks "Sudah Terdaftar".
4. (Jika tombol aktif/dapat di-klik) Klik tombol pendaftaran dan verifikasi notifikasi error "Anda sudah terdaftar pada event ini" / "Sudah terdaftar".
