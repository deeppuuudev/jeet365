// js/withdraw.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const withdrawForm = document.getElementById("withdrawForm");

onAuthStateChanged(auth, (user) => {
  if (user) {
    withdrawForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = document.getElementById("amount").value;
      const upi = document.getElementById("upi").value;
      const note = document.getElementById("note").value;

      if (!amount || !upi) {
        alert("Please fill all required fields.");
        return;
      }

      try {
        await addDoc(collection(db, "withdraw-requests"), {
          email: user.email,
          amount: parseInt(amount),
          upi: upi,
          note: note || "",
          status: "pending",
          timestamp: new Date()
        });

        alert("Withdraw request submitted!");
        withdrawForm.reset();
      } catch (error) {
        console.error("Error:", error);
        alert("Error submitting withdraw request.");
      }
    });
  } else {
    alert("Please login to withdraw.");
    window.location.href = "login.html";
  }
});
