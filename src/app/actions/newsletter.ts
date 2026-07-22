'use server';

import { prisma } from '@/lib/prisma';
import { queueEmail } from '@/services/emails';

export async function subscribeNewsletter(email: string) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Silakan masukkan alamat email yang valid.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Store subscriber in database
    await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      create: { email: cleanEmail },
      update: {},
    });

    const subject = 'Selamat Datang di Newsletter SITIVENT! 🎉';
    const body = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #141413; background-color: #FAF9F5; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #E3DACC;">
        <div style="margin-bottom: 20px;">
          <span style="background-color: #D97757; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 14px;">SITIVENT</span>
        </div>
        <h2 style="color: #141413; margin-top: 10px;">Terima Kasih Telah Berlangganan!</h2>
        <p style="color: #3D3D3A; font-size: 14px; line-height: 1.6;">
          Halo, email Anda (<strong>${cleanEmail}</strong>) telah sukses terdaftar di sistem notifikasi newsletter SITIVENT.
        </p>
        <p style="color: #3D3D3A; font-size: 14px; line-height: 1.6;">
          Anda akan menjadi yang pertama mendapatkan info seputar event seminar, workshop, webinar, dan promo eksklusif terbaru dari kami.
        </p>
        <hr style="border: none; border-top: 1px solid #E3DACC; margin: 24px 0;" />
        <p style="font-size: 12px; color: #87867F; text-align: center;">
          &copy; ${new Date().getFullYear()} SITIVENT — Platform Manajemen Event & Tiket
        </p>
      </div>
    `;

    const res = await queueEmail(cleanEmail, subject, body);
    if (!res.success) {
      return { success: false, message: res.error || 'Gagal mendaftar newsletter.' };
    }

    return { success: true, message: 'Berhasil berlangganan! Cek email Anda untuk konfirmasi.' };
  } catch (error) {
    console.error('Subscribe Newsletter Error:', error);
    return { success: false, message: 'Terjadi kesalahan sistem saat mendaftar newsletter.' };
  }
}

export async function sendNewEventNewsletter(event: {
  title: string;
  slug: string;
  startDate: Date;
  location: string;
  eventType: string;
}) {
  try {
    const [subscribers, users] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ select: { email: true } }),
      prisma.user.findMany({ where: { banned: false }, select: { email: true } }),
    ]);

    const emailSet = new Set<string>();
    subscribers.forEach((s) => emailSet.add(s.email));
    users.forEach((u) => emailSet.add(u.email));

    const recipientEmails = Array.from(emailSet);
    if (recipientEmails.length === 0) return;

    const dateStr = new Date(event.startDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const recipientEmail of recipientEmails) {
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E3DACC; border-radius: 16px; background-color: #FAF9F5;">
          <div style="margin-bottom: 16px;">
            <span style="background-color: #D97757; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 14px;">EVENT BARU</span>
          </div>
          <h2 style="color: #D97757; margin-top: 8px;">Event Baru Tersedia di SITIVENT! 🎉</h2>
          <p style="color: #3D3D3A; font-size: 14px; line-height: 1.6;">Ada event menarik yang baru saja dipublikasikan. Segera daftarkan diri Anda sebelum kuota habis!</p>
          
          <div style="background-color: #ffffff; border: 1px solid #E3DACC; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #141413;">${event.title}</h3>
            <p style="margin: 8px 0; font-size: 14px; color: #3D3D3A;"><strong>Tanggal:</strong> ${dateStr}</p>
            <p style="margin: 8px 0; font-size: 14px; color: #3D3D3A;"><strong>Lokasi:</strong> ${event.location}</p>
            <p style="margin: 8px 0; font-size: 14px; color: #3D3D3A;"><strong>Tipe Event:</strong> ${event.eventType}</p>
          </div>
          
          <p style="margin: 24px 0; text-align: center;">
            <a href="${appUrl}/events/${event.slug}" style="background-color: #D97757; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Lihat Detail & Daftar Sekarang</a>
          </p>
          <hr style="border: none; border-top: 1px solid #E3DACC; margin: 24px 0;" />
          <p style="font-size: 12px; color: #87867F; text-align: center;">
            Anda menerima email ini karena terdaftar pada newsletter SITIVENT.
          </p>
        </div>
      `;

      await queueEmail(recipientEmail, `Event Baru: ${event.title}`, body);
    }
  } catch (error) {
    console.error('Send New Event Newsletter Error:', error);
  }
}
