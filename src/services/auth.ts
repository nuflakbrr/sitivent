'use server';
import { z } from 'zod';
import { headers, cookies } from 'next/headers';

import { auth } from '@/lib/auth';
import type { AuthResponse, User } from '@/interfaces/features/auth';
import { prisma } from '@/lib/prisma';
import { loginSchema, registerSchema } from '@/schemas/auth';

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

/**
 * Mapping pesan error Better Auth ke Bahasa Indonesia
 */
const mapAuthError = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  switch (lowerMessage) {
    case 'invalid email or password':
      return 'Email atau password salah.';
    case 'user not found':
      return 'Pengguna tidak ditemukan.';
    case 'email not verified':
      return 'Email Anda belum diverifikasi.';
    case 'too many requests':
      return 'Terlalu banyak percobaan login. Silakan coba lagi nanti.';
    default:
      return 'Terjadi kesalahan saat login. Periksa kembali data Anda.';
  }
};

/**
 * Server Action to handle user login using Better Auth.
 */
export async function loginAction(values: LoginValues): Promise<AuthResponse> {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Data input tidak valid.' };
  }

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      },
      headers: await headers(),
      asResponse: true,
    });

    const setCookies = response.headers.getSetCookie();

    if (setCookies.length > 0) {
      const cookieStore = await cookies();

      for (const cookieStr of setCookies) {
        // Parsing manual yang lebih presisi
        const parts = cookieStr.split(';').map((s) => s.trim());
        const [nameValue] = parts;
        const firstEq = nameValue.indexOf('=');
        if (firstEq === -1) continue;

        const name = nameValue.substring(0, firstEq);
        const value = nameValue.substring(firstEq + 1);

        const cookieOptions: any = {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        };

        // Ambil Max-Age dan Expires jika ada
        parts.slice(1).forEach((opt) => {
          const [key, val] = opt.split('=').map((s) => s.trim());
          const lowerKey = key.toLowerCase();
          if (lowerKey === 'max-age') cookieOptions.maxAge = parseInt(val);
          if (lowerKey === 'expires') cookieOptions.expires = new Date(val);
          if (lowerKey === 'domain') cookieOptions.domain = val;
          if (lowerKey === 'samesite') cookieOptions.sameSite = val.toLowerCase() as any;
        });

        // Paksa pengaturan cookie ke store Next.js
        cookieStore.set(name, value, cookieOptions);
      }
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        user: data.user,
        token: data.token,
      },
    };
  } catch (error: Error | unknown) {
    const rawMessage = error instanceof Error ? error.message : '';
    return {
      success: false,
      error: mapAuthError(rawMessage),
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const response = await auth.api.signOut({
      headers: await headers(),
      asResponse: true,
    });

    const setCookies = response.headers.getSetCookie();
    if (setCookies.length > 0) {
      const cookieStore = await cookies();
      for (const cookieStr of setCookies) {
        const parts = cookieStr.split(';')[0];
        const firstEq = parts.indexOf('=');
        if (firstEq !== -1) {
          const name = parts.substring(0, firstEq).trim();
          cookieStore.delete(name as any);
        }
      }
    }

    return { success: true };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: 'Terjadi kesalahan saat keluar dari sistem.',
    };
  }
}

/**
 * Server Action to register a new user with default role "Peserta".
 */
export async function registerAction(values: RegisterValues): Promise<AuthResponse> {
  const validatedFields = registerSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Data input tidak valid.' };
  }

  try {
    // Look up "Peserta" role from database
    const pesertaRole = await prisma.role.findFirst({
      where: { name: { equals: 'Peserta', mode: 'insensitive' } },
      select: { id: true },
    });

    const response = await auth.api.signUpEmail({
      body: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        ...(pesertaRole ? { roleId: pesertaRole.id } : {}),
      },
      headers: await headers(),
      asResponse: true,
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = (data as { message?: string }).message ?? '';
      const lower = msg.toLowerCase();
      if (lower.includes('email') && lower.includes('exist')) {
        return { success: false, error: 'Email sudah terdaftar. Gunakan email lain.' };
      }
      return {
        success: false,
        error: 'Terjadi kesalahan saat registrasi. Periksa kembali data Anda.',
      };
    }

    interface SignUpResponseBody {
      user: User;
    }
    const body = data as SignUpResponseBody;
    return {
      success: true,
      data: { user: body.user },
    };
  } catch (error: Error | unknown) {
    const rawMessage = error instanceof Error ? error.message : '';
    const lower = rawMessage.toLowerCase();
    if (lower.includes('email') && (lower.includes('exist') || lower.includes('taken'))) {
      return { success: false, error: 'Email sudah terdaftar. Gunakan email lain.' };
    }
    return { success: false, error: 'Terjadi kesalahan saat registrasi.' };
  }
}
