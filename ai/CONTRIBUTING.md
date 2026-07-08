# Contributing & Development Workflow - SITIVENT

## AI Response Rules

Ketika AI membuat kode, AI harus:

- Mengikuti arsitektur project.
- Menggunakan stack yang sudah tersedia.
- Tidak menambahkan library baru tanpa diminta.
- Menggunakan komponen yang sudah ada.
- Menggunakan utility yang sudah ada.
- Menggunakan service layer.
- Menggunakan Prisma.
- Menggunakan Better Auth.
- Menggunakan React Hook Form.
- Menggunakan Zod.
- Menggunakan TanStack Query.
- Menjaga type safety.
- Menghindari penggunaan any.
- Menghindari duplicate code.
- Menjaga perubahan sekecil mungkin.
- Tidak mengubah file yang tidak berhubungan.
- Menjaga backward compatibility.
- Menghasilkan kode production-ready.

## AI Restrictions

AI DILARANG:

- Mengganti arsitektur project.
- Mengganti stack project.
- Membuat ORM baru.
- Membuat authentication baru.
- Membuat state management baru.
- Membuat styling baru selain Tailwind.
- Menggunakan library yang belum ada tanpa persetujuan.
- Menghapus kode existing tanpa alasan yang jelas.
- Melakukan refactor besar tanpa diminta.

## Git Convention

Commit message mengikuti Conventional Commit.

Contoh:

```text
feat:
fix:
refactor:
docs:
style:
perf:
test:
build:
ci:
chore:
```
