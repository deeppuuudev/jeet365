<!-- firestore-setup.html -->
<script type="module">
  // 🔥 Import Firebase SDK modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  // ✅ Your Firebase Config (from jeet365-fabf2)
  const firebaseConfig = {
    apiKey: "AIzaSyAhp9goPQy1g4JQh_Jw0lc3mHv8dWqCy1Q",
    authDomain: "jeet365-fabf2.firebaseapp.com",
    projectId: "jeet365-fabf2",
    storageBucket: "jeet365-fabf2.appspot.com",
    messagingSenderId: "254181142456",
    appId: "1:254181142456:web:283c3abe5a76c71bd0294d",
    measurementId: "G-7P3Z0M8995"
  };

  // 🔥 Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // ✅ Function: Create Sample Data Structure
  async function setupFirestoreStructure() {
    // ✅ Create a sample user (manually)
    const userId = "sampleUser123";
    await setDoc(doc(db, "users", userId), {
      email: "sample@example.com",
      coins: 100,
      joinedAt: new Date(),
      isAdmin: false
    });

    // ✅ Create a sample game result
    const roundId = Date.now().toString(); // unique round ID
    await setDoc(doc(db, "gameResults", roundId), {
      colorResult: "red",
      numberResult: 5,
      createdAt: new Date()
    });

    // ✅ Create a sample bet
    await setDoc(doc(db, "bets", "sampleBet1"), {
      userId: userId,
      type: "color",
      choice: "red",
      amount: 50,
      status: "pending",
      round: roundId,
      createdAt: new Date()
    });

    // ✅ Create a sample request
    await setDoc(doc(db, "requests", "sampleRequest1"), {
      userId: userId,
      type: "deposit",
      amount: 200,
      status: "pending",
      upi: "sample@upi",
      timestamp: new Date()
    });

    alert("✅ Firestore structure created with sample data!");
  }

  // 🚀 Run setup
  setupFirestoreStructure();
</script>
