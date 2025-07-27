// game.js

let currentUser;
let userCoins = 0;
let gameInterval;
let countdown = 30;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    getUserCoins();
    startGameTimer();
  } else {
    window.location.href = "login.html";
  }
});

// Get user coins
function getUserCoins() {
  firebase.firestore().collection("users").doc(currentUser.uid).get()
    .then(doc => {
      userCoins = doc.data().coins || 0;
      document.getElementById("coinBalance").innerText = userCoins;
    });
}

// Start 30-sec game timer
function startGameTimer() {
  updateTimerDisplay();
  gameInterval = setInterval(() => {
    countdown--;
    updateTimerDisplay();

    if (countdown <= 0) {
      clearInterval(gameInterval);
      showGameResult();
      countdown = 30;
      setTimeout(() => {
        resetSelections();
        startGameTimer();
      }, 5000);
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById("timer").innerText = `${countdown}s`;
}

// Place Bet
document.getElementById("betBtn").addEventListener("click", () => {
  const selectedColor = document.querySelector('input[name="color"]:checked')?.value;
  const selectedNumber = document.querySelector('input[name="number"]:checked')?.value;
  const betAmount = parseInt(document.getElementById("betAmount").value);

  if ((!selectedColor && !selectedNumber) || isNaN(betAmount) || betAmount < 10) {
    alert("Select a color or number and enter minimum 10 coins to bet.");
    return;
  }

  if (userCoins < betAmount) {
    alert("Not enough coins.");
    return;
  }

  // Deduct coins
  userCoins -= betAmount;
  updateCoinsInFirestore(userCoins);
  document.getElementById("coinBalance").innerText = userCoins;

  // Store bet temporarily
  sessionStorage.setItem("bet", JSON.stringify({
    type: selectedColor ? "color" : "number",
    value: selectedColor || selectedNumber,
    amount: betAmount
  }));

  document.getElementById("betStatus").innerText = "Bet placed!";
});

// Show game result
function showGameResult() {
  const resultColor = getRandomColor();
  const resultNumber = getRandomNumber();
  const bet = JSON.parse(sessionStorage.getItem("bet"));

  document.getElementById("gameResult").innerHTML = `
    Result Color: <b>${resultColor}</b><br>
    Result Number: <b>${resultNumber}</b>
  `;

  // Check win
  if (bet) {
    let win = false;
    let reward = 0;

    if (bet.type === "color" && bet.value === resultColor) {
      win = true;
      reward = bet.amount * 2;
    } else if (bet.type === "number" && bet.value === resultNumber.toString()) {
      win = true;
      reward = bet.amount * 8;
    }

    if (win) {
      userCoins += reward;
      updateCoinsInFirestore(userCoins);
      document.getElementById("betStatus").innerText = `You won! +${reward} coins`;
    } else {
      document.getElementById("betStatus").innerText = `You lost!`;
    }

    sessionStorage.removeItem("bet");
    document.getElementById("coinBalance").innerText = userCoins;
  }
}

// Update coins in Firestore
function updateCoinsInFirestore(newCoins) {
  firebase.firestore().collection("users").doc(currentUser.uid).update({
    coins: newCoins
  });
}

// Logic to return 80% loss, 20% win
function getRandomColor() {
  const colors = ["Red", "Green", "Violet"];
  return Math.random() < 0.2 ? colors[Math.floor(Math.random() * 3)] : getLosingColor();
}

function getLosingColor() {
  const bet = JSON.parse(sessionStorage.getItem("bet"));
  const colors = ["Red", "Green", "Violet"];
  return colors.filter(c => c !== bet?.value)[Math.floor(Math.random() * 2)];
}

function getRandomNumber() {
  if (Math.random() < 0.2) {
    return parseInt(JSON.parse(sessionStorage.getItem("bet"))?.value || "0");
  } else {
    let wrong = Math.floor(Math.random() * 10);
    const betNum = parseInt(JSON.parse(sessionStorage.getItem("bet"))?.value);
    return (wrong === betNum) ? (wrong + 1) % 10 : wrong;
  }
}

function resetSelections() {
  document.querySelectorAll('input[name="color"], input[name="number"]').forEach(e => e.checked = false);
  document.getElementById("betAmount").value = "";
  document.getElementById("betStatus").innerText = "";
}
