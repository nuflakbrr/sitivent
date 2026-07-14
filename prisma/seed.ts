import { prisma } from '../src/lib/prisma';
import { auth } from '../src/lib/auth';

async function main() {
  console.log('🚀 Start seeding...');

  // 1. Seed Permissions
  const permissions = [
    // --- Core / Administration Module ---
    { name: 'permission.read', description: 'Melihat daftar hak akses' },
    { name: 'permission.create', description: 'Membuat hak akses baru' },
    { name: 'permission.update', description: 'Mengubah data hak akses' },
    { name: 'permission.delete', description: 'Menghapus hak akses' },
    { name: 'role.read', description: 'Melihat daftar jabatan' },
    { name: 'role.create', description: 'Membuat jabatan baru' },
    { name: 'role.update', description: 'Mengubah data jabatan' },
    { name: 'role.delete', description: 'Menghapus jabatan' },
    { name: 'user.read', description: 'Melihat daftar pengguna' },
    { name: 'user.create', description: 'Membuat pengguna baru' },
    { name: 'user.update', description: 'Mengubah data pengguna' },
    { name: 'user.delete', description: 'Menghapus pengguna' },
    { name: 'admin.access', description: 'Mengakses dashboard admin' },

    // --- Event Categories Module ---
    { name: 'event.categories.read', description: 'Melihat daftar event kategori' },
    { name: 'event.categories.create', description: 'Membuat event kategori baru' },
    { name: 'event.categories.update', description: 'Mengubah data event kategori' },
    { name: 'event.categories.delete', description: 'Menghapus event kategori' },

    // --- Articles Module ---
    { name: 'article.read', description: 'Melihat daftar artikel' },
    { name: 'article.create', description: 'Membuat artikel baru' },
    { name: 'article.update', description: 'Mengubah data artikel' },
    { name: 'article.delete', description: 'Menghapus artikel' },
    { name: 'article.category.read', description: 'Melihat daftar kategori artikel' },
    { name: 'article.category.create', description: 'Membuat kategori artikel baru' },
    { name: 'article.category.update', description: 'Mengubah data kategori artikel' },
    { name: 'article.category.delete', description: 'Menghapus kategori artikel' },

    // --- Galleries Module ---
    { name: 'galleries.read', description: 'Melihat daftar galeri' },
    { name: 'galleries.create', description: 'Membuat galeri baru' },
    { name: 'galleries.update', description: 'Mengubah data galeri' },
    { name: 'galleries.delete', description: 'Menghapus galeri' },

    // --- Testimonies Module ---
    { name: 'testimonies.read', description: 'Melihat daftar testimoni' },
    { name: 'testimonies.create', description: 'Membuat testimoni baru' },
    { name: 'testimonies.update', description: 'Mengubah data testimoni' },
    { name: 'testimonies.delete', description: 'Menghapus testimoni' },

    // --- Event Module ---
    { name: 'events.read', description: 'Melihat daftar event' },
    { name: 'events.create', description: 'Membuat event baru' },
    { name: 'events.update', description: 'Mengubah data event' },
    { name: 'events.delete', description: 'Menghapus event' },
    { name: 'events.publish', description: 'Mempublikasikan event' },

    // --- Registration Module ---
    { name: 'registrations.read', description: 'Melihat daftar registrasi' },

    // --- Payment Module ---
    { name: 'payments.verify', description: 'Memverifikasi pembayaran' },

    // --- Certificate Module ---
    { name: 'certificates.read', description: 'Melihat sertifikat' },
    { name: 'certificates.create', description: 'Membuat sertifikat baru' },
    { name: 'certificates.download', description: 'Mengunduh sertifikat' },

    // --- Attendance Module ---
    { name: 'attendance.scan', description: 'Melakukan pemindaian kehadiran' },

    // --- Support Module ---
    { name: 'support.read', description: 'Melihat pesan dukungan' },
    { name: 'support.update', description: 'Mengubah status pesan dukungan' },
  ];

  console.log('  - Seeding permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }

  // 2. Seed Roles
  console.log('  - Seeding roles...');
  const allPermissionNames = permissions.map((p) => p.name);

  await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: { description: 'Super Administrator dengan akses penuh ke seluruh sistem' },
    create: {
      name: 'superadmin',
      description: 'Super Administrator dengan akses penuh ke seluruh sistem',
      permissions: { connect: allPermissionNames.map((name) => ({ name })) },
    },
  });

  await prisma.role.upsert({
    where: { name: 'panitia' },
    update: { description: 'Panitia event dengan akses manajemen event dan absensi' },
    create: {
      name: 'panitia',
      description: 'Panitia event dengan akses manajemen event dan absensi',
      permissions: {
        connect: [
          { name: 'admin.access' },
          { name: 'events.read' },
          { name: 'events.create' },
          { name: 'events.update' },
          { name: 'events.publish' },
          { name: 'event.categories.read' },
          { name: 'registrations.read' },
          { name: 'payments.verify' },
          { name: 'attendance.scan' },
          { name: 'certificates.read' },
          { name: 'certificates.create' },
          { name: 'support.read' },
          { name: 'support.update' },
        ],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: 'scanner' },
    update: { description: 'Petugas pemindaian kehadiran peserta' },
    create: {
      name: 'scanner',
      description: 'Petugas pemindaian kehadiran peserta',
      permissions: {
        connect: [
          { name: 'admin.access' },
          { name: 'attendance.scan' },
          { name: 'registrations.read' },
        ],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: 'peserta' },
    update: { description: 'Peserta dengan akses pendaftaran dan sertifikat' },
    create: {
      name: 'peserta',
      description: 'Peserta dengan akses pendaftaran dan sertifikat',
      permissions: {
        connect: [
          { name: 'events.read' },
          { name: 'certificates.read' },
          { name: 'certificates.download' },
        ],
      },
    },
  });

  // Helper function to seed users via Better Auth
  async function seedUser(
    email: string,
    name: string,
    password = 'password',
    roleName?: string
  ): Promise<string | undefined> {
    const existing = await prisma.user.findUnique({ where: { email } });
    let userId = existing?.id;

    if (!existing) {
      console.log(`  - Creating user: ${email}...`);
      try {
        // @ts-ignore
        const result = await auth.api.createUser({ body: { email, password, name } });
        if (result?.user) userId = result.user.id;
      } catch (err: any) {
        console.error(
          `❌ Error creating user ${email} via Better Auth:`,
          JSON.stringify(err, null, 2)
        );
        throw err;
      }
    } else {
      const existingAccount = await prisma.account.findFirst({
        where: { userId: existing.id, providerId: 'credential' },
      });
      if (!existingAccount) {
        console.log(`  - User ${email} exists but no credential account found. Re-creating...`);
        await prisma.user.delete({ where: { id: existing.id } });
        return seedUser(email, name, password, roleName);
      }
    }

    if (userId) {
      const data: any = { emailVerified: true };
      if (roleName) {
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (role) data.roles = { connect: { id: role.id } };
      }
      await prisma.user.update({ where: { id: userId }, data });
    }

    return userId;
  }

  // 3. Seed Users
  console.log('  - Seeding users...');
  const adminId = await seedUser('super.admin@gmail.com', 'Super Admin', 'password', 'superadmin');
  const panitiaId = await seedUser('panitia@gmail.com', 'Panitia Event', 'password', 'panitia');
  const scannerId = await seedUser('scanner@gmail.com', 'Petugas Scanner', 'password', 'scanner');
  const pesertaId = await seedUser('peserta@gmail.com', 'Peserta Mandiri', 'password', 'peserta');
  const pesertaBerbayarId = await seedUser(
    'peserta-berbayar@gmail.com',
    'Peserta Berbayar',
    'password',
    'peserta'
  );
  const scanParticipant1Id = await seedUser(
    'peserta-scan-1@gmail.com',
    'Peserta Scan 1',
    'password',
    'peserta'
  );
  const scanParticipant2Id = await seedUser(
    'peserta-scan-2@gmail.com',
    'Peserta Scan 2',
    'password',
    'peserta'
  );

  // 4. Seed Event Categories
  console.log('  - Seeding event categories...');
  const categoryDefs = [
    { name: 'Seminar', slug: 'seminar', description: 'Acara seminar dan kuliah tamu' },
    { name: 'Workshop', slug: 'workshop', description: 'Pelatihan dan workshop praktis' },
    { name: 'Webinar', slug: 'webinar', description: 'Seminar berbasis online' },
    { name: 'Kompetisi', slug: 'kompetisi', description: 'Ajang lomba dan kompetisi' },
    { name: 'Konferensi', slug: 'konferensi', description: 'Konferensi ilmiah dan forum' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoryDefs) {
    const record = await prisma.eventCategory.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description },
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
  }

  // 5. Seed Events
  console.log('  - Seeding events...');

  const eventGratis1 = await prisma.event.upsert({
    where: { slug: 'seminar-teknologi-2026' },
    update: {},
    create: {
      title: 'Seminar Teknologi & Inovasi 2026',
      slug: 'seminar-teknologi-2026',
      description:
        'Seminar tahunan membahas perkembangan teknologi terkini, AI, dan ekosistem startup Indonesia. Terbuka untuk umum tanpa biaya pendaftaran.',
      eventType: 'OFFLINE',
      location: 'Gedung Serbaguna, Kampus Utama',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-10'),
      startTime: '09:00',
      endTime: '12:00',
      registrationDeadline: new Date('2026-10-09'),
      quota: 200,
      price: 0,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
      categoryId: categoryMap['seminar'],
    },
  });

  const eventGratis2 = await prisma.event.upsert({
    where: { slug: 'webinar-desain-ui-ux' },
    update: {},
    create: {
      title: 'Webinar Desain UI/UX untuk Pemula',
      slug: 'webinar-desain-ui-ux',
      description:
        'Webinar interaktif bersama praktisi UI/UX profesional. Pelajari prinsip desain modern dan workflow Figma dari nol hingga mahir.',
      eventType: 'ONLINE',
      location: 'Zoom Meeting (link dikirim via email)',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-15'),
      startTime: '13:00',
      endTime: '16:00',
      registrationDeadline: new Date('2026-10-14'),
      quota: 500,
      price: 0,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
      categoryId: categoryMap['webinar'],
    },
  });

  const eventBerbayar1 = await prisma.event.upsert({
    where: { slug: 'workshop-fullstack-nextjs' },
    update: {},
    create: {
      title: 'Workshop Full-Stack Web dengan Next.js 15',
      slug: 'workshop-fullstack-nextjs',
      description:
        'Workshop intensif 2 hari membangun aplikasi web full-stack dengan Next.js 15, Prisma ORM, dan PostgreSQL. Kuota sangat terbatas.',
      eventType: 'OFFLINE',
      location: 'Lab Komputer Gedung F, Lt. 3',
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-10-21'),
      startTime: '09:00',
      endTime: '17:00',
      registrationDeadline: new Date('2026-10-18'),
      quota: 40,
      price: 150000,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
      categoryId: categoryMap['workshop'],
    },
  });

  const eventBerbayar2 = await prisma.event.upsert({
    where: { slug: 'konferensi-riset-mahasiswa-2026' },
    update: {},
    create: {
      title: 'Konferensi Riset Mahasiswa 2026',
      slug: 'konferensi-riset-mahasiswa-2026',
      description:
        'Forum presentasi paper dan poster riset mahasiswa dari berbagai universitas. Proses seleksi abstrak dan full paper oleh reviewer.',
      eventType: 'OFFLINE',
      location: 'Auditorium Utama, Gedung Rektorat',
      startDate: new Date('2026-11-05'),
      endDate: new Date('2026-11-06'),
      startTime: '08:00',
      endTime: '17:00',
      registrationDeadline: new Date('2026-10-31'),
      quota: 100,
      price: 75000,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
      categoryId: categoryMap['konferensi'],
    },
  });

  await prisma.event.upsert({
    where: { slug: 'kompetisi-programming-2026' },
    update: {},
    create: {
      title: 'Kompetisi Programming 2026',
      slug: 'kompetisi-programming-2026',
      description:
        'Ajang kompetisi algoritma dan pemrograman tingkat nasional. Hadiah total Rp 10.000.000 untuk juara 1, 2, dan 3.',
      eventType: 'OFFLINE',
      location: 'TBD',
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-01'),
      startTime: '08:00',
      endTime: '17:00',
      registrationDeadline: new Date('2026-11-25'),
      quota: 80,
      price: 50000,
      status: 'DRAFT',
      certificateEnabled: false,
      categoryId: categoryMap['kompetisi'],
    },
  });

  // 6. Seed Registrations & Payments
  console.log('  - Seeding registrations & payments...');

  // Peserta Scan 1 → gratis event 1, siap scan (REGISTERED)
  if (scanParticipant1Id) {
    await prisma.registration.upsert({
      where: { registrationNumber: 'REG-SCAN-1-2026' },
      update: {},
      create: {
        registrationNumber: 'REG-SCAN-1-2026',
        eventId: eventGratis1.id,
        userId: scanParticipant1Id,
        qrToken: 'valid-token-scan1-12345',
        status: 'REGISTERED',
      },
    });
  }

  // Peserta Scan 2 → gratis event 1, sudah CHECKED_IN + attendance
  if (scanParticipant2Id) {
    const reg2 = await prisma.registration.upsert({
      where: { registrationNumber: 'REG-SCAN-2-2026' },
      update: {},
      create: {
        registrationNumber: 'REG-SCAN-2-2026',
        eventId: eventGratis1.id,
        userId: scanParticipant2Id,
        qrToken: 'used-token-scan2-99999',
        status: 'CHECKED_IN',
      },
    });

    const existingAttendance = await prisma.attendance.findFirst({
      where: { registrationId: reg2.id },
    });
    if (!existingAttendance) {
      await prisma.attendance.create({
        data: {
          registrationId: reg2.id,
          status: 'SUCCESS',
          scanTime: new Date(),
          scannerId: adminId ?? null,
        },
      });
    }
  }

  // Peserta Mandiri → gratis event 2, REGISTERED (cert blocked)
  if (pesertaId) {
    await prisma.registration.upsert({
      where: { registrationNumber: 'REG-PESERTA-GRATIS2-2026' },
      update: {},
      create: {
        registrationNumber: 'REG-PESERTA-GRATIS2-2026',
        eventId: eventGratis2.id,
        userId: pesertaId,
        qrToken: 'cert-blocked-token-888',
        status: 'REGISTERED',
      },
    });
  }

  // Peserta Berbayar → event berbayar 1, WAITING_PAYMENT
  if (pesertaBerbayarId) {
    const regWaiting = await prisma.registration.upsert({
      where: { registrationNumber: 'REG-BERBAYAR-WAITING-2026' },
      update: {},
      create: {
        registrationNumber: 'REG-BERBAYAR-WAITING-2026',
        eventId: eventBerbayar1.id,
        userId: pesertaBerbayarId,
        qrToken: 'qr-berbayar-waiting-111',
        status: 'WAITING_PAYMENT',
      },
    });
    await prisma.payment.upsert({
      where: { registrationId: regWaiting.id },
      update: {},
      create: {
        registrationId: regWaiting.id,
        amount: eventBerbayar1.price,
        status: 'WAITING',
      },
    });
  }

  // Peserta Mandiri → event berbayar 1, REGISTERED (payment PAID)
  if (pesertaId) {
    const regPaid = await prisma.registration.upsert({
      where: { registrationNumber: 'REG-BERBAYAR-PAID-2026' },
      update: {},
      create: {
        registrationNumber: 'REG-BERBAYAR-PAID-2026',
        eventId: eventBerbayar1.id,
        userId: pesertaId,
        qrToken: 'qr-berbayar-paid-222',
        status: 'REGISTERED',
      },
    });
    await prisma.payment.upsert({
      where: { registrationId: regPaid.id },
      update: {},
      create: {
        registrationId: regPaid.id,
        amount: eventBerbayar1.price,
        status: 'PAID',
        proofUrl: 'https://placehold.co/800x600?text=Bukti+Pembayaran',
        verifiedAt: new Date(),
        verifiedById: adminId ?? null,
      },
    });
  }

  // Peserta Scan 1 → konferensi, WAITING_PAYMENT
  if (scanParticipant1Id) {
    const regKonf = await prisma.registration.upsert({
      where: { registrationNumber: 'REG-KONF-2026' },
      update: {},
      create: {
        registrationNumber: 'REG-KONF-2026',
        eventId: eventBerbayar2.id,
        userId: scanParticipant1Id,
        qrToken: 'qr-konf-333',
        status: 'WAITING_PAYMENT',
      },
    });
    await prisma.payment.upsert({
      where: { registrationId: regKonf.id },
      update: {},
      create: {
        registrationId: regKonf.id,
        amount: eventBerbayar2.price,
        status: 'WAITING',
      },
    });
  }

  // 7. Seed Support Messages
  console.log('  - Seeding support messages...');
  const supportMessages = [
    {
      name: 'Peserta Mandiri',
      email: 'peserta@gmail.com',
      phone: '081234567890',
      title: 'Gagal mengunduh sertifikat event webinar',
      category: 'Event',
      chronology:
        'Saya sudah terdaftar dan hadir di webinar UI/UX, namun ketika mencoba mengunduh sertifikat selalu muncul pesan error "Sertifikat tidak tersedia". Mohon bantuannya.',
      status: 'PENDING',
      userId: pesertaId ?? null,
    },
    {
      name: 'Budi Santoso',
      email: 'budi.santoso@example.com',
      phone: '082198765432',
      title: 'Pembayaran workshop sudah ditransfer tapi status masih waiting',
      category: 'Pembayaran & Tiket',
      chronology:
        'Saya telah melakukan transfer untuk workshop Full-Stack Next.js pada tanggal 5 Oktober 2026 sejumlah Rp 150.000 ke rekening yang tertera. Namun status pembayaran saya masih WAITING PAYMENT hingga saat ini. Bukti transfer sudah saya upload di sistem.',
      status: 'PROCESS',
      userId: null,
    },
    {
      name: 'Anisa Putri',
      email: 'anisa.putri@student.ac.id',
      phone: '089512345678',
      title: 'Tidak bisa login ke akun',
      category: 'Akun',
      chronology:
        'Saya tidak bisa login menggunakan email dan password yang saya daftarkan. Sudah mencoba reset password namun email reset tidak kunjung datang. Tolong bantu akses akun saya kembali.',
      status: 'RESOLVED',
      userId: null,
    },
    {
      name: 'Peserta Berbayar',
      email: 'peserta-berbayar@gmail.com',
      phone: '085612345678',
      title: 'Pertanyaan mengenai refund event yang dibatalkan',
      category: 'Pembayaran & Tiket',
      chronology:
        'Apakah ada kebijakan refund jika event dibatalkan oleh panitia? Saya ingin mengetahui prosedur pengembalian dana jika terjadi pembatalan mendadak.',
      status: 'PENDING',
      userId: pesertaBerbayarId ?? null,
    },
  ];

  for (const msg of supportMessages) {
    const existing = await prisma.supportMessage.findFirst({
      where: { email: msg.email, title: msg.title },
    });
    if (!existing) {
      await prisma.supportMessage.create({ data: msg });
    }
  }

  // 9. Seed Galleries
  console.log('  - Seeding galleries...');
  const galleryItems = [
    {
      title: 'Sesi Pembukaan Seminar AI',
      description: 'Suasana kemeriahan sesi pembukaan Seminar Teknologi & Inovasi 2026.',
      imageUrl:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      featured: true,
      eventId: eventGratis1.id,
    },
    {
      title: 'Workshop Flutter Praktis',
      description: 'Peserta mencoba membuat aplikasi mobile pertama mereka dengan Flutter.',
      imageUrl:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
      featured: true,
      eventId: eventGratis2.id,
    },
    {
      title: 'Diskusi Panel Start-up',
      description: 'Diskusi panel interaktif bersama pakar industri mengenai pendanaan startup.',
      imageUrl:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
      featured: true,
      eventId: eventGratis1.id,
    },
    {
      title: 'Presentasi Finalis Kompetisi Hackathon',
      description: 'Finalis mendemonstrasikan prototipe aplikasi IoT mereka di hadapan dewan juri.',
      imageUrl:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
      featured: false,
      eventId: eventBerbayar1.id,
    },
    {
      title: 'Antusiasme Audien',
      description: 'Audien antusias mendengarkan materi dari pembicara global.',
      imageUrl:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
      featured: true,
      eventId: eventGratis1.id,
    },
    {
      title: 'Foto Bersama Panitia dan Pembicara',
      description: 'Sesi dokumentasi foto bersama setelah penutupan event selesai.',
      imageUrl:
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=60',
      featured: false,
      eventId: eventGratis1.id,
    },
  ];

  for (const item of galleryItems) {
    const existing = await prisma.gallery.findFirst({
      where: { imageUrl: item.imageUrl },
    });
    if (!existing) {
      await prisma.gallery.create({ data: item });
    }
  }

  // 6. Seed Article Categories & Articles
  console.log('  - Seeding article categories & articles...');
  let catTips = await prisma.articleCategory.findFirst({
    where: { name: 'Tips & Trik' },
  });
  if (!catTips) {
    catTips = await prisma.articleCategory.create({
      data: { name: 'Tips & Trik' },
    });
  }

  let catNews = await prisma.articleCategory.findFirst({
    where: { name: 'Berita & Pengumuman' },
  });
  if (!catNews) {
    catNews = await prisma.articleCategory.create({
      data: { name: 'Berita & Pengumuman' },
    });
  }

  const articleExists = await prisma.article.findFirst({
    where: { title: 'Tips Menghadiri Seminar Hybrid di SITIVENT' },
  });

  if (!articleExists && adminId) {
    await prisma.article.create({
      data: {
        title: 'Tips Menghadiri Seminar Hybrid di SITIVENT',
        slug: 'tips-menghadiri-seminar-hybrid-di-sitivent',
        content:
          'Menghadiri seminar secara hybrid memerlukan persiapan baik dari segi teknis koneksi maupun kehadiran offline. Pastikan Anda memeriksa jenis tiket dan QR Code kehadiran Anda sebelum acara dimulai.',
        cover:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        createdById: adminId,
        articleCategories: {
          connect: [{ id: catTips.id }, { id: catNews.id }],
        },
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📋 Akun yang tersedia (semua password: "password"):');
  console.log('   super.admin@gmail.com        → superadmin');
  console.log('   panitia@gmail.com            → panitia');
  console.log('   scanner@gmail.com            → scanner');
  console.log('   peserta@gmail.com            → peserta');
  console.log('   peserta-berbayar@gmail.com   → peserta');
  console.log('   peserta-scan-1@gmail.com     → peserta');
  console.log('   peserta-scan-2@gmail.com     → peserta');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
