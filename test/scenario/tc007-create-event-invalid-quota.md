# Test Case: Create Event Fails due to Negative Quota (TC007)

## Skenario Pengujian
Memastikan sistem memvalidasi input kuota event dan menolak pembuatan event jika kuota bernilai negatif.

## Prasyarat
- Admin telah masuk dan berada di halaman form pembuatan event `/admin/events/new`.

## Kondisi
- **Input**:
  - Judul Event: `Seminar AI Gagal`
  - Slug: `seminar-ai-gagal`
  - Kuota: `-10` (Negatif)
- **Output yang Diharapkan**:
  - Event gagal dibuat.
  - Halaman tetap di `/admin/events/new`.
  - Pesan error validasi (seperti: "Kuota tidak boleh negatif") ditampilkan di bawah input kuota atau di toast notification.

## Langkah-Langkah Pengujian
1. Masuk ke halaman form `/admin/events/new`.
2. Isi field judul, slug, dan isi kuota dengan nilai `-10`.
3. Klik tombol "Simpan Event".
4. Verifikasi URL tetap berada di `/admin/events/new`.
5. Verifikasi munculnya pesan error validasi input kuota.
