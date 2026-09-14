import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import appletConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: appletConfig.apiKey || env.VITE_FIREBASE_API_KEY || '',
  authDomain: appletConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: appletConfig.projectId || env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: appletConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: appletConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: appletConfig.appId || env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    const customDbId = (appletConfig as any).firestoreDatabaseId;
    if (customDbId) {
      db = getFirestore(app, customDbId);
    } else {
      db = getFirestore(app);
    }
    storage = getStorage(app);

    // Initial connection test
    if (db) {
      getDocFromServer(doc(db, 'test', 'connection')).catch((err) => {
        if (err instanceof Error && err.message.includes('the client is offline')) {
          console.warn('Firebase client is offline, using local store sync');
        }
      });
    }
  } catch (error) {
    console.warn('Firebase initialization error, fallback to local store:', error);
  }
}

export { app, auth, db, storage };

