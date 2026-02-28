import * as admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Replace literal '\n' characters with actual line breaks for Vercel
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      // Production / Vercel: Use environment variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('Firebase Admin initialized successfully from ENVs');
    } else {
      // Local development: fallback to serviceAccountKey.json
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath))
      });
      console.log('Firebase Admin initialized successfully from local key file');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const firebaseAdmin = admin;
