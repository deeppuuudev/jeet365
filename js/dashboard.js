// ✅ Firebase Auth State Check
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userId = user.uid;

    try {
      const doc = await db.collection("users").doc(userId).get();
      if (doc.exists) {
        const userData = doc.data();
        document.getElementById("userName").textContent = userData.name || user.email;
        document.getElementById("userCoins").textContent = userData.coins ?? 0;
      } else {
        document.getElementById("userName").textContent = "Unknown User";
        document.getElementById("userCoins").textContent = "0";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

  } else {
    // 🔒 User not logged in → redirect to login
    window.location.href = "login.html";
  }
});

// 🚪 Logout Function
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout Error:", error);
  });
}
