import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { EmailStatus } from '@/generated/prisma/enums';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || user.includes('username@ethereal.email') || pass === 'password') {
    console.warn('⚠️ SMTP credentials not found or placeholder used. Emails will be simulated.');
    return null;
  }

  /**
   * Resend
   */
  // return nodemailer.createTransport({
  //   host,
  //   port,
  //   secure: port === 465,
  //   auth: {
  //     user,
  //     pass,
  //   },
  // });

  /**
   * Google App Password (2FA needed)
   */
  return nodemailer.createTransport({
    service: 'gmail',
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export async function queueEmail(to: string, subject: string, body: string, attachments?: string) {
  try {
    const queueItem = await prisma.emailQueue.create({
      data: {
        to,
        subject,
        body,
        attachments,
        status: EmailStatus.PENDING,
      },
    });

    void processEmailQueue();

    return { success: true, data: queueItem };
  } catch (error) {
    console.error('Queue Email Error:', error);
    return { success: false, error: 'Gagal mengantrekan email.' };
  }
}

let isProcessing = false;

export async function processEmailQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const transporter = getTransporter();

    const pendingEmails = await prisma.emailQueue.findMany({
      where: {
        status: {
          in: [EmailStatus.PENDING, EmailStatus.FAILED],
        },
        attempts: {
          lt: 3,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 10,
    });

    for (const email of pendingEmails) {
      await prisma.emailQueue.update({
        where: { id: email.id },
        data: {
          status: EmailStatus.PROCESSING,
          attempts: { increment: 1 },
        },
      });

      try {
        if (!transporter) {
          console.log(
            `\n========================================\n[SIMULATED EMAIL]\nTo: ${email.to}\nSubject: ${email.subject}\nBody: ${email.body}\n========================================\n`
          );
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: {
              status: EmailStatus.SENT,
            },
          });
          continue;
        }

        let parsedAttachments = [];
        if (email.attachments) {
          try {
            parsedAttachments = JSON.parse(email.attachments);
          } catch {
            // ignore
          }
        }

        const senderEmail =
          process.env.SMTP_FROM ||
          (process.env.SMTP_USER && process.env.SMTP_USER.includes('@')
            ? process.env.SMTP_USER
            : 'onboarding@resend.dev');

        await transporter.sendMail({
          from: `"SITIVENT" <${senderEmail}>`,
          to: email.to,
          subject: email.subject,
          html: email.body,
          attachments: parsedAttachments,
        });

        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            status: EmailStatus.SENT,
          },
        });
      } catch (err: any) {
        console.error(`Failed to send email ID ${email.id}:`, err);
        const finalStatus = email.attempts >= 2 ? EmailStatus.FAILED : EmailStatus.PENDING;
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            status: finalStatus,
            error: err?.message || String(err),
          },
        });
      }
    }
  } catch (error) {
    console.error('Process Email Queue Error:', error);
  } finally {
    isProcessing = false;
    try {
      const hasMore = await prisma.emailQueue.findFirst({
        where: {
          status: { in: [EmailStatus.PENDING, EmailStatus.FAILED] },
          attempts: { lt: 3 },
        },
      });
      if (hasMore) {
        void processEmailQueue();
      }
    } catch (err) {
      console.error('Check remaining emails error:', err);
    }
  }
}
