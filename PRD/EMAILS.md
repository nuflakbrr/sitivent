# Email Architecture - SITIVENT

Seluruh email dikirim menggunakan queue.

Jangan mengirim email secara synchronous pada request utama.

Jenis email:

- Welcome Email
- Email Verification
- Registration Success
- Payment Success
- QR Code Delivery
- Event Reminder
- Certificate Ready
- Password Reset

## Email Rules

Gunakan template yang konsisten.

QR Code dikirim sebagai attachment atau embedded image.

Certificate dikirim sebagai attachment PDF.
