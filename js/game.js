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
let lastBetColor = null;
let lastBetAmount = 0;
let countdown = 30;
let countdownInterval;

const countdownEl = document.getElementById("countdown");
const gameResult = document.getElementById("gameResult");
const userCoinsEl = document.getElementById("userCoins");

// Start game timer
function startTimer() {
  clearInterval(countdownInterval); // Clear any existing timer
  countdown = 30;
  countdownEl.innerText = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    countdownEl.innerText = countdown;
    if (countdown === 0) {
      clearInterval(countdownInterval);
      autoResult();
      setTimeout(startTimer, 5000); // 5s break between rounds
    }
  }, 1000);
}

// Generate result with 80% lose, 20% win
function autoResult() {
  const colors = ["Red", "Green", "Violet"];

  let resultColor;

  if (lastBetColor && Math.random() < 0.2) {
    // 20% chance of win (give same color as bet)
    resultColor = lastBetColor;
  } else {
    // 80% chance of random color (mostly lose)
    const filtered = colors.filter(c => c !== lastBetColor);
    resultColor = filtered[Math.floor(Math.random() * filtered.length)];
  }

  showResult(resultColor);
}

// Handle Bet
window.placeBet = async function (color) {
  const amount = parseInt(document.getElementById("betAmount").value);

  if (!amount || isNaN(amount)) {
    return alert("Please enter a valid bet amount.");
  }
  if (amount < 10) {
    return alert("Minimum bet is 10 coins.");
  }
  if (amount > userCoins) {
    return alert("You do not have enough coins.");
  }

  lastBetColor = color;
  lastBetAmount = amount;

  try {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      coins: userCoins - amount
    });
    userCoins -= amount;
    userCoinsEl.innerText = userCoins;
    gameResult.innerHTML = `You bet ${amount} coins on <b>${color}</b>. Waiting for result...`;
  } catch (error) {
    alert("Error placing bet. Try again.");
    console.error(error);
  }
}

// Show Game Result
async function showResult(resultColor) {
  gameResult.innerHTML = `Result: <b style="color:${resultColor.toLowerCase()}">${resultColor}</b><br/>`;

  if (lastBetColor === resultColor) {
    const winAmount = lastBetAmount * 2;
    userCoins += winAmount;
    gameResult.innerHTML += `You won 🎉 +${winAmount} coins!`;
  } else {
    gameResult.innerHTML += `You lost 😢`;
  }

  try {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      coins: userCoins
    });
    userCoinsEl.innerText = userCoins;
  } catch (error) {
    alert("Failed to update coins.");
    console.error(error);
  }

  // Reset bet values
  lastBetColor = null;
  lastBetAmount = 0;
}

// Auth check and user coin fetch
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        userCoins = data.coins || 0;
        userCoinsEl.innerText = userCoins;
      } else {
        // New user fallback
        await updateDoc(userRef, { coins: 100 }); // Optional default
        userCoins = 100;
        userCoinsEl.innerText = 100;
      }

      startTimer(); // Start game loop
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    window.location.href = "login.html";
  }
});
