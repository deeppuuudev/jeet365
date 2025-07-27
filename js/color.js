/ game.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Timer
let timeLeft = 30;
const timerDisplay = document.getElementById("timer");
let timer = setInterval(() => {
  timeLeft--;
  timerDisplay.innerText = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    generateResult();
    setTimeout(() => location.reload(), 3000); // reload for next round
  }
}, 1000);

let selectedColor = "";
let selectedNumber = "";

window.selectColor = (color) => {
  selectedColor = color;
  alert("Color selected: " + color);
};

window.selectNumber = (num) => {
  selectedNumber = num;
  alert("Number selected: " + num);
};

window.placeBet = async () => {
  const amount = parseInt(document.getElementById("betAmount").value);
  const user = auth.currentUser;
  if (!user) return alert("Login required");
  if (!selectedColor && selectedNumber === "") return alert("Choose a color or number");
  if (isNaN(amount) || amount < 10) return alert("Min bet is 10 coins");

  await addDoc(collection(db, "bets"), {
    uid: user.uid,
    color: selectedColor || null,
    number: selectedNumber !== "" ? selectedNumber : null,
    amount,
    time: Date.now()
  });
  alert("Bet placed!");
};

window.logout = () => signOut(auth).then(() => location.href = "login.html");

// Show last 20 fake results
const resultsList = document.getElementById("resultsList");
const fakeUsers = ["User123", "PlayerX", "Tester99", "Jeet007", "Lucky1"];
const colors = ["red", "green", "violet"];
const generateFakeResults = () => {
  for (let i = 0; i < 20; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const number = Math.floor(Math.random() * 10);
    const name = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const result = document.createElement("div");
    result.className = "result-entry";
    result.innerText = `${name}: Color - ${color}, Number - ${number}`;
    resultsList.appendChild(result);
  }
};
generateFakeResults();

// TODO: Add real results from Firebase later
const generateResult = async () => {
  const winColor = colors[Math.random() < 0.8 ? Math.floor(Math.random() * 3) : 1]; // 80% loss logic
  const winNumber = Math.floor(Math.random() * 10);
  const winText = document.createElement("div");
  winText.className = "result-entry";
  winText.innerText = `🔴 Result: Color - ${winColor}, Number - ${winNumber}`;
  resultsList.prepend(winText);
};
