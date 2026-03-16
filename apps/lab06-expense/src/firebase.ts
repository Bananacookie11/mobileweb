import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAi1HLGaW_bXOlo7MqUh4oFz8FxYBEPqug",
  authDomain: "lab06-expense-33286.firebaseapp.com",
  projectId: "lab06-expense-33286",
  storageBucket: "lab06-expense-33286.firebasestorage.app",
  messagingSenderId: "613705045109",
  appId: "1:613705045109:web:80e367cc97d1e366e7143c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);