// color.js let timeLeft = 30; let timerInterval; let selectedColor = ''; let selectedNumber = ''; const msg = document.getElementById('message'); const resultsList = document.getElementById('resultsList');

const ng = document.getElementById('numberGrid'); for (let i = 0; i < 10; i++) { const div = document.createElement('div'); div.className = 'number-box'; div.innerText = i; div.onclick = () => { document.querySelectorAll('.number-box').forEach(b=>b.classList.remove('selected')); div.classList.add('selected'); selectedNumber = i; }; ng.appendChild(div); }

auth.onAuthStateChanged(u => { if (!u) location.href = 'login.html'; else startTimer(); });

function startTimer() { timerInterval = setInterval(() => { timeLeft--; document.getElementById('timer').innerText = timeLeft; if (timeLeft <= 0) { clearInterval(timerInterval); settleRound(); } }, 1000); }

window.selectColor = c => { selectedColor = c; msg.innerText = Selected color: ${c}; };

async function placeBet(){ const amt = parseInt(document.getElementById('betAmount').value); const user = auth.currentUser; if (!user) return msg.innerText = 'Login first!'; if (!selectedColor && selectedNumber === '') return msg.innerText = 'Pick color or number'; if (isNaN(amt) || amt < 10) return msg.innerText = 'Enter min 10 coins';

const userRef = db.collection('users').doc(user.uid); const doc = await userRef.get(); const coins = doc.exists ? doc.data().coins : 0; if (coins < amt) return msg.innerText = 'Not enough coins';

await userRef.update({ coins: coins - amt }); await db.collection('colorBets').add({ uid: user.uid, email: user.email, color: selectedColor||null, number: typeof selectedNumber==='number'?selectedNumber:null, bet: amt, result: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp() });

msg.innerText = '✅ Bet Placed!'; selectedColor=''; selectedNumber=''; document.getElementById('betAmount').value=''; }

async function settleRound(){ const colors = ['red','green','violet']; const winColor = colors[Math.floor(Math.random()*3)]; const winNumber = Math.floor(Math.random()*10);

const col = await db.collection('colorBets').where('result','==','pending').get(); const batch = db.batch(); col.docs.forEach(docSnap => { const data = docSnap.data(); const docRef = docSnap.ref; let won = false; let winAmt = 0; if (data.color && data.color === winColor) { won = true; winAmt = data.bet * 2; } else if (data.number!==null && data.number === winNumber) { won = true; winAmt = data.bet * 8; } if (won) { batch.update(docRef, { result: 'win' }); batch.update(db.collection('users').doc(data.uid), { coins: firebase.firestore.FieldValue.increment(winAmt) }); } else { batch.update(docRef, { result: 'lose' }); } }); await batch.commit();

const resDiv = document.createElement('div'); resDiv.className = 'result-entry'; resDiv.innerText = Result → Color: ${winColor.toUpperCase()}, Number: ${winNumber}; resultsList.prepend(resDiv);

timeLeft = 30; startTimer(); }

(function genFake(){ const fake = ['UserA','UserB','UserC','Test123','PlayerX']; for(let i=0;i<10;i++){ const rd = fake[Math.floor(Math.random()*fake.length)]; const c = ['RED','GREEN','VIOLET'][Math.floor(Math.random()*3)]; const n = Math.floor(Math.random()*10); const d = document.createElement('div'); d.className='result-entry'; d.innerText = ${rd}: ${c}, Num: ${n}; resultsList.appendChild(d); } })();

window.logout = () => auth.signOut().then(()=>location.href='login.html');

