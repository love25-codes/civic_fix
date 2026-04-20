import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABxf2A8VaEelMUuBB0F_pM1CXHYO7-4ic",
  authDomain: "civic-fix-20457.firebaseapp.com",
  projectId: "civic-fix-20457",
  storageBucket: "civic-fix-20457.firebasestorage.app",
  messagingSenderId: "216216740251",
  appId: "1:216216740251:web:e8beb46f7937401c5b813e"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);