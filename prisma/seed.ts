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

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {
      description: 'Super Administrator dengan akses penuh ke seluruh sistem',
    },
    create: {
      name: 'superadmin',
      description: 'Super Administrator dengan akses penuh ke seluruh sistem',
      permissions: {
        connect: allPermissionNames.map((name) => ({ name })),
      },
    },
  });

  const pesertaRole = await prisma.role.upsert({
    where: { name: 'peserta' },
    update: {
      description: 'Peserta dengan akses pendaftaran dan sertifikat',
    },
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
    password = 'Password123',
    roleName?: string
  ) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    let userId = existing?.id;

    if (!existing) {
      console.log(`  - Creating user: ${email}...`);
      try {
        // @ts-ignore
        const result = await auth.api.createUser({
          body: {
            email,
            password,
            name,
          },
        });
        if (result && result.user) {
          userId = result.user.id;
        }
      } catch (err: any) {
        console.error(
          `❌ Error creating user ${email} via Better Auth:`,
          JSON.stringify(err, null, 2)
        );
        throw err;
      }
    } else {
      // Check if account already exists
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: existing.id,
          providerId: 'credential',
        },
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
        if (role) {
          data.roles = {
            connect: { id: role.id },
          };
        }
      }
      await prisma.user.update({
        where: { id: userId },
        data,
      });
    }

    return userId;
  }

  // Seed Users
  const adminId = await seedUser('super.admin@gmail.com', 'Super Admin', 'password', 'superadmin');
  const pesertaId = await seedUser(
    'peserta@gmail.com',
    'Peserta Mandiri',
    'Password123',
    'peserta'
  );
  const scanParticipant1Id = await seedUser(
    'peserta-scan-1@gmail.com',
    'Peserta Scan 1',
    'Password123',
    'peserta'
  );
  const scanParticipant2Id = await seedUser(
    'peserta-scan-2@gmail.com',
    'Peserta Scan 2',
    'Password123',
    'peserta'
  );

  // 4. Seed Events
  console.log('  - Seeding events...');
  const eventGratis1 = await prisma.event.upsert({
    where: { slug: 'event-gratis-1' },
    update: {},
    create: {
      title: 'Event Gratis 1',
      slug: 'event-gratis-1',
      description: 'Ini adalah deskripsi Event Gratis 1.',
      eventType: 'OFFLINE',
      location: 'Gedung Serbaguna',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-10'),
      startTime: '09:00',
      endTime: '12:00',
      registrationDeadline: new Date('2026-10-09'),
      quota: 100,
      price: 0,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
    },
  });

  const eventGratis2 = await prisma.event.upsert({
    where: { slug: 'event-gratis-2' },
    update: {},
    create: {
      title: 'Event Gratis 2',
      slug: 'event-gratis-2',
      description: 'Ini adalah deskripsi Event Gratis 2.',
      eventType: 'OFFLINE',
      location: 'Gedung Serbaguna B',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-15'),
      startTime: '13:00',
      endTime: '16:00',
      registrationDeadline: new Date('2026-10-14'),
      quota: 100,
      price: 0,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
    },
  });

  const eventBerbayar1 = await prisma.event.upsert({
    where: { slug: 'event-berbayar-1' },
    update: {},
    create: {
      title: 'Event Berbayar 1',
      slug: 'event-berbayar-1',
      description: 'Ini adalah deskripsi Event Berbayar 1.',
      eventType: 'OFFLINE',
      location: 'Auditorium Utama',
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-10-20'),
      startTime: '09:00',
      endTime: '15:00',
      registrationDeadline: new Date('2026-10-19'),
      quota: 50,
      price: 100000,
      status: 'PUBLISHED',
      certificateEnabled: true,
      publishedAt: new Date(),
    },
  });

  // 5. Seed Registrations
  console.log('  - Seeding registrations...');

  if (scanParticipant1Id) {
    await prisma.registration.upsert({
      where: { registrationNumber: 'REG-SCAN-1' },
      update: {},
      create: {
        registrationNumber: 'REG-SCAN-1',
        eventId: eventGratis1.id,
        userId: scanParticipant1Id,
        qrToken: 'valid-token-12345',
        status: 'REGISTERED',
      },
    });
  }

  if (scanParticipant2Id) {
    const reg2 = await prisma.registration.upsert({
      where: { registrationNumber: 'REG-SCAN-2' },
      update: {},
      create: {
        registrationNumber: 'REG-SCAN-2',
        eventId: eventGratis1.id,
        userId: scanParticipant2Id,
        qrToken: 'used-token-99999',
        status: 'CHECKED_IN',
      },
    });

    // Create attendance record for the already checked in user
    const existingAttendance = await prisma.attendance.findFirst({
      where: { registrationId: reg2.id },
    });

    if (!existingAttendance) {
      await prisma.attendance.create({
        data: {
          registrationId: reg2.id,
          status: 'SUCCESS',
          scanTime: new Date(),
          scannerId: adminId || null,
        },
      });
    }
  }

  if (pesertaId) {
    // Seed pre-registered but not checked-in status for event-gratis-2 (blocked cert test)
    await prisma.registration.upsert({
      where: { registrationNumber: 'REG-PESERTA-GRATIS-2' },
      update: {},
      create: {
        registrationNumber: 'REG-PESERTA-GRATIS-2',
        eventId: eventGratis2.id,
        userId: pesertaId,
        qrToken: 'cert-blocked-token-888',
        status: 'REGISTERED',
      },
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
