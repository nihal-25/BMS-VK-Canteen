import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyABcdxNFpCGpnYGs7OlOBRLMHYpvLRlDVs",
  authDomain: "vk-1-73a46.firebaseapp.com",
  projectId: "vk-1-73a46",
  storageBucket: "vk-1-73a46.appspot.com",
  messagingSenderId: "1023681488676",
  appId: "1:1023681488676:web:ce0aec35949ee092fd35b1",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Always initialize Auth manually (don't use getAuth here)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(app);

export { app, auth, firestore };
