// ✅ Debugging: Ensure Firebase SDK is Loaded
if (typeof firebase === "undefined") {
    console.error("❌ Firebase SDK not loaded! Check index.html script order.");
} else {
    console.log("✅ Firebase SDK loaded successfully!");
}

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};


// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("✅ Firebase initialized successfully!");

// ✅ Track Admin Login State
let isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM Loaded!");

    // 🔹 Select buttons
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const bookCylinderBtn = document.getElementById("bookCylinderBtn");
    const approveBookingBtn = document.getElementById("approveBookingBtn");
    const rejectBookingBtn = document.getElementById("rejectBookingBtn");

    function showMessage(message, type = "success") {
        console.log(`🔹 ${message}`);
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.innerText = message;
            statusMessage.className = type;
        }
    }

    // ✅ Register User
    if (registerBtn) {
        registerBtn.addEventListener("click", async () => {
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await db.collection("users").doc(userCredential.user.uid).set({
                    email: email,
                    barrelsRemaining: 12,
                    bookingHistory: []
                });
                showMessage("✅ Registration Successful!", "success");
            } catch (error) {
                showMessage(`❌ ${error.message}`, "error");
            }
        });
    }

    // ✅ User Login
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
                showMessage(`✅ Logged in as: ${email}`, "success");
            } catch (error) {
                showMessage(`❌ ${error.message}`, "error");
            }
        });
    }

    // ✅ Admin Login (Fix: Store Login State)
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener("click", () => {
            console.log("📌 Admin Login Button Clicked!");
            const email = document.getElementById("adminEmail").value;
            const password = document.getElementById("adminPassword").value;

            if (email === "admin@example.com" && password === "Admin@1234") {
                isAdminLoggedIn = true;
                localStorage.setItem("adminLoggedIn", "true"); // ✅ Store login state
                alert("✅ Admin Logged In Successfully!");
            } else {
                alert("❌ Invalid Admin Credentials");
            }
        });

        console.log("✅ Admin Login Event Listener Attached.");
    }

    // ✅ Book Cylinder
    if (bookCylinderBtn) {
        bookCylinderBtn.addEventListener("click", async () => {
            console.log("📌 'Book Now' Clicked!");

            const user = auth.currentUser;
            if (!user) {
                alert("❌ Please log in first!");
                return;
            }

            try {
                const userRef = db.collection("users").doc(user.uid);
                const userSnap = await userRef.get();

                if (!userSnap.exists) {
                    alert("❌ User not found in Firestore!");
                    return;
                }

                let barrelsRemaining = userSnap.data().barrelsRemaining || 0;
                if (barrelsRemaining <= 0) {
                    alert("❌ No barrels remaining!");
                    return;
                }

                const bookingId = new Date().getTime().toString();
                console.log(`📌 Creating Booking ID: ${bookingId}`);

                await userRef.update({
                    barrelsRemaining: barrelsRemaining - 1,
                    bookingHistory: firebase.firestore.FieldValue.arrayUnion({
                        id: bookingId,
                        date: new Date().toISOString(),
                        status: "Pending"
                    })
                });

                console.log(`✅ Cylinder booked successfully for: ${user.email}`);
                alert("✅ Cylinder booked successfully!");
            } catch (error) {
                console.error(`❌ Booking Error: ${error.message}`);
                alert(`❌ ${error.message}`);
            }
        });

        console.log("✅ Book Cylinder Event Listener Attached.");
    }

    // ✅ Approve/Reject Booking (Admin Only)
    if (approveBookingBtn && rejectBookingBtn) {
        console.log("✅ Approve/Reject Buttons Found!");

        approveBookingBtn.addEventListener("click", async () => {
            if (!isAdminLoggedIn) {
                alert("❌ You must be logged in as an admin to approve bookings!");
                return;
            }

            console.log("📌 Approve Booking Clicked!");
            const userId = document.getElementById("userId").value;
            const bookingId = document.getElementById("bookingId").value;

            if (!userId || !bookingId) {
                alert("❌ Please enter both User ID and Booking ID.");
                return;
            }

            try {
                const userRef = db.collection("users").doc(userId);
                const userSnap = await userRef.get();

                if (!userSnap.exists) {
                    alert("❌ User not found in Firestore!");
                    return;
                }

                let bookingHistory = userSnap.data().bookingHistory.map(booking => 
                    booking.id === bookingId ? { ...booking, status: "Approved" } : booking
                );

                await userRef.update({ bookingHistory });

                console.log(`✅ Booking ${bookingId} Approved!`);
                alert(`✅ Booking ${bookingId} Approved!`);
            } catch (error) {
                console.error(`❌ Booking Approval Error: ${error.message}`);
                alert(`❌ ${error.message}`);
            }
        });

        rejectBookingBtn.addEventListener("click", async () => {
            if (!isAdminLoggedIn) {
                alert("❌ You must be logged in as an admin to reject bookings!");
                return;
            }

            console.log("📌 Reject Booking Clicked!");
            const userId = document.getElementById("userId").value;
            const bookingId = document.getElementById("bookingId").value;

            if (!userId || !bookingId) {
                alert("❌ Please enter both User ID and Booking ID.");
                return;
            }

            try {
                const userRef = db.collection("users").doc(userId);
                const userSnap = await userRef.get();

                let bookingHistory = userSnap.data().bookingHistory.map(booking => 
                    booking.id === bookingId ? { ...booking, status: "Rejected" } : booking
                );

                await userRef.update({ bookingHistory });

                console.log(`❌ Booking ${bookingId} Rejected.`);
                alert(`❌ Booking ${bookingId} Rejected.`);
            } catch (error) {
                console.error(`❌ Booking Rejection Error: ${error.message}`);
                alert(`❌ ${error.message}`);
            }
        });
    }
});
