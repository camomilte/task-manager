// Import Firebase functions and services
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, persistentLocalCache, persistentMultipleTabManager, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID
};

// Initialize the Firebase app only if it hasn't already been initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache for offline support and multi-tab sync
let db; 

try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
            cacheSizeBytes: CACHE_SIZE_UNLIMITED
        })
    });
} catch (error) {
    // Fallback to regular Firestore if local caching fails
    console.warn('IndexedDB cache deactivated: ', error.code);
    db = getFirestore(app);
};

// Initialize Firebase Authentication and Firebase Storage
const auth = getAuth(app);
const storage = getStorage(app);

// Export initialized services
export {
    db,
    auth,
    storage
};