/**
 * One-time script to create the admin user in Firebase Auth
 * and set their role to ADMIN in the database.
 * 
 * Usage: npx tsx scripts/create-admin.ts
 */
import * as admin from 'firebase-admin';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

async function main() {
  const email = 'mafrubai@gmail.com';
  const password = 'admin696969';

  console.log(`\n🔥 Creating/updating admin user: ${email}\n`);

  // Step 1: Create or get Firebase user
  let fbUser;
  try {
    fbUser = await admin.auth().getUserByEmail(email);
    console.log(`✅ Firebase user already exists: ${fbUser.uid}`);
    // Update password in case it changed
    await admin.auth().updateUser(fbUser.uid, { password });
    console.log(`✅ Firebase password updated.`);
  } catch {
    fbUser = await admin.auth().createUser({
      email,
      password,
      displayName: 'Admin',
    });
    console.log(`✅ Firebase user created: ${fbUser.uid}`);
  }

  // Step 2: Upsert in database with ADMIN role
  const dbUser = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      firebaseUid: fbUser.uid,
    },
    create: {
      email,
      name: 'Admin',
      phone: '',
      firebaseUid: fbUser.uid,
      role: 'ADMIN',
      ageVerified: true,
      termsAccepted: true,
    },
  });

  console.log(`✅ Database user set to ADMIN: ${dbUser.email} (id: ${dbUser.id})`);
  console.log(`\n🎉 Done! You can now log in with:`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}\n`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  prisma.$disconnect();
  process.exit(1);
});
