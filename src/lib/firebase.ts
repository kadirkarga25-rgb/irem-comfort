import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBv8pbgdd7p6mEAXyxKyKW071wDbG8Ews",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "irem-comfort.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "irem-comfort",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "irem-comfort.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "77442925908",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:77442925908:web:3836ae13b3be174e6b74c1",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || undefined
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export { doc, getDoc, setDoc, onSnapshot };


