# TypeScript Rules - SITIVENT

## Anti Any

Dilarang:

```ts
const data: any
```

Gunakan:

```ts
const data: Event
```

atau

```ts
const data: EventWithRegistration
```

## Interface First

Semua object kompleks harus memiliki interface.

Lokasi:

```text
src/interfaces/features/
```

## Strict Type Safety

AI wajib:

- Menghindari any
- Menghindari unknown tanpa validasi
- Menggunakan Zod
- Menggunakan TypeScript strict mode
