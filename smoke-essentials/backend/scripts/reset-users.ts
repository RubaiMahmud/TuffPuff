import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Firebase
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} else {
  console.log('No serviceAccountKey.json found. You must run this locally where the key exists.');
  process.exit(1);
}

async function resetUsers() {
  console.log('🚨 Starting full user database reset...');

  try {
    // 1. Delete all users from PostgreSQL Database
    console.log('🗑️ Deleting all users from Supabase/PostgreSQL...');
    const deletedPostgres = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deletedPostgres.count} users from PostgreSQL.`);

    // 2. Delete all users from Firebase Auth
    console.log('🔥 Fetching users from Firebase Auth...');
    const listUsersResult = await admin.auth().listUsers(1000);
    const uids = listUsersResult.users.map((userRecord) => userRecord.uid);

    if (uids.length > 0) {
      console.log(`🗑️ Deleting ${uids.length} users from Firebase Auth...`);
      const deleteResult = await admin.auth().deleteUsers(uids);
      console.log(`✅ Successfully deleted ${deleteResult.successCount} users from Firebase.`);
      if (deleteResult.failureCount > 0) {
        console.error(`❌ Failed to delete ${deleteResult.failureCount} users from Firebase.`);
        deleteResult.errors.forEach((err) => console.error(err.error.toJSON()));
      }
    } else {
      console.log('✅ No users found in Firebase to delete.');
    }

    console.log('🎉 Reset complete! The databases are completely empty.');

  } catch (error) {
    console.error('❌ Fatal error during reset:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

resetUsers();
