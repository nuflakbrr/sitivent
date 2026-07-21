'use server';

import { writeFile, mkdir, unlink, stat, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

/** Timeout (ms) untuk seluruh proses upload & kompresi sharp */
const UPLOAD_TIMEOUT_MS = 30_000;

/**
 * Wrapper Promise dengan timeout agar proses tidak hang selamanya.
 * Jika melebihi batas waktu, Promise di-reject dengan error yang jelas.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label = 'Operasi'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} melebihi batas waktu ${ms / 1000}s.`)), ms)
    ),
  ]);
}

/**
 * Upload dan Kompres Gambar ke ImageKit
 */
export async function uploadImage(
  file: File,
  subDir: string = ''
): Promise<{ success: boolean; url?: string; error?: string }> {
  const startTime = Date.now();
  console.log(
    `[uploadImage] ▶ Mulai upload ke ImageKit: "${file.name}" (${(file.size / 1024).toFixed(1)} KB) → subDir: "${subDir || '(root)'}"`
  );

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    if (subDir) {
      formData.append('folder', subDir);
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`ImageKit upload failed with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const elapsed = Date.now() - startTime;
    console.log(`[uploadImage] ✅ Upload ImageKit selesai dalam ${elapsed}ms → URL: ${data.url}`);

    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[uploadImage] ❌ ERROR setelah ${elapsed}ms untuk file "${file.name}":`, error);
    return { success: false, error: 'Gagal mengunggah gambar ke ImageKit.' };
  }
}

/**
 * Hapus Gambar dari Filesystem atau ImageKit
 */
export async function deleteImage(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!url) return { success: true };

    // Hapus file lokal lama jika ada
    if (url.startsWith('/uploads/')) {
      const filename = url.replace('/uploads/', '');
      const filePath = join(process.cwd(), 'public', 'uploads', filename);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
      return { success: true };
    }

    // Hapus dari ImageKit jika berupa ImageKit URL
    if (url.includes('ik.imagekit.io')) {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

      if (pathParts.length > 1) {
        // Abaikan ID imagekit (part pertama) dan filter out transform (tr:)
        const relativeParts = pathParts.slice(1).filter((part) => !part.startsWith('tr:'));
        const imageKitPath = '/' + relativeParts.join('/');
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
        const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

        // Cari fileId berdasarkan path
        const query = `path="${imageKitPath}"`;
        console.log(`[deleteImage] Mencari file dengan query: ${query}`);
        const searchRes = await fetch(
          `https://api.imagekit.io/v1/files?searchQuery=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        );

        if (searchRes.ok) {
          const files = await searchRes.json();
          console.log(`[deleteImage] Hasil pencarian files:`, JSON.stringify(files));
          if (Array.isArray(files) && files.length > 0) {
            const fileId = files[0].fileId;
            console.log(`[deleteImage] Menghapus fileId: ${fileId}`);
            const deleteRes = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
              method: 'DELETE',
              headers: {
                Authorization: authHeader,
              },
            });

            if (deleteRes.ok) {
              console.log(`[deleteImage] Berhasil menghapus file dari ImageKit: ${fileId}`);
            } else {
              const errText = await deleteRes.text();
              console.error(
                `[deleteImage] Gagal menghapus file dari ImageKit: ${fileId}. Response: ${errText}`
              );
            }
          } else {
            console.warn(
              `[deleteImage] File tidak ditemukan di ImageKit dengan path: ${imageKitPath}`
            );
          }
        } else {
          const errText = await searchRes.text();
          console.error(
            `[deleteImage] Gagal mencari file. Status: ${searchRes.status}, Response: ${errText}`
          );
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Delete Image Error:', error);
    return { success: false, error: 'Gagal menghapus file gambar.' };
  }
}

/**
 * Ganti Nama Direktori di public/uploads
 */
export async function renameUploadDir(
  oldSubDir: string,
  newSubDir: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const oldPath = join(process.cwd(), 'public', 'uploads', oldSubDir);
    const newPath = join(process.cwd(), 'public', 'uploads', newSubDir);

    if (existsSync(oldPath)) {
      // Pastikan parent directory tujuan ada
      const newParent = join(newPath, '..');
      if (!existsSync(newParent)) {
        await mkdir(newParent, { recursive: true });
      }

      await rename(oldPath, newPath);
    }

    return { success: true };
  } catch (error) {
    console.error('Rename Upload Dir Error:', error);
    return { success: false, error: 'Gagal mengganti nama direktori penyimpanan.' };
  }
}

/**
 * Hapus Direktori di public/uploads secara rekursif
 */
export async function deleteUploadDir(
  subDir: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const dirPath = join(process.cwd(), 'public', 'uploads', subDir);

    if (existsSync(dirPath)) {
      await rm(dirPath, { recursive: true, force: true });
    }

    return { success: true };
  } catch (error) {
    console.error('Delete Upload Dir Error:', error);
    return { success: false, error: 'Gagal menghapus direktori penyimpanan.' };
  }
}
