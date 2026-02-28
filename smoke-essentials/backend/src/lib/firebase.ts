import * as admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath))
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const firebaseAdmin = admin;
