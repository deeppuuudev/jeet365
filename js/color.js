// === color.js === import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig); const db = getFirestore(app); const auth = getAuth(app);

let currentUser; let countdown = 30; let interval; let gameId;

// Start countdown function startTimer() { clearInterval(interval); countdown = 30; interval = setInterval(() => { document.getElementById("countdown").innerText = countdown; if (countdown <= 0) { clearInterval(interval); declareResult(); setTimeout(startTimer, 5000); // Restart new round after 5s } countdown--; }, 1000); }

// Generate 80% loss 20% win result function getRandomResult(userBet = null) { const colors = ['red', 'green', 'violet']; if (!userBet || Math.random() <= 0.2) { return userBet || colors[Math.floor(Math.random() * colors.length)]; } return colors.find(c => c !== userBet); // Force loss }

// Place a bet window.placeBet = async function(color) { const amount = parseInt(document.getElementById("betAmount").value); if (isNaN(amount) || amount < 10) return alert("Minimum 10 coins required");

const userRef = doc(db, "users", currentUser.uid); const userSnap = await getDoc(userRef); const userData = userSnap.data();

if (userData.coins < amount) return alert("Not enough coins");

await updateDoc(userRef, { coins: userData.coins - amount });

await addDoc(collection(db, "color_bets"), { uid: currentUser.uid, email: currentUser.email, color, amount, gameId, timestamp: new Date() });

alert("Bet placed on " + color); };

// Declare result async function declareResult() { const q = query(collection(db, "color_bets"), orderBy("timestamp", "desc"), limit(50)); const snap = await onSnapshot(q, () => {});

let userBets = []; snap.docs.forEach(doc => { const bet = doc.data(); if (bet.gameId === gameId) { userBets.push({ id: doc.id, ...bet }); } });

const resultColor = getRandomResult(); await addDoc(collection(db, "color_results"), { gameId, resultColor, timestamp: new Date() });

document.getElementById("lastResult").innerText = resultColor.toUpperCase();

for (let bet of userBets) { if (bet.color === resultColor) { const userRef = doc(db, "users", bet.uid); const userSnap = await getDoc(userRef); const winAmount = (resultColor === 'violet') ? bet.amount * 4 : bet.amount * 2; await updateDoc(userRef, { coins: userSnap.data().coins + winAmount }); } }

gameId = "game_" + new Date().getTime(); }

// Auth check onAuthStateChanged(auth, async (user) => { if (user) { currentUser = user; gameId = "game_" + new Date().getTime(); const userRef = doc(db, "users", user.uid); const userSnap = await getDoc(userRef); document.getElementById("userCoins").innerText = Coins: ${userSnap.data().coins}; loadBetHistory(); startTimer(); } else { window.location.href = "login.html"; } });

// Bet history async function loadBetHistory() { const q = query(collection(db, "color_bets"), orderBy("timestamp", "desc"), limit(10)); const snap = await onSnapshot(q, () => {}); let html = ""; snap.docs.forEach(doc => { const bet = doc.data(); if (bet.uid === currentUser.uid) { html += <li>${bet.color} - ${bet.amount} coins</li>; } }); document.getElementById("historyList").innerHTML = html; }


