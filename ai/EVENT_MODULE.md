# Event Module - SITIVENT

Event terdiri dari:

- title
- slug
- description
- banner
- startDate
- endDate
- startTime
- endTime
- location
- eventType
- registrationDeadline
- quota
- price
- status
- certificateEnabled
- publishedAt

## Event Type

```text
ONLINE

OFFLINE
```

## Event Status

```text
DRAFT

PUBLISHED

CLOSED

COMPLETED
```

## Event Rules

AI harus memastikan:

- Kuota tidak boleh negatif.
- Deadline tidak boleh melewati tanggal event.
- Event selesai tidak boleh diedit kecuali admin tertentu.
- Event Draft tidak tampil ke publik.
- Event Closed tidak menerima peserta baru.
