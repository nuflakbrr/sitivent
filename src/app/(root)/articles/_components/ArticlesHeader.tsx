import type { FC } from 'react';

export const ArticlesHeader: FC = () => {
  return (
    <div
      style={{ background: '#141413', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      className="py-28 px-6"
    >
      <div className="max-w-4xl mx-auto space-y-6 text-center flex flex-col items-center">
        <div className="space-y-2">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{
              color: '#D97757',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            Artikel · Sitivent
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FAF9F5' }}
          >
            Pusat Edukasi &amp; Artikel
          </h1>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#87867F' }}>
            Temukan panduan, tutorial, berita, dan tips terbaik seputar teknologi serta event
            menarik di SITIVENT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticlesHeader;
