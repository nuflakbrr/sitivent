import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from 'next/font/google';

import Footer from '@/components/Mixins/Footer';
import Navbar from '@/components/Mixins/Navbar';
import ScrollToTop from '@/components/Common/ScrollToTop';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const LandingPageLayout = async ({ children }: Props) => {
  return (
    <div
      className={cn(
        'font-sans',
        inter.variable,
        jakartaSans.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default LandingPageLayout;
