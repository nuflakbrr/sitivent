# Architecture Principles - SITIVENT

Semua pengembangan wajib mengikuti prinsip:

- Clean Architecture
- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple Stupid)
- Separation of Concerns
- Modular Design
- Feature First Architecture

AI wajib mengutamakan maintainability dibanding kecepatan implementasi.

## Route Groups

Project menggunakan Route Groups.

```text
(auth)
(admin)
(participant)
(root)
```

Tujuan:

- Memisahkan layout.
- Memisahkan akses.
- Memisahkan authorization.
