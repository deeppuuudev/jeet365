// firebase-config.js

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyBo47HJZAcS8nCEyntKPAJLeJg_zUTo1nw",
    authDomain: "jeet365-e0749.firebaseapp.com",
    databaseURL: "https://jeet365-e0749-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jeet365-e0749",
    storageBucket: "jeet365-e0749.appspot.com",
    messagingSenderId: "856388622116",
    appId: "1:856388622116:web:f2313da855969554e405b1",
    measurementId: "G-EH0F3Q96F5"
  };

  // 🔥 Initialize Firebase App
  firebase.initializeApp(firebaseConfig);
}

// ✅ Global Firebase Services (for use in all pages)
const auth = firebase.auth();
const db = firebase.firestore();
