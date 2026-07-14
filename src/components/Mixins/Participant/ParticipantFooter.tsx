import type { FC } from 'react';

export const ParticipantFooter: FC = () => {
  return (
    <footer
      className="w-full border-t py-5"
      style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-2 md:flex-row px-4">
        <p className="text-xs leading-loose text-center md:text-left" style={{ color: '#87867F' }}>
          &copy;{' '}
          <span
            style={{ fontFamily: 'ui-monospace, monospace', color: '#D97757', fontWeight: 600 }}
          >
            {new Date().getFullYear()}
          </span>{' '}
          <span style={{ fontFamily: 'ui-serif, Georgia, serif' }}>SITIVENT</span>. Hak Cipta
          Dilindungi.
        </p>
        <p className="text-xs" style={{ color: '#D1CFC5', fontFamily: 'ui-monospace, monospace' }}>
          by Naufal Akbar Nugroho
        </p>
      </div>
    </footer>
  );
};
