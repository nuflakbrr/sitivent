# Dokumentasi Fitur: Pengguna, Jabatan, & Hak Akses (RBAC/PBAC) - SITIVENT

Fitur ini mengelola hak akses seluruh administrator operasional SITIVENT melalui sistem Permission-Based Access Control (PBAC) yang terintegrasi erat dengan autentikasi.

---

## 1. Skema Database (PBAC Core)

Di dalam `prisma/schema.prisma`, sistem otorisasi dikelola oleh model-model berikut:
* **User**: Pengguna terdaftar dengan `roleId` opsional.
* **Role**: Jabatan (contoh: *Superadmin*, *Admin*, *Organizer*, *Participant*).
* **Permission**: Hak akses detail (contoh: `events.create`, `payments.verify`).
* **RoleHasPermission**: Tabel pivot relasi many-to-many untuk mendaftarkan hak akses apa saja yang dimiliki suatu jabatan.

---

## 2. Aturan Estetika Badge (Warna Representatif)

Status jabatan dan permission diberi kode warna badge untuk visualisasi yang rapi di panel administrasi:
* **Jabatan (Role)**:
  * `superadmin`: Warna merah (`bg-rose-500/10 text-rose-600 border-rose-200`).
  * `admin`: Warna biru (`bg-blue-500/10 text-blue-600 border-blue-200`).
  * `organizer`: Warna ungu (`bg-purple-500/10 text-purple-600 border-purple-200`).
  * `participant`: Warna hijau (`bg-emerald-500/10 text-emerald-600 border-emerald-200`).
* **Hak Akses (Permission Action)**:
  * `read`: Biru
  * `create`: Hijau
  * `update`: Orange / Amber
  * `delete`: Red / Rose
  * `verify` / `publish`: Purple

---

## 3. Aturan Keamanan & UI Guards (Sangat Krusial)

Sistem ini memiliki proteksi keamanan bertingkat yang wajib ditaati oleh kode client-side dan server-side:

### A. Proteksi Penghapusan Diri Sendiri (Self-Deletion Guard)
* Pengguna yang sedang masuk (logged-in user) **DILARANG KERAS** menghapus akunnya sendiri.
* Pengecekan dilakukan di UI (tombol Delete disembunyikan/dinonaktifkan jika `currentUser.id === targetUser.id`) dan divalidasi ulang di Server Action.

### B. Proteksi Jabatan Superadmin (Superadmin Protection)
* Role `superadmin` adalah hierarki tertinggi di sistem.
* Hanya pengguna dengan role `superadmin` yang diperbolehkan menghapus atau mengedit pengguna ber-role `superadmin` lainnya.
* Pengguna non-superadmin **DILARANG** memodifikasi pengguna dengan role `superadmin`. All checks use `.toLowerCase() === 'superadmin'`.

### C. Proteksi Eskalasi Jabatan (Role Escalation Guard)
* Pengguna non-superadmin **DILARANG** memberikan atau mengubah jabatan pengguna lain menjadi `superadmin` (mencegah eskalasi hak istimewa).
* Dropdown pilihan jabatan wajib me-disable opsi "Superadmin" secara dinamis jika pengguna yang mengedit bukan seorang `superadmin`.
