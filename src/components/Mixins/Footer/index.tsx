'use client';
import type { FC } from 'react';
import type { Route } from 'next';
import Link from 'next/link';

import { footerLinks, socials } from './constant/footerLinks';

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top: Brand + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-14 border-b border-slate-900">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm shadow-sm">
                S
              </span>
              <span className="font-extrabold text-lg text-white tracking-tight">SITIVENT</span>
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm max-w-sm">
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
                  className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-slate-500 transition-all duration-200 border border-slate-800"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/60 rounded-2xl p-7 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Info Event Terbaru</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Daftarkan email untuk mendapat notifikasi event baru dan promo eksklusif.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors text-sm text-white placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm shrink-0"
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
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href as Route}
                      className="text-sm hover:text-indigo-400 hover:translate-x-0.5 inline-block transition-all duration-200"
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
        <div className="py-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <p>© {year} INDEVPRO. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-6">
            <Link href={'/privacy' as Route} className="hover:text-slate-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href={'/terms' as Route} className="hover:text-slate-400 transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
