import {
  Home,
  Calendar,
  ClipboardList,
  CreditCard,
  QrCode,
  Award,
  UserCog,
  Folder,
  DollarSign,
  type LucideIcon,
  Grid2x2,
  Image,
  BookOpen,
  MessageCircle,
} from 'lucide-react';

type SideLinks = {
  versions: string[];
  navMain: {
    title: string;
    url: string;
    hasChildren: boolean;
    icon: LucideIcon;
    permission?: string;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
      permission?: string;
      isActive?: boolean;
    }[];
  }[];
};

export const sideLinks: SideLinks = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Dashboard',
      url: 'dashboard',
      hasChildren: false,
      icon: Home,
      permission: 'admin.access',
    },
    {
      title: 'Data Master',
      url: 'master',
      hasChildren: true,
      icon: Folder,
      items: [
        {
          title: 'Kategori Event',
          url: 'master/event-categories',
          icon: Grid2x2,
          permission: 'event.categories.read',
        },
        {
          title: 'Event',
          url: 'master/events',
          icon: Calendar,
          permission: 'events.read',
        },
        {
          title: 'Sertifikat',
          url: 'master/certificates',
          icon: Award,
          permission: 'certificates.read',
        },
        {
          title: 'Galeri',
          url: 'master/galleries',
          icon: Image,
          permission: 'galleries.read',
        },
      ],
    },
    {
      title: 'Transaksi',
      url: 'transactions',
      hasChildren: true,
      icon: DollarSign,
      items: [
        {
          title: 'Pendaftaran',
          url: 'transactions/registrations',
          icon: ClipboardList,
          permission: 'registrations.read',
        },
        {
          title: 'Pembayaran',
          url: 'transactions/payments',
          icon: CreditCard,
          permission: 'payments.verify',
        },
      ],
    },
    {
      title: 'Kehadiran',
      url: 'attendance',
      hasChildren: true,
      icon: QrCode,
      items: [
        {
          title: 'Scan Presensi',
          url: 'attendance/scan',
          icon: QrCode,
          permission: 'attendance.scan',
        },
      ],
    },
    {
      title: 'Publikasi',
      url: 'publication',
      hasChildren: true,
      icon: BookOpen,
      items: [
        {
          title: 'Artikel',
          url: 'publication/articles',
          icon: BookOpen,
          permission: 'articles.read',
        },
        {
          title: 'Testimoni',
          url: 'publication/testimonies',
          icon: MessageCircle,
          permission: 'testimonies.read',
        },
      ],
    },
    {
      title: 'Bantuan Pelanggan',
      url: 'support',
      hasChildren: true,
      icon: MessageCircle,
      items: [
        {
          title: 'Inbox',
          url: 'support/messages',
          icon: MessageCircle,
          permission: 'messages.read',
        },
      ],
    },
    {
      title: 'Manajemen',
      url: 'managements',
      hasChildren: true,
      icon: UserCog,
      items: [
        {
          title: 'Hak Akses',
          url: 'managements/permissions',
          icon: UserCog,
          permission: 'permission.read',
        },
        {
          title: 'Jabatan',
          url: 'managements/roles',
          icon: UserCog,
          permission: 'role.read',
        },
        {
          title: 'Pengguna',
          url: 'managements/users',
          icon: UserCog,
          permission: 'user.read',
        },
      ],
    },
  ],
};
