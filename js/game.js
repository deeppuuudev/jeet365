// game.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBo47HJZAcS8nCEyntKPAJLeJg_zUTo1nw",
  authDomain: "jeet365-e0749.firebaseapp.com",
  projectId: "jeet365-e0749",
  storageBucket: "jeet365-e0749.appspot.com",
  messagingSenderId: "856388622116",
  appId: "1:856388622116:web:f2313da855969554e405b1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;
let userCoins = 0;

// Countdown timer
let countdown = 30;
const countdownEl = document.getElementById("countdown");
const gameResult = document.getElementById("gameResult");

function startTimer() {
  countdown = 30;
  const interval = setInterval(() => {
    countdown--;
    countdownEl.innerText = countdown;
    if (countdown === 0) {
      clearInterval(interval);
      autoResult();
      setTimeout(startTimer, 5000); // restart after 5 seconds
    }
  }, 1000);
}

// Auto-generate result with 80% loss, 20% win
function autoResult() {
  const colors = ["Red", "Green", "Violet"];
  const resultColor = Math.random() < 0.2 ? lastBetColor : colors[Math.floor(Math.random() * 3)];
  showResult(resultColor);
}

let lastBetColor = null;
let lastBetAmount = 0;

// Place Bet
window.placeBet = async function(color) {
  const amount = parseInt(document.getElementById("betAmount").value);
  if (amount < 10) return alert("Minimum bet is 10 coins.");
  if (amount > userCoins) return alert("Not enough coins.");

  lastBetColor = color;
  lastBetAmount = amount;

  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, {
    coins: userCoins - amount
  });

  userCoins -= amount;
  document.getElementById("userCoins").innerText = userCoins;
  gameResult.innerHTML = `You bet ${amount} coins on <b>${color}</b>. Waiting for result...`;
}

// Show result & update win/lose
async function showResult(resultColor) {
  gameResult.innerHTML = `Result: <b style="color:${resultColor.toLowerCase()}">${resultColor}</b><br/>`;
  if (lastBetColor === resultColor) {
    const winAmount = lastBetAmount * 2;
    userCoins += winAmount;
    gameResult.innerHTML += `You won 🎉 +${winAmount} coins!`;
  } else {
    gameResult.innerHTML += `You lost 😢`;
  }

  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, {
    coins: userCoins
  });

  document.getElementById("userCoins").innerText = userCoins;
}

// Auth check and fetch coins
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      userCoins = data.coins || 0;
      document.getElementById("userCoins").innerText = userCoins;
    }
    startTimer();
  } else {
    window.location.href = "login.html";
  }
});
