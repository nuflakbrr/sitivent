# File Upload & Media Rules - SITIVENT

Seluruh upload dilakukan melalui endpoint upload.

Jenis file:

### Banner

- jpg
- png
- webp

### Certificate Template

- pdf

### Attachment

- pdf
- docx
- pptx
- zip

### Avatar

- jpg
- png
- webp

Semua gambar wajib dikompresi menggunakan Sharp.

## Media Rules

Lokasi upload:

```text
public/uploads
```

Semua file harus memiliki nama unik.

Gunakan:

- UUID
- Timestamp

Hindari nama asli file sebagai filename.
