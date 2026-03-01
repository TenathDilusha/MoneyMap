import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbhb56zO-lzzWuIn2WtaYG12ZI-h2DyIE",
  authDomain: "moneymap-3c311.firebaseapp.com",
  projectId: "moneymap-3c311",
  storageBucket: "moneymap-3c311.firebasestorage.app",
  messagingSenderId: "907239962319",
  appId: "1:907239962319:web:41e5e84ab4a1c2d79b29ba",
  measurementId: "G-RWXZ6MR0XE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();