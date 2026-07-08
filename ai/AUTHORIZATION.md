# Authentication & Authorization - SITIVENT

Project menggunakan Better Auth.

Semua autentikasi harus menggunakan Better Auth.

Jangan membuat authentication baru.

## Session

Selalu gunakan session Better Auth.

Jangan menggunakan JWT custom.

## Permission

Menggunakan Permission Based Access Control (PBAC).

Setiap endpoint wajib melakukan pengecekan permission.

Contoh:

```text
events.read

events.create

events.update

events.delete

events.publish

registrations.read

payments.verify
```

## Route Protection

Route admin harus dilindungi.

Gunakan:

```text
src/proxy.ts
```

Jangan menggunakan middleware lama.

## Authorization Rules

Seluruh Server Action wajib memvalidasi permission.

Contoh:

```ts
await verifyPermission("events.create");
```

Jangan hanya melakukan pengecekan di client.

Client hanya untuk UX.

Server adalah sumber validasi utama.
