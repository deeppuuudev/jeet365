document.addEventListener("DOMContentLoaded", function () {
  const userName = document.getElementById("userName");
  const userCoins = document.getElementById("userCoins");

  auth.onAuthStateChanged(function (user) {
    if (!user) {
      window.location.href = "login.html";
    } else {
      const uid = user.uid;
      const userRef = db.collection("users").doc(uid);

      userRef.onSnapshot(function (doc) {
        if (doc.exists) {
          const data = doc.data();
          userName.textContent = data.name || user.email;
          userCoins.textContent = data.coins !== undefined ? data.coins : "0";
        } else {
          userName.textContent = "No data";
          userCoins.textContent = "0";
        }
      }, function (error) {
        console.error("Error fetching user data:", error);
      });
    }
  });

  window.logout = function () {
    auth.signOut().then(function () {
      window.location.href = "login.html";
    }).catch(function (error) {
      console.error("Logout Error:", error);
    });
  };
});
