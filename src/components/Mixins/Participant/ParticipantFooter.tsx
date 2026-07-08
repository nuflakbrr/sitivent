import type { FC } from 'react';

export const ParticipantFooter: FC = () => {
  return (
    <footer className="border-t border-border py-4 bg-muted/40">
      <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row md:py-0 px-4">
        <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} SITIVENT. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
};
