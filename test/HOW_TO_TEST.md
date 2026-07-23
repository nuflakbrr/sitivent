# Panduan Eksekusi Automated Testing SITIVENT

Dokumen ini berisi instruksi lengkap untuk menyiapkan lingkungan pengujian dan menjalankan pengujian otomatis (_automated testing_) pada proyek SITIVENT menggunakan **Playwright** dan **TypeScript**.

---

## 1. Prasyarat Sistem

Sebelum menjalankan pengujian, pastikan perangkat Anda telah memenuhi prasyarat berikut:

- **Node.js**: Versi `>= 18.0.0`
- **Package Manager**: `pnpm` (direkomendasikan) atau `npm`
- **Database**: PostgreSQL aktif dengan kredensial yang sesuai di berkas `.env`
- **Browser Binary**: Playwright Browsers (Chromium, Firefox, Webkit)

---

## 2. Persiapan Lingkungan Pengujian

### Langkah 1: Install Dependensi Proyek

```bash
pnpm install
```

### Langkah 2: Install Browser Playwright (Jika Belum)

```bash
npx playwright install --with-deps
```

### Langkah 3: Setup & Seed Database

Pastikan database dalam keadaan siap dan terisi data awal (seed):

```bash
npx prisma db push
npx prisma db seed
```

### Langkah 4: Jalankan Server Lokal SITIVENT

Pengujian Playwright membutuhkan aplikasi berjalan di port lokal (default `http://localhost:3000`):

```bash
pnpm dev
```

---

## 3. Perintah Menjalankan Pengujian

### A. Menjalankan Seluruh Suite Pengujian (TC001 - TC100)

```bash
pnpm test
```

atau

```bash
npx playwright test
```

### B. Menjalankan Test Case Spesifik

Untuk menjalankan satu berkas pengujian tertentu:

```bash
npx playwright test test/test-case/tc004-register-participant-success.spec.ts
```

### C. Menjalankan dengan Mode Tampilan Browser (Headed Mode)

```bash
npx playwright test --headed
```

### D. Menjalankan dengan UI Interaktif Playwright

```bash
npx playwright test --ui
```

### E. Verifikasi Tipe Data dan Kepatuhan Kode TypeScript

Untuk memastikan tidak ada kesalahan sintaks/tipe pada seluruh berkas test-case:

```bash
npx tsc --noEmit
```

---

## 4. Struktur Direktori Pengujian

```
test/
├── HOW_TO_TEST.md          # Dokumen panduan eksekusi pengujian ini
├── RESULT_TEST.md          # Dokumen laporan & rangkuman kesesuaian test-case
├── index.spec.ts           # Entrypoint penggabungan seluruh test spec
├── scenario/               # Skenario pengujian kontekstual (Markdown)
│   ├── tc001-login-success.md
│   ├── tc004-register-participant-success.md
│   └── ... (TC001 s.d. TC100)
└── test-case/              # Kode otomatisasi pengujian Playwright (TypeScript)
    ├── tc001-login-success.spec.ts
    ├── tc004-register-participant-success.spec.ts
    └── ... (TC001 s.d. TC100)
```

---

## 5. Pelaporan & Hasil Pengujian

Setelah pengujian selesai, Playwright akan menghasilkan laporan eksekusi:

- **Laporan Konsol**: Menampilkan status PASS / FAIL per test-case.
- **HTML Report**: Jalankan `npx playwright show-report` untuk membuka laporan visual.
- **Rangkuman Kesesuaian**: Lihat dokumen `test/RESULT_TEST.md` untuk tabel pemetaan lengkap kesesuaian antara skenario dan test-case.

---

## 6. Pembagian Eksekusi Sub-Agent untuk Full Automated Testing & TDD

Untuk mendukung **TDD (Test-Data-Driven / Test-Driven Development)** dan eksekusi parallel berkecepatan tinggi, suite pengujian 100 test-case dapat dipecah ke beberapa **Sub-Agent** independen.

### A. Alokasi Pembagian Sub-Agent (Batching)

| Agent ID    | Domain Pengujian                 | Rentang Test Case                                                                          | Perintah Eksekusi Sub-Agent                                                                                                     |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Agent-1** | Authentication & Security        | TC001–TC005, TC017–TC019, TC028–TC032, TC054–TC058, TC076, TC088, TC092                    | `npx playwright test test/test-case/tc00{1,2,3,4,5}* test/test-case/tc0{17,18,19,28,29,30,31,32,54,55,56,57,58,76,88,92}*`      |
| **Agent-2** | Events & Categories              | TC006–TC007, TC020, TC033–TC036, TC059–TC062, TC077, TC081, TC086, TC093                   | `npx playwright test test/test-case/tc00{6,7}* test/test-case/tc0{20,33,34,35,36,59,60,61,62,77,81,86,93}*`                     |
| **Agent-3** | Registrations & Payments         | TC008–TC012, TC021, TC037–TC041, TC063–TC065, TC078–TC079, TC083, TC087                    | `npx playwright test test/test-case/tc0{08,09,10,11,12,21,37,38,39,40,41,63,64,65,78,79,83,87}*`                                |
| **Agent-4** | Attendance & Certificates        | TC013–TC016, TC027, TC042–TC047, TC066–TC069, TC080, TC085, TC097                          | `npx playwright test test/test-case/tc0{13,14,15,16,27,42,43,44,45,46,47,66,67,68,69,80,85,97}*`                                |
| **Agent-5** | Content, Support, Audit & System | TC022–TC026, TC048–TC053, TC070–TC075, TC082, TC084, TC089–TC091, TC094–TC096, TC098–TC100 | `npx playwright test test/test-case/tc0{22,23,24,25,26,48,49,50,51,52,53,70,71,72,73,74,75,82,84,89,90,91,94,95,96,98,99,100}*` |

### B. Workflow Alur TDD (Test-Data-Driven) dengan Sub-Agent

1. **Phase 1 (Red)**: Sub-Agent menjalankan test-case sebelum fitur diubah/dibuat.
2. **Phase 2 (Green)**: Sub-Agent melakukan refactoring/pembaruan kode pada `src/` hingga test-case berhasil (**PASS**).
3. **Phase 3 (Refactor & Verify)**: Jalankan `npx tsc --noEmit` untuk memastikan kepatuhan tipe data 100%.

### C. Eksekusi Parallel Worker

Untuk menjalankan seluruh 100 test case dalam mode parallel otomatis:

```bash
npx playwright test --workers=4
```

### D. Protokol Auto-Fixing Saat Terjadi Kegagalan Test (FAIL)

Apabila ditemukan test-case yang **FAIL** atau tidak sesuai saat eksekusi automated testing, Agent / Sub-Agent **WAJIB melakukan perbaikan (fixing) seketika itu juga pada saat itu juga** tanpa menunda, menggunakan kombinasi metodologi & skillsets berikut:

1. **Skill Ponytail**: Melakukan analisis akar masalah (root-cause analysis) secara tajam, adaptif, dan presisi tinggi pada logika backend & UI.
2. **Skill Caveman**: Mengeksekusi kode perbaikan secara ultra-terfokus, efisien, langsung pada titik kegagalan tanpa filler/keterlambatan context.
3. **Skill Superpowers**: Menerapkan otomatisasi tingkat tinggi, penanganan *edge cases*, serta arsitektur kode yang tangguh dan tahan kegagalan (*resilient*).
4. **Skill UI-UX-Pro-Max**: Memperbaiki tampilan, respon interaktif, serta estetika visual komponen UI/UX secara profesional, modern, dan bebas cacat visual.

