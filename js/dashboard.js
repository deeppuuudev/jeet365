// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBo47HJZAcS8nCEyntKPAJLeJg_zUTo1nw",
  authDomain: "jeet365-e0749.firebaseapp.com",
  projectId: "jeet365-e0749",
  storageBucket: "jeet365-e0749.appspot.com",
  messagingSenderId: "856388622116",
  appId: "1:856388622116:web:f2313da855969554e405b1",
  measurementId: "G-EH0F3Q96F5"
};

// Init services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const userEmail = document.getElementById("userEmail");
const userCoins = document.getElementById("userCoins");
const logoutBtn = document.getElementById("logoutBtn");

// Check auth status
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmail.innerText = user.email;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      userCoins.innerText = data.coins || 0;
    } else {
      userCoins.innerText = "0";
    }
  } else {
    window.location.href = "login.html";
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
