const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("./firebase-config");
const logger = require("./logger");

async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`✅ User registered: ${email}`);
        logger.info(`User registered: ${email}`);
        return userCredential.user;
    } catch (error) {
        console.error(`❌ Registration failed: ${error.message}`);
        logger.error(`Registration failed: ${error.message}`);
    }
}

async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(`✅ Logged in as: ${email}`);
        logger.info(`User logged in: ${email}`);
        return userCredential.user;
    } catch (error) {
        console.error(`❌ Login failed: ${error.message}`);
        logger.error(`Login failed: ${error.message}`);
    }
}

module.exports = { registerUser, loginUser };
