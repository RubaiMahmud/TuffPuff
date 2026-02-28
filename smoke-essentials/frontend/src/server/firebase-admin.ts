import * as admin from 'firebase-admin';

const globalForFirebase = globalThis as unknown as { firebaseAdmin: typeof admin };

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  } else {
    console.warn('Firebase Admin SDK credentials not fully configured');
  }
}

export const firebaseAdmin = globalForFirebase.firebaseAdmin || admin;
if (process.env.NODE_ENV !== 'production') {
  globalForFirebase.firebaseAdmin = firebaseAdmin;
}
