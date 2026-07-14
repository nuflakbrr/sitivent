import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      roleId: {
        type: 'string',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { name?: string | null; email: string };
      url: string;
    }) => {
      const { queueEmail } = await import('@/services/emails');
      const body = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DACC; border-radius: 12px; background-color: #FAF9F5;">
          <h2 style="color: #D97757; font-family: serif;">Reset Password SITIVENT</h2>
          <p>Halo ${user.name || user.email},</p>
          <p>Kami menerima permintaan untuk menyetel ulang kata sandi Anda. Klik tombol di bawah ini untuk melanjutkan:</p>
          <p style="margin: 24px 0;">
            <a href="${url}" style="background-color: #D97757; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password Saya</a>
          </p>
          <p style="color: #87867F; font-size: 12px;">Jika Anda tidak meminta reset password, Anda dapat mengabaikan email ini secara aman.</p>
        </div>
      `;
      await queueEmail(user.email, 'Reset Password Anda - SITIVENT', body);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { name?: string | null; email: string };
      url: string;
    }) => {
      const { queueEmail } = await import('@/services/emails');
      const visibleUrl = url.length > 60 ? url.substring(0, 60) + '...' : url;
      const body = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DACC; border-radius: 12px; background-color: #FAF9F5;">
          <h2 style="color: #D97757; font-family: serif;">Verifikasi Akun SITIVENT</h2>
          <p>Halo ${user.name || user.email},</p>
          <p>Terima kasih telah mendaftar di SITIVENT. Klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
          <p style="margin: 24px 0;">
            <a href="${url}" style="background-color: #D97757; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verifikasi Akun Saya</a>
          </p>
          <p style="color: #87867F; font-size: 12px; word-break: break-all;">Jika tombol tidak bekerja, salin tautan berikut ke browser Anda:<br/><a href="${url}" style="color: #D97757;">${visibleUrl}</a></p>
        </div>
      `;
      await queueEmail(user.email, 'Verifikasi Akun Anda - SITIVENT', body);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24, // 1 Day
    freshAge: 0, // Disable auto-renewal for strict testing
    updateAge: 0, // Force update check on every request
  },
  plugins: [admin()],
  databaseHooks: {
    user: {
      update: {
        after: async (user) => {
          if (user.emailVerified) {
            const { prisma: localPrisma } = await import('./prisma');
            const subject = 'Akun Anda Berhasil Diverifikasi! - SITIVENT';
            const alreadySent = await localPrisma.emailQueue.findFirst({
              where: {
                to: user.email,
                subject,
              },
            });
            if (!alreadySent) {
              const { queueEmail } = await import('@/services/emails');
              const body = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DACC; border-radius: 12px; background-color: #FAF9F5;">
                  <h2 style="color: #D97757; font-family: serif;">Akun Berhasil Diverifikasi!</h2>
                  <p>Halo ${user.name || user.email},</p>
                  <p>Selamat! Alamat email Anda telah berhasil diverifikasi. Sekarang Anda memiliki akses penuh ke seluruh fitur di SITIVENT.</p>
                  <p>Terima kasih telah memverifikasi akun Anda!</p>
                </div>
              `;
              await queueEmail(user.email, subject, body);
            }
          }
        },
      },
    },
  },
});
