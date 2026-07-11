import type { FC } from 'react';
import type { Metadata } from 'next';
import { Mail, ExternalLink, Phone } from 'lucide-react';
import { siteMetadata } from '@/data/siteMetadata';

export const metadata: Metadata = {
  title: 'Kontak — SITIVENT',
  description:
    'Hubungi tim SITIVENT untuk pertanyaan, masukan, atau kolaborasi lebih lanjut mengenai platform manajemen event kami.',
};

const Contact: FC = () => {
  const contacts = [
    ...(siteMetadata.email
      ? [
          {
            icon: Mail,
            label: 'Email',
            value: siteMetadata.email,
            href: `mailto:${siteMetadata.email}`,
          },
        ]
      : []),
    ...(siteMetadata.instagram
      ? [
          {
            icon: ExternalLink,
            label: 'Instagram',
            value: `@${siteMetadata.instagram.split('/').pop()}`,
            href: siteMetadata.instagram,
          },
        ]
      : []),
    ...(siteMetadata.github
      ? [
          {
            icon: ExternalLink,
            label: 'GitHub',
            value: siteMetadata.github.replace('https://', ''),
            href: siteMetadata.github,
          },
        ]
      : []),
    ...(siteMetadata.phone
      ? [
          {
            icon: Phone,
            label: 'Telepon',
            value: siteMetadata.phone,
            href: `tel:${siteMetadata.phone}`,
          },
        ]
      : []),
  ];

  return (
    <section className="min-h-screen bg-slate-50 pt-28 pb-16">
      {/* Header */}
      <div className="bg-indigo-600 py-16 text-center relative overflow-hidden mb-16">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full" />
        </div>
        <div className="relative container mx-auto px-4 max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Kontak</h1>
          <p className="text-indigo-200 text-lg font-medium max-w-md mx-auto">
            Ada pertanyaan atau ingin berkolaborasi? Hubungi kami melalui saluran di bawah.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Dev card */}
          <div className="bg-linear-to-br from-indigo-50 to-violet-50 p-8 flex flex-col items-center text-center gap-4 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-md">
              <img
                src="https://avatars.githubusercontent.com/u/83068205?v=4"
                alt="Developer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Naufal Akbar Nugroho</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Fullstack Developer · Creator of SITIVENT
              </p>
            </div>
          </div>

          {/* Contact links */}
          <div className="p-6 space-y-3">
            {contacts.length > 0 ? (
              contacts.map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        {c.label}
                      </div>
                      <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                        {c.value}
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <>
                <a
                  href="https://github.com/nuflakbrr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      GitHub
                    </div>
                    <div className="text-sm font-semibold text-slate-700">github.com/nuflakbrr</div>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
