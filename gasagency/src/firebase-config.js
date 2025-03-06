const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyABR4ypqXLaLcE-tpJtTUwvBNaKB7Cc-3c",
    authDomain: "gas-management-system-4870c.firebaseapp.com",
    projectId: "gas-management-system-4870c",
    storageBucket: "gas-management-system-4870c.appspot.com",
    messagingSenderId: "749348180428",
    appId: "1:749348180428:web:1b2f21c7c034e66d608d69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("✅ Firebase initialized successfully.");

module.exports = { auth, db };
