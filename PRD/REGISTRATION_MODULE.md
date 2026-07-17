# Registration Module - SITIVENT

Registrasi terdiri dari:

- Event
- Peserta
- Nomor Registrasi
- QR Token
- Status
- Payment Status

## Registration Status

```text
WAITING_PAYMENT

REGISTERED

CANCELLED

CHECKED_IN
```

## Registration Rules

Peserta hanya boleh mendaftar satu kali pada event yang sama.

AI wajib melakukan validasi:

- Event masih dibuka.
- Kuota tersedia.
- Deadline belum lewat.
- User belum pernah mendaftar.
