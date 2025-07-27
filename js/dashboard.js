import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userName = document.getElementById("userName");
const userCoins = document.getElementById("userCoins");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      userName.innerText = user.email;
      userCoins.innerText = data.coins || 0;
    } else {
      userName.innerText = "No data";
      userCoins.innerText = 0;
    }
  } else {
    window.location.href = "login.html";
  }
});

function logout() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}
window.logout = logout;
