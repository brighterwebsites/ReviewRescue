/**
 * Migration script to assign existing businesses to a default admin user
 *
 * Run this script after deploying the auth schema to assign all existing
 * businesses to a default admin account.
 *
 * Usage:
 *   npx ts-node scripts/migrate-businesses.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting business migration...');

  // Check if there are any businesses without a userId
  const orphanedBusinesses = await prisma.business.findMany({
    where: {
      OR: [
        { userId: null },
        { userId: '' }
      ]
    }
  });

  if (orphanedBusinesses.length === 0) {
    console.log('✅ No businesses need migration. All businesses are assigned to users.');
    return;
  }

  console.log(`📊 Found ${orphanedBusinesses.length} businesses without a user.`);

  // Create or find the default admin user
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@reviewrescue.com';
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMe123!';
  const defaultName = 'Admin User';

  let adminUser = await prisma.user.findUnique({
    where: { email: defaultEmail }
  });

  if (!adminUser) {
    console.log(`👤 Creating default admin user: ${defaultEmail}`);
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    adminUser = await prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: defaultName,
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    });

    console.log('✅ Default admin user created');
    console.log(`📧 Email: ${defaultEmail}`);
    console.log(`🔑 Password: ${defaultPassword}`);
    console.log('⚠️  IMPORTANT: Change this password after first login!');
  } else {
    console.log(`✅ Using existing admin user: ${defaultEmail}`);
  }

  // Assign all orphaned businesses to the admin user
  console.log(`🔗 Assigning ${orphanedBusinesses.length} businesses to admin user...`);

  const result = await prisma.business.updateMany({
    where: {
      OR: [
        { userId: null },
        { userId: '' }
      ]
    },
    data: {
      userId: adminUser.id
    }
  });

  console.log(`✅ Successfully assigned ${result.count} businesses to admin user`);
  console.log('🎉 Migration complete!');
}

main()
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
