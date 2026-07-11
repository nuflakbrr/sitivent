# Coding Standards & Guidelines - SITIVENT

## Development Rules

AI harus:

- Menggunakan kode yang konsisten dengan codebase.
- Tidak membuat abstraksi berlebihan.
- Tidak membuat library baru apabila sudah tersedia.
- Tidak membuat utility baru apabila sudah ada utility yang setara.
- Tidak membuat komponen baru apabila komponen yang sama sudah tersedia.
- Tidak melakukan refactor besar tanpa diminta.
- Meminimalkan perubahan file.
- Menghindari breaking changes.
- Menjaga backward compatibility.

## Naming Convention

### Database Table

Gunakan:

```text
snake_case
```

Contoh:

```text
event_registrations
event_certificates
payment_transactions
```

### Prisma Model

Gunakan:

```text
PascalCase
```

Contoh:

```ts
User
Role
Permission
Event
Registration
Payment
Certificate
```

### Component

Gunakan:

```text
PascalCase
```

Contoh:

```tsx
EventForm
RegistrationTable
PaymentCard
```

### Variables

Gunakan:

```ts
camelCase
```

Contoh:

```ts
eventId
registrationStatus
certificateEnabled
```

### Constants

Gunakan:

```ts
UPPER_SNAKE_CASE
```

Contoh:

```ts
MAX_UPLOAD_SIZE
DEFAULT_PAGE_SIZE
```

## Import Rules

Gunakan alias.

Benar:

```ts
import { prisma } from "@/lib/prisma";
```

Salah:

```ts
import { prisma } from "../../../../lib/prisma";
```

Alias yang diperbolehkan:

```text
@/components
@/hooks
@/interfaces
@/lib
@/providers
@/schemas
@/services
@/types
```

## React Rules

Gunakan:

- Functional Component
- Hooks
- Server Component terlebih dahulu

Prioritas:

1. Server Component
2. Client Component bila diperlukan

Jangan menambahkan:

```tsx
"use client";
```

tanpa alasan yang jelas.

## Form Rules

Semua form wajib menggunakan:

- React Hook Form
- Zod

Contoh:

```ts
const form = useForm({
  resolver: zodResolver(eventSchema)
});
```

Dilarang melakukan validasi manual apabila dapat dilakukan oleh Zod.

## Validation Rules

Seluruh input wajib divalidasi.

Meliputi:

- Form
- Query Parameter
- Route Parameter
- Server Action
- Upload File

Tidak ada input yang boleh langsung masuk ke database.

## Coding Style

Gunakan Early Return.

Benar:

```ts
if (!event) {
    return ...
}
```

Hindari nested if yang terlalu dalam.

Gunakan helper apabila logic mulai panjang.

Business logic tidak boleh berada di component.

## Accessibility

Semua form harus memiliki:

Label.

Semua tombol harus memiliki:

aria-label

apabila hanya berupa icon.

Pastikan seluruh dialog memiliki:

- title
- description

## Environment Variables

Seluruh environment variable diakses melalui:

```text
process.env
```

Jangan melakukan hardcode.

Contoh:

- DATABASE_URL
- BETTER_AUTH_SECRET
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- APP_URL
