import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAhp9goPQy1g4JQh_Jw0lc3mHv8dWqCy1Q",
  authDomain: "jeet365-fabf2.firebaseapp.com",
  projectId: "jeet365-fabf2",
  storageBucket: "jeet365-fabf2.appspot.com",
  messagingSenderId: "254181142456",
  appId: "1:254181142456:web:283c3abe5a76c71bd0294d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;
let userCoins = 0;
let currentBet = null;
let timerInterval;
let countdown = 30;

const coinsDisplay = document.getElementById("userCoins");
const countdownDisplay = document.getElementById("countdown");
const gameResult = document.getElementById("gameResult");
const betInput = document.getElementById("betAmount");
const buttons = document.querySelectorAll(".color-buttons button");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    await loadUserCoins();
    startGameLoop();
    loadLastResults();
  } else {
    alert("Please login first.");
    window.location.href = "login.html";
  }
});

async function loadUserCoins() {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    userCoins = docSnap.data().coins || 0;
    coinsDisplay.textContent = userCoins;
  }
}

function disableButtons(disable = true) {
  buttons.forEach(btn => btn.disabled = disable);
}

function getRandomColor() {
  const colors = ["Red", "Green", "Violet"];
  const lossChance = Math.random();
  return lossChance < 0.8 ? colors[Math.floor(Math.random() * colors.length)] : currentBet?.color || colors[0];
}

function placeBet(color) {
  const amount = parseInt(betInput.value);
  if (amount < 10 || isNaN(amount)) {
    alert("Minimum 10 coins required to play.");
    return;
  }

  if (userCoins < amount) {
    alert("Not enough coins.");
    return;
  }

  if (currentBet) {
    alert("Bet already placed for this round.");
    return;
  }

  currentBet = { color, amount };
  disableButtons(true);
  gameResult.textContent = `You bet ${amount} on ${color}`;
}

function updateCountdownUI() {
  countdownDisplay.textContent = countdown;
}

function startGameLoop() {
  timerInterval = setInterval(async () => {
    countdown--;

    updateCountdownUI();

    if (countdown === 0) {
      disableButtons(true);
      await resolveGame();
      countdown = 30;
      currentBet = null;
    }

    if (countdown <= 25 && !currentBet) {
      disableButtons(false);
    }

  }, 1000);
}

async function resolveGame() {
  const resultColor = getRandomColor();
  let win = false;

  if (currentBet && currentBet.color === resultColor) {
    userCoins += currentBet.amount * 2;
    win = true;
    gameResult.innerHTML = `<span style="color:green;">You WON! Result: ${resultColor}</span>`;
  } else if (currentBet) {
    userCoins -= currentBet.amount;
    gameResult.innerHTML = `<span style="color:red;">You LOST! Result: ${resultColor}</span>`;
  } else {
    gameResult.innerHTML = `<span style="color:orange;">No Bet! Result: ${resultColor}</span>`;
  }

  coinsDisplay.textContent = userCoins;

  // Save user coins
  await updateDoc(doc(db, "users", userId), { coins: userCoins });

  // Save game result
  await addDoc(collection(db, "rounds"), {
    result: resultColor,
    createdAt: new Date()
  });

  loadLastResults();
}

async function loadLastResults() {
  const roundsRef = collection(db, "rounds");
  const q = query(roundsRef, orderBy("createdAt", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  let historyHTML = "<h3>Last 10 Results:</h3>";
  querySnapshot.forEach(doc => {
    const data = doc.data();
    historyHTML += `<p>${data.result} - ${new Date(data.createdAt.toDate()).toLocaleTimeString()}</p>`;
  });
document.getElementById("gameHistory").innerHTML = historyHTML;
  document.getElementById("gameResult").innerHTML += historyHTML;
  }
