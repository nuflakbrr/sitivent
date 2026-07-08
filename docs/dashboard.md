# Dokumentasi Fitur: Dashboard Panel (CMS) - SITIVENT

Halaman Dashboard berfungsi sebagai pusat informasi utama bagi administrator (Admin/Superadmin) dan peserta (Participant) untuk memantau status aktivitas event, transaksi, dan data kehadiran.

---

## 1. Integrasi Data & Kueri (Dashboard Services)

Pemuatan data diatur secara efisien di sisi server melalui `src/services/dashboard.ts`:
* **Parallel Counts & Transactions**: Menghitung secara paralel total statistik menggunakan `prisma.$transaction()` agar seluruh kartu statistik dieksekusi bersamaan untuk menghindari latensi kueri satu per satu.
* **Admin Statistics**:
  * Total Event (Draft, Published, Closed, Completed)
  * Total Registrasi & Total Peserta Unik
  * Total Pendapatan Keuangan (Total Revenue dari transaksi berbayar sukses)
  * Total Check-In (Tingkat Kehadiran) & Sertifikat yang diterbitkan.
* **Participant Statistics**:
  * Upcoming Event (Event terdekat yang akan diikuti)
  * Riwayat Pendaftaran Event (Total Event yang pernah diikuti)
  * Status Pembayaran & Status Kehadiran (Check-In status).

---

## 2. Struktur Tampilan (UI Layout)

Tampilan dashboard dibagi berdasarkan role pengguna:

### A. Dashboard Admin
1. **Stats Grid Cards**: Kartu metrik utama (Total Event, Registrasi, Check-In, Omzet) yang dilengkapi dengan Lucide Icons dan tautan navigasi instan ke modul terkait.
2. **Popular Event Chart**: Diagram performa popularitas event berdasarkan jumlah pendaftar tertinggi (menggunakan Recharts).
3. **Recent Registration List**: Menampilkan daftar pendaftar terbaru beserta status pembayaran mereka.

### B. Dashboard Peserta
1. **Upcoming Event Widget**: Kartu informasi event terdekat yang menampilkan tanggal, waktu, peta lokasi, serta pintasan unduhan QR Code kehadiran.
2. **Riwayat Event Table**: Tabel data history event yang pernah didaftar lengkap dengan status kehadiran dan tombol unduh sertifikat (jika status check-in dan event selesai).
3. **Quick Profile Info**: Ringkasan data diri peserta dan detail status akun.
