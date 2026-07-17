# QR Code & Attendance Module - SITIVENT

## QR Code Module

QR hanya dibuat setelah:

```text
Registration Status = REGISTERED
```

QR harus memiliki:

- Token unik
- Tidak dapat ditebak
- Tidak menggunakan ID database secara langsung
- Berlaku hanya untuk satu event
- Berlaku hanya untuk satu peserta

### QR Validation

Jika valid:

```text
CHECKED_IN
```

Jika sudah pernah digunakan:

```text
QR_ALREADY_USED
```

Jika token tidak ditemukan:

```text
INVALID_QR
```

### QR Rules

QR hanya dapat digunakan sekali.

Admin tidak boleh melakukan scan ulang terhadap QR yang sudah dipakai.

## Attendance Module

Attendance hanya dilakukan pada event OFFLINE.

Attendance dilakukan melalui QR Scanner.

Attendance terdiri dari:

- Registration
- Scan Time
- Scanner
- Status

### Attendance Rules

Peserta yang tidak memiliki status REGISTERED tidak dapat melakukan check-in.

Attendance tidak boleh dilakukan setelah event selesai.
