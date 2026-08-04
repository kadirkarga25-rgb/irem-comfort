import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, doc, getDoc, setDoc, onSnapshot, 
  collection, getDocs, deleteDoc, updateDoc 
} from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyBv8pbgdd7p6mEAXyxKyKW071wDbG8Ews",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "irem-comfort.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "irem-comfort",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "irem-comfort.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "77442925908",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:77442925908:web:3836ae13b3be174e6b74c1",
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_DATABASE_ID || undefined
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

export async function uploadBase64Image(dataUrl: string, folder: string = "site_images"): Promise<string> {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith("data:image/")) {
    return dataUrl;
  }
  try {
    const mimeTypeMatch = dataUrl.match(/data:(image\/[a-zA-Z0-9\+\-\.]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    const ext = mimeType.split('/')[1] || 'jpg';
    const filename = `${folder}/${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storageRef = ref(storage, filename);
    await uploadString(storageRef, dataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err) {
    console.warn("Firebase Storage upload error, returning original image URL:", err);
    return dataUrl;
  }
}

export { doc, getDoc, setDoc, onSnapshot, collection, getDocs, deleteDoc, updateDoc };



