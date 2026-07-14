'use client';
import type { FC } from 'react';
import type { Route } from 'next';
import Link from 'next/link';

import { footerLinks, socials } from './constant/footerLinks';

const Footer: FC = () => {
  const year = new Date().getFullYear();

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
                className="font-extrabold text-lg tracking-tight"
                style={{ fontFamily: 'ui-serif, Georgia, serif', color: '#FAF9F5' }}
              >
                SITIVENT
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#87867F' }}>
              Platform manajemen event dan tiket digital untuk seminar, workshop, webinar, dan
              bootcamp teknologi di Indonesia.
            </p>
            <div className="flex gap-3 pt-1">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border"
                  style={{
                    background: '#1F1F1D',
                    color: '#87867F',
                    borderColor: '#2A2A28',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#D97757';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D97757';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#1F1F1D';
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
              <form className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm transition-colors outline-none"
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
                  className="px-5 py-2.5 font-bold rounded-xl text-sm shrink-0 transition-all duration-200"
                  style={{ background: '#D97757', color: '#FFFFFF' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = '#C4684A')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = '#D97757')
                  }
                >
                  Langganan
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
