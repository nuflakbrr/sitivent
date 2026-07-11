# Payment Module - SITIVENT

Status pembayaran:

```text
WAITING

PAID

FAILED

REFUNDED
```

## Payment Rules

Jika event gratis:

Status langsung:

```text
REGISTERED
```

Jika event berbayar:

Status awal:

```text
WAITING_PAYMENT
```

Setelah diverifikasi:

```text
REGISTERED
```

## Payment Verification

Verifikasi hanya dapat dilakukan oleh admin.

Seluruh perubahan pembayaran harus dicatat pada audit log.
