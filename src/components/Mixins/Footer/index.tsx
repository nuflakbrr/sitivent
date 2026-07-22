'use client';
import { useState, type FC, type FormEvent } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { footerLinks, socials } from './constant/footerLinks';
import { subscribeNewsletter } from '@/app/actions/newsletter';

const Footer: FC = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Silakan masukkan alamat email yang valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        toast.success(res.message);
        setEmail('');
      } else {
        toast.error(res.message || 'Gagal mendaftar newsletter.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat mendaftar newsletter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full border-t" style={{ background: '#141413', borderColor: '#1F1F1D' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top: Brand + newsletter */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-14 border-b"
          style={{ borderColor: '#1F1F1D' }}
        >
          {/* Brand */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm shadow-sm"
                style={{ background: '#D97757', color: '#FFFFFF' }}
              >
                S
              </span>
              <span
                className="text-xl font-extrabold tracking-tight"
                style={{ fontFamily: 'ui-serif, Georgia, serif', color: '#FAF9F5' }}
              >
                SITIVENT
              </span>
            </Link>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: '#87867F' }}>
              Platform manajemen event & penjualan tiket digital terdepan di Indonesia. Temukan,
              daftar, dan kelola event favorit Anda dengan mudah.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#87867F] border border-[#2A2A28] hover:text-[#FAF9F5] hover:border-[#D97757] transition-all"
                  style={{ background: '#1C1C1A' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#FAF9F5';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D97757';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#87867F';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#2A2A28';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl p-7 space-y-4 border"
              style={{ background: '#1A1A18', borderColor: '#2A2A28' }}
            >
              <div>
                <h3
                  className="text-base font-bold"
                  style={{ fontFamily: 'ui-serif, Georgia, serif', color: '#FAF9F5' }}
                >
                  Info Event Terbaru
                </h3>
                <p className="text-sm mt-1" style={{ color: '#87867F' }}>
                  Daftarkan email untuk mendapat notifikasi event baru dan promo eksklusif.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm transition-colors outline-none disabled:opacity-60"
                  style={{
                    background: '#141413',
                    border: '1.5px solid #2A2A28',
                    color: '#FAF9F5',
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor = '#D97757')
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor = '#2A2A28')
                  }
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 font-bold rounded-xl text-sm shrink-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  style={{ background: '#D97757', color: '#FFFFFF' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = '#C4684A')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = '#D97757')
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                    </>
                  ) : (
                    'Langganan'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle: Nav links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4
                className="text-xs uppercase tracking-widest font-bold"
                style={{ fontFamily: 'ui-monospace, monospace', color: '#FAF9F5' }}
              >
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href as Route}
                      className="text-sm inline-block transition-all duration-200"
                      style={{ color: '#87867F' }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = '#D97757')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = '#87867F')
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: Copyright */}
        <div
          className="py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ borderColor: '#1F1F1D', color: '#3D3D3A' }}
        >
          <p>
            ©{' '}
            <span style={{ color: '#D97757', fontFamily: 'ui-monospace, monospace' }}>{year}</span>{' '}
            Naufal Akbar Nugroho. Seluruh hak cipta dilindungi undang-undang.
          </p>
          {/* <div className="flex gap-6">
            <Link
              href={'/privacy' as Route}
              className="transition-colors"
              style={{ color: '#3D3D3A' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#87867F')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#3D3D3A')}
            >
              Kebijakan Privasi
            </Link>
            <Link
              href={'/terms' as Route}
              className="transition-colors"
              style={{ color: '#3D3D3A' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#87867F')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#3D3D3A')}
            >
              Syarat &amp; Ketentuan
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
