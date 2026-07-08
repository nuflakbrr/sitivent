# Service Layer & Query Conventions - SITIVENT

Semua business logic berada pada:

```text
src/services
```

Service bertanggung jawab terhadap:

- Authorization
- Validation
- Database Query
- Business Logic
- Transaction

Service TIDAK BOLEH:

- Render UI
- Mengakses DOM
- Menggunakan React Hook

## Server Action Rules

Seluruh operasi database dilakukan pada:

```text
src/services
```

Server Action bertanggung jawab terhadap:

- validation
- authorization
- transaction
- business logic

Component hanya memanggil service.

## Dashboard Convention

Dashboard Admin menampilkan:

- Total Event
- Event Published
- Event Closed
- Total Registration
- Total Participant
- Total Revenue
- Total Check In
- Total Certificate
- Popular Event

Dashboard Peserta menampilkan:

- Upcoming Event
- Riwayat Event
- QR Code
- Certificate
- Payment Status

### Dashboard Query

Gunakan:

```ts
prisma.$transaction()
```

untuk seluruh card statistik.

Jangan menjalankan query satu per satu.

## React Query Convention

Seluruh data fetching menggunakan: TanStack Query.

Contoh Query Key:

```ts
["events"]
["registrations"]
["payments"]
["participants"]
["dashboard"]
```

Mutasi wajib: `invalidateQueries()` setelah berhasil.

## Error Handling

Server Action wajib mengembalikan object.

Contoh:

```ts
{
    success: true,
    message: "Event berhasil dibuat.",
    data
}
```

atau

```ts
{
    success: false,
    message: "Kuota sudah penuh."
}
```

Jangan melempar Error mentah ke UI.

## Logging

Error server harus dicatat.

Minimal:

- waktu
- endpoint
- user
- action
- error

Jangan menampilkan stacktrace ke user.
