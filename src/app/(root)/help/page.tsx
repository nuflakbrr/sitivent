'use client';

import type { FC } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Mail, Phone, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { getMeAction } from '@/services/auth';
import { supportMessageSchema } from '@/schemas/support';
import type { CreateSupportMessageInput } from '@/interfaces/features/support';
import { createSupportMessageAction } from '@/services/support';
import { siteMetadata } from '@/data/siteMetadata';

const HELP_CATEGORIES = [
  { value: 'Akun', label: 'Masalah Akun & Login' },
  { value: 'Event', label: 'Masalah Publikasi / Konten Event' },
  { value: 'Pembayaran & Tiket', label: 'Pembayaran, Refund & E-Tiket' },
  { value: 'Lain-lain', label: 'Pertanyaan / Masalah Lainnya' },
];

const HelpPage: FC = () => {
  const { data: meData } = useQuery({
    queryKey: ['auth-me-server-action'],
    queryFn: () => getMeAction(),
  });
  const session = meData?.session;
  const isAuthenticated = !!session?.user;

  const form = useForm<CreateSupportMessageInput>({
    resolver: zodResolver(supportMessageSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      title: '',
      category: '',
      chronology: '',
    },
  });

  const { setValue } = form;

  // Auto-fill authenticated user info
  useEffect(() => {
    if (session?.user) {
      setValue('name', session.user.name ?? '');
      setValue('email', session.user.email ?? '');
    }
  }, [session, setValue]);

  const {
    mutate: handleSubmitMessage,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (values: CreateSupportMessageInput) => {
      const res = await createSupportMessageAction(values);
      if (!res.success) {
        throw new Error(res.error ?? 'Gagal mengirim aduan.');
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success('Pengaduan Anda berhasil dikirim! Tim kami akan segera menindaklanjuti.');
      form.reset({
        name: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
        phone: '',
        title: '',
        category: '',
        chronology: '',
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (values: CreateSupportMessageInput) => {
    handleSubmitMessage(values);
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#3D3D3A] placeholder-[#87867F] text-sm outline-none transition-all duration-200 focus:border-[#D97757] focus:shadow-[0_0_0_3px_rgba(217,119,87,0.12)]';

  const errorBase = 'mt-1.5 text-xs text-[#B04A3F] font-medium';

  return (
    <div
      style={{
        background: '#FAF9F5',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* Hero Header */}
      <div
        style={{ background: '#141413', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="py-24 px-6 relative overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #788C5D, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #D97757, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{
              color: '#788C5D',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            Layanan Bantuan · Sitivent
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FAF9F5' }}
          >
            Hubungi Pusat Bantuan
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#87867F' }}>
            Mengalami masalah pada tiket, transaksi, atau event Anda? Laporkan detail kronologinya
            di bawah ini.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Column (Left) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#141413]">
                Informasi Kontak &amp; Dukungan
              </h2>
              <p className="text-sm leading-relaxed text-[#3D3D3A]">
                Silakan isi formulir pengaduan jika Anda mengalami kendala teknis. Admin kami akan
                langsung meninjau laporan Anda dan menghubungi Anda kembali via WhatsApp.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              <div
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E3DACC]"
                style={{ boxShadow: '0 4px 14px rgba(20,20,19,0.03)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: '#788C5D' }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#87867F]">
                    Email Resmi
                  </p>
                  <a
                    href={`mailto:${siteMetadata.email}`}
                    className="text-sm font-semibold text-[#141413] hover:underline"
                  >
                    {siteMetadata.email}
                  </a>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E3DACC]"
                style={{ boxShadow: '0 4px 14px rgba(20,20,19,0.03)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: '#D97757' }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#87867F]">
                    Layanan WhatsApp
                  </p>
                  <p className="text-sm font-semibold text-[#141413]">+{siteMetadata.phone}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E3DACC]"
                style={{ boxShadow: '0 4px 14px rgba(20,20,19,0.03)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: '#141413' }}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#87867F]">
                    Jam Kerja
                  </p>
                  <p className="text-sm font-semibold text-[#141413]">
                    Senin - Jumat · 09:00 - 17:00
                  </p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div
              className="rounded-2xl p-5 border border-[#E3DACC]"
              style={{ background: '#F0EEE6' }}
            >
              <p className="text-xs leading-relaxed text-[#3D3D3A]">
                <strong>Catatan Penting:</strong> Mohon pastikan nomor WhatsApp yang Anda masukkan
                aktif dan dapat menerima pesan, agar tim kami dapat menghubungi Anda dengan cepat.
              </p>
            </div>
          </div>

          {/* Form Column (Right) */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div
                className="rounded-3xl p-8 text-center space-y-6 bg-white border border-[#E3DACC]"
                style={{ boxShadow: '0 16px 40px rgba(20,20,19,0.06)' }}
              >
                <div className="w-16 h-16 rounded-full bg-[#788C5D]/10 flex items-center justify-center text-[#788C5D] mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#141413]">Laporan Terkirim</h3>
                  <p className="text-sm text-[#3D3D3A] leading-relaxed max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Tim admin kami sedang memproses laporan
                    Anda dan akan segera menghubungi Anda kembali.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-xl font-bold text-xs bg-[#D97757] text-white hover:bg-[#c46843] transition-all"
                  >
                    Kirim Aduan Lain
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl font-bold text-xs border border-[#D1CFC5] text-[#3D3D3A] hover:bg-[#F0EEE6] transition-all"
                  >
                    Ke Beranda
                  </Link>
                </div>
              </div>
            ) : (
              <div
                className="rounded-3xl p-8 bg-white border border-[#E3DACC]"
                style={{ boxShadow: '0 16px 40px rgba(20,20,19,0.06)' }}
              >
                {/* Form header */}
                <div className="mb-6">
                  <h3 className="font-serif text-xl font-bold text-[#141413]">
                    Formulir Laporan Kendala
                  </h3>
                  {isAuthenticated ? (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#788C5D] bg-[#788C5D]/10">
                      <span>✓ Terautentikasi: {session.user.name}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#87867F] mt-1.5">
                      Anda belum masuk. Silakan isi form manual sebagai tamu.
                    </p>
                  )}
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Name & Email Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama */}
                    <div>
                      <label
                        htmlFor="help-name"
                        className="block text-[10px] font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        id="help-name"
                        type="text"
                        placeholder="Nama Lengkap Anda"
                        disabled={isPending || isAuthenticated}
                        {...form.register('name')}
                        className={`${inputBase} ${
                          form.formState.errors.name ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
                        } disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#FAF9F5]`}
                      />
                      {form.formState.errors.name && (
                        <p className={errorBase}>{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="help-email"
                        className="block text-[10px] font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="help-email"
                        type="email"
                        placeholder="nama@email.com"
                        disabled={isPending || isAuthenticated}
                        {...form.register('email')}
                        className={`${inputBase} ${
                          form.formState.errors.email ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
                        } disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#FAF9F5]`}
                      />
                      {form.formState.errors.email && (
                        <p className={errorBase}>{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Category Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nomor Telepon / WhatsApp */}
                    <div>
                      <label
                        htmlFor="help-phone"
                        className="block text-[10px] font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
                      >
                        Nomor WhatsApp
                      </label>
                      <input
                        id="help-phone"
                        type="text"
                        placeholder="Contoh: 082212345678"
                        disabled={isPending}
                        {...form.register('phone')}
                        className={`${inputBase} ${
                          form.formState.errors.phone ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
                        }`}
                      />
                      {form.formState.errors.phone && (
                        <p className={errorBase}>{form.formState.errors.phone.message}</p>
                      )}
                    </div>

                    {/* Kategori Issue */}
                    <div>
                      <label
                        htmlFor="help-category"
                        className="block text-[10px] font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
                      >
                        Kategori Issue
                      </label>
                      <select
                        id="help-category"
                        disabled={isPending}
                        {...form.register('category')}
                        className={`${inputBase} ${
                          form.formState.errors.category ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
                        }`}
                      >
                        <option value="">Pilih Kategori...</option>
                        {HELP_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.category && (
                        <p className={errorBase}>{form.formState.errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Judul Issue */}
                  <div>
                    <label
                      htmlFor="help-title"
                      className="block text-[10px] font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
                    >
                      Judul Issue / Ringkasan Masalah
                    </label>
                    <input
                      id="help-title"
                      type="text"
                      placeholder="Contoh: Gagal mengunduh sertifikat event"
                      disabled={isPending}
                      {...form.register('title')}
                      className={`${inputBase} ${
                        form.formState.errors.title ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
                      }`}
                    />
                    {form.formState.errors.title && (
                      <p className={errorBase}>{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  {/* Kronologi */}
                  <div>
                    <label
                      htmlFor="help-chronology"
                      className="block text-[10px] font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
                    >
                      Kronologi Lengkap Kejadian
                    </label>
                    <textarea
                      id="help-chronology"
                      rows={5}
                      placeholder="Ceritakan secara detail langkah-langkah kejadian, pesan error yang muncul, dsb..."
                      disabled={isPending}
                      {...form.register('chronology')}
                      className={`${inputBase} resize-none ${
                        form.formState.errors.chronology ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
                      }`}
                    />
                    {form.formState.errors.chronology && (
                      <p className={errorBase}>{form.formState.errors.chronology.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="btn-help-submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    style={{ background: '#788C5D', boxShadow: '0 6px 20px rgba(120,140,93,0.25)' }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Mengirim Laporan...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Kirim Laporan Pengaduan
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
