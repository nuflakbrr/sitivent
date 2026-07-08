# Dokumentasi Fitur: Autentikasi & Otorisasi (PBAC) - SITIVENT

Fitur ini mengatur mekanisme masuk (login), pendaftaran, keamanan rute panel admin, serta pembatasan akses fitur berdasarkan hak akses (Permission-Based Access Control) baik di sisi client maupun server.

---

## 1. Arsitektur Autentikasi

Otentikasi di dalam aplikasi menggunakan **Better Auth** yang menyimpan data sesi pengguna di dalam tabel database PostgreSQL:
* **Prisma Models**: `User`, `Session`, `Account`, dan `Verification`.
* **Client Instance**: `authClient` digunakan di sisi klien untuk memanggil fungsi otentikasi (seperti `signIn.email()`, `signOut()`).
* **Session Validation**: Pengecekan status login memvalidasi properti `session.expiresAt` secara manual terhadap waktu server/lokal saat ini untuk memastikan sesi yang sudah kedaluwarsa tidak dianggap aktif.
* **Pembatasan Registrasi**: Registrasi mandiri hanya tersedia untuk peserta publik (role `user`/`participant`). Pendaftaran akun dengan level administratif hanya dapat dilakukan oleh Super Admin melalui panel manajemen pengguna.

---

## 2. Mekanisme Proteksi Rute (Next.js 16 Proxy)

Proteksi rute diimplementasikan di [src/proxy.ts](../../src/proxy.ts):
1. **Pemicu Rute**: Setiap request ke `/admin/:path*`, `/participant/:path*`, dan `/login` akan diproses oleh proxy.
2. **Pengambilan Sesi**: Mengambil sesi secara server-side melalui fetch internal `/api/auth/get-session` dengan meneruskan cookie pengguna.
3. **Pengecekan Masa Berlaku**: `new Date(session.expiresAt) > new Date()` memverifikasi sesi masih aktif.
4. **Validasi Hak Akses Admin & Peserta**:
   * Jika sesi aktif dan mengakses halaman `/admin/*`, proxy memanggil `/api/auth/permissions` untuk memeriksa hak akses administratif.
   * Jika pengguna tidak memiliki role admin/superadmin, pengguna dialihkan ke dashboard peserta (`/participant/dashboard`) atau halaman depan.
5. **Redireksi Otomatis**:
   * Pengguna tanpa sesi aktif yang mengakses `/admin/*` atau `/participant/*` dialihkan ke `/login`.
   * Pengguna dengan sesi aktif yang mengakses `/login` dialihkan ke dashboard yang sesuai (admin ke `/admin/dashboard`, peserta ke `/participant/dashboard`).

---

## 3. Sistem Otorisasi Client-Side (UI Guards)

Untuk membatasi elemen visual seperti tombol tambah, edit, atau hapus:
* **PermissionProvider**: Data hak akses (`permissions`) dan jabatan (`roles`) di-fetch di server (`src/app/(cms)/layout.tsx`) dan diteruskan sebagai initial state ke `PermissionProvider` agar tidak terjadi screen flickering.
* **usePermission Hook**: Komponen di sisi client menggunakan hook `usePermission()` untuk mengecek hak akses secara real-time:
   * `hasPermission('events.create')` -> mengecek kecocokan hak akses spesifik.
   * `hasRole('superadmin')` -> mengecek apakah pengguna memiliki jabatan superadmin (case-insensitive).

---

## 4. Sistem Otorisasi Server-Side (Action Security)

Setiap operasi mutasi (tambah, ubah, hapus) di file `src/services/` wajib diproteksi di tingkat paling atas:
```typescript
import { verifyPermission } from "@/services/security";

export async function createEvent(data: EventInput) {
  // Otorisasi di tingkat server
  await verifyPermission("events.create");
  
  // Logika bisnis...
}
```
Jika pengguna tidak memiliki permission tersebut, fungsi `verifyPermission` akan melemparkan exception error keamanan, mencegah eksekusi queries Prisma.
