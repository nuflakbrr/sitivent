# Dokumentasi Fitur: Manajemen Event - SITIVENT

Fitur ini memungkinkan penyelenggara (organizer/admin) untuk membuat, mengedit, memperbarui, dan mempublikasikan event.

---

## 1. Arsitektur Data Event

Data event dikelola di tabel database PostgreSQL via Prisma model `Event`:
* **Attributes**: `id`, `title`, `slug`, `description`, `banner`, `startDate`, `endDate`, `startTime`, `endTime`, `location`, `eventType` (ONLINE / OFFLINE), `registrationDeadline`, `quota`, `price`, `status` (DRAFT / PUBLISHED / CLOSED / COMPLETED), `certificateEnabled`, `publishedAt`.
* **Prinsip Validasi**:
  * Kuota event tidak boleh bernilai negatif.
  * `registrationDeadline` tidak boleh melewati tanggal mulainya event (`startDate`).

---

## 2. Alur Status Event (Event Status Transitions)

Status event mengikuti alur berikut:
1. **DRAFT**: Status awal pembuatan event. Event dalam status draft tidak akan ditampilkan pada halaman publik untuk umum.
2. **PUBLISHED**: Setelah admin mempublikasikannya. Event siap menerima pendaftaran peserta baru.
3. **CLOSED**: Ketika pendaftaran telah ditutup secara manual oleh admin, atau tanggal event sudah terlewati, atau kuota pendaftaran habis. Event dalam status closed tidak menerima pendaftar baru.
4. **COMPLETED**: Ketika event telah selesai dilaksanakan. Pada status ini, sertifikat event dapat mulai dibuat dan dibagikan kepada peserta yang hadir.

---

## 3. Aturan & Validasi Bisnis

* **Edit Restriction**: Event yang telah berstatus `COMPLETED` tidak boleh diedit atau diubah lagi kecuali oleh Super Admin atau admin dengan permission khusus.
* **Format Validasi**: Semua data event divalidasi menggunakan Zod Schema di `src/schemas/event.ts` sebelum disimpan ke database, termasuk pengecekan format UUID, tanggal mulai, dan rentang waktu.
