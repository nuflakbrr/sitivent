# Test Case: Create Event Speaker Assignment (TC059)

## Skenario Pengujian
Memastikan Admin dapat menyematkan beberapa narasumber/pembicara pada pembuatan event.

## Prasyarat
- Admin ter-login di `/admin/master/events/create`.

## Kondisi
- **Input**: Pembicara `Dr. Tech` (Jabatan: `AI Expert`)
- **Output yang Diharapkan**:
  - Pembicara terhubung dengan event di database.

## Langkah-Langkah Pengujian
1. Isi formulir event dan tambahkan data pembicara.
2. Simpan event.
3. Verifikasi pembicara tampil pada detail event.
