// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
// Optional: Analytics
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo47HJZAcS8nCEyntKPAJLeJg_zUTo1nw",
  authDomain: "jeet365-e0749.firebaseapp.com",
  projectId: "jeet365-e0749",
  storageBucket: "jeet365-e0749.firebasestorage.app",
  messagingSenderId: "856388622116",
  appId: "1:856388622116:web:f2313da855969554e405b1",
  measurementId: "G-EH0F3Q96F5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export
export { auth, db };
