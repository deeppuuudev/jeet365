// dashboard.js

// Ensure Firebase Config is already imported in your HTML via firebase-config.js
const auth = firebase.auth();
const db = firebase.firestore();

// DOM References
const userNameEl = document.getElementById("userName");
const userCoinsEl = document.getElementById("userCoins");

// On auth state change, fetch and display user document
auth.onAuthStateChanged((user) => {
  if (user) {
    const userRef = db.collection("users").doc(user.uid);

    userRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        userNameEl.textContent = data.name || user.email;
        userCoinsEl.textContent = data.coins != null ? data.coins : "0";
      } else {
        console.warn("User document not found.");
        userNameEl.textContent = user.email;
        userCoinsEl.textContent = "0";
      }
    }, (error) => {
      console.error("Error reading user data:", error);
    });
  } else {
    window.location.href = "login.html";
  }
});

// Logout function
window.logout = function() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch((err) => {
    console.error("Logout failed:", err);
  });
};
