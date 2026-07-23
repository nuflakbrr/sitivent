# Panduan Eksekusi Automated Testing SITIVENT

Dokumen ini berisi instruksi lengkap untuk menyiapkan lingkungan pengujian dan menjalankan pengujian otomatis (*automated testing*) pada proyek SITIVENT menggunakan **Playwright** dan **TypeScript**.

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
