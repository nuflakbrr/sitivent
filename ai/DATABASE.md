# Database & Prisma Convention - SITIVENT

Semua perubahan database wajib mengikuti standar berikut.

---

# Primary Key

Gunakan:

```prisma
id String @id @default(cuid())
```

Gunakan UUID hanya apabila memang dibutuhkan.

---

# Audit Columns

Semua tabel bisnis wajib memiliki:

```prisma
createdAt DateTime @default(now())

updatedAt DateTime @updatedAt
```

Jika diperlukan audit lebih lengkap:

```prisma
createdBy String?

updatedBy String?
```

---

# Soft Delete

Gunakan soft delete hanya jika memang dibutuhkan.

```prisma
deletedAt DateTime?
```

Jangan membuat field:

```text
isDeleted
```

---

# Enum

Gunakan Prisma Enum.

Contoh:

```prisma
enum EventStatus {
  DRAFT
  PUBLISHED
  CLOSED
  COMPLETED
}
```

---

# Relationship

Gunakan Prisma Relation.

Contoh:

- Event
- Registration
- Payment
- Certificate
- User

Gunakan referential action yang sesuai kebutuhan bisnis:

- Restrict
- Cascade
- SetNull
- NoAction

---

# Schema Rules

Seluruh perubahan struktur database wajib dilakukan melalui:

```text
prisma/schema.prisma
```

AI wajib:

- Menambahkan model pada `schema.prisma`
- Menggunakan Prisma Relation
- Menggunakan Prisma Enum apabila diperlukan
- Menjaga backward compatibility apabila memungkinkan
- Tidak membuat tabel menggunakan SQL manual
- Tidak mengubah migration lama yang sudah pernah dijalankan

---

# Migration Rules

Setelah mengubah `schema.prisma`, AI wajib membuat migration baru.

Gunakan:

```bash
pnpx prisma migrate dev --name "<migration_name>"
```

## Pembuatan tabel

Gunakan format:

```text
create_[feature]_tables
```

Contoh:

```bash
pnpx prisma migrate dev --name "create_events_tables"

pnpx prisma migrate dev --name "create_registration_tables"

pnpx prisma migrate dev --name "create_payment_tables"

pnpx prisma migrate dev --name "create_certificate_tables"
```

## Penambahan kolom

Gunakan format:

```text
add_[column]_to_[table]
```

Contoh:

```bash
pnpx prisma migrate dev --name "add_slug_to_events"

pnpx prisma migrate dev --name "add_capacity_to_events"
```

## Perubahan kolom

Gunakan format:

```text
update_[table]_[column]
```

Contoh:

```bash
pnpx prisma migrate dev --name "update_events_price"

pnpx prisma migrate dev --name "update_users_email"
```

## Penghapusan kolom

Gunakan format:

```text
remove_[column]_from_[table]
```

Contoh:

```bash
pnpx prisma migrate dev --name "remove_banner_from_events"
```

## Penambahan relasi

Gunakan format:

```text
add_[relation]_relation
```

Contoh:

```bash
pnpx prisma migrate dev --name "add_event_category_relation"
```

## Perubahan Enum

Gunakan format:

```text
update_[enum]_enum
```

Contoh:

```bash
pnpx prisma migrate dev --name "update_event_status_enum"
```

Jangan menggunakan nama migration seperti:

```text
migration

update

fix

new

test
```

---

# Prisma Client

Setelah migration berhasil dibuat, AI wajib melakukan generate Prisma Client.

Gunakan:

```bash
pnpx prisma generate
```

---

# Seed Rules

Data awal project harus berada pada:

```text
prisma/seed.ts
```

AI wajib:

- Menggunakan file `seed.ts` yang sudah tersedia.
- Tidak membuat file seed baru tanpa diminta.
- Memperbarui `seed.ts` apabila terdapat master data baru.

Jangan membuat file seperti:

```text
seed-dev.ts

seed-local.ts

seed-new.ts
```

---

# Seed Convention

Seed hanya digunakan untuk data awal (initial data).

Contohnya:

- Permission
- Role
- Default Admin
- Event Category
- Configuration
- Lookup Table
- Master Data

Seed **tidak digunakan** untuk:

- Dummy Event
- Dummy User
- Dummy Registration
- Dummy Payment

kecuali memang diminta.

---

# Seed Idempotent

Seluruh proses seed harus bersifat idempotent.

Gunakan:

```ts
upsert()
```

atau lakukan pengecekan data terlebih dahulu.

Hindari:

```ts
create()
```

yang menyebabkan data duplikat apabila seed dijalankan lebih dari satu kali.

---

# Prisma Query Rules

Seluruh query database menggunakan Prisma.

Gunakan:

```ts
select
```

sebisa mungkin.

Hindari:

```ts
include: true
```

apabila hanya membutuhkan sebagian field.

---

## Pagination

Gunakan:

```ts
skip

take
```

---

## Search

Gunakan:

```ts
contains

mode: "insensitive"
```

---

## Dashboard Query

Gunakan:

```ts
prisma.$transaction()
```

agar seluruh query statistik dieksekusi secara bersamaan.

---

# Database Update Checklist

Apabila AI melakukan perubahan database, AI wajib memastikan seluruh langkah berikut telah dilakukan:

- Update `prisma/schema.prisma`
- Membuat migration baru
- Menjalankan:

```bash
pnpx prisma migrate dev --name "<migration_name>"
```

- Menjalankan:

```bash
pnpx prisma generate
```

- Memperbarui `prisma/seed.ts` apabila terdapat master data baru
- Memperbarui Prisma Enum apabila diperlukan
- Memperbarui relasi apabila diperlukan
- Memastikan seluruh query tetap type-safe
- Memastikan migration dapat dijalankan tanpa error

---

# AI Rules

AI wajib:

- Menggunakan Prisma ORM untuk seluruh operasi database.
- Tidak menggunakan raw SQL kecuali benar-benar diperlukan.
- Tidak mengubah migration lama yang sudah pernah dijalankan.
- Menghasilkan migration yang kecil, jelas, dan mudah ditelusuri.
- Menggunakan nama migration yang deskriptif.
- Menjaga backward compatibility apabila memungkinkan.
- Menghasilkan perubahan database yang production-ready.