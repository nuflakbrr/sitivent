import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/Common/CustomIcons';

export const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'Jelajahi Event', href: '/events' },
      { name: 'Galeri', href: '/gallery' },
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Kontak', href: '/contact' },
    ],
  },
  {
    title: 'Peserta',
    links: [
      { name: 'Daftar Gratis', href: '/register' },
      { name: 'Masuk', href: '/login' },
    ],
  },
  {
    title: 'Dukungan',
    links: [
      { name: 'Bantuan', href: '/help' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Ketentuan', href: '/terms' },
      { name: 'Privasi', href: '/privacy' },
    ],
  },
];

export const socials = [
  { name: 'GitHub', icon: <GitHubIcon />, href: 'https://github.com/nuflakbrr' },
  { name: 'Twitter', icon: <TwitterIcon />, href: '#' },
  { name: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
  { name: 'Instagram', icon: <InstagramIcon />, href: '#' },
];
