const { db } = require("./firebase-config");
const { doc, updateDoc, getDoc } = require("firebase/firestore");
const logger = require("./logger");
const { sendEmail } = require("./emailService");

async function bookCylinder(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error(`❌ User ${userId} not found.`);
            logger.error(`User ${userId} not found.`);
            return;
        }

        const barrelsRemaining = userSnap.data().barrelsRemaining || 0;
        if (barrelsRemaining <= 0) {
            console.error(`❌ No barrels remaining for user ${userId}.`);
            logger.warn(`User ${userId} has no barrels remaining.`);
            return;
        }

        await updateDoc(userRef, {
            barrelsRemaining: barrelsRemaining - 1,
            bookingHistory: [...(userSnap.data().bookingHistory || []), {
                id: Date.now(),
                date: new Date().toISOString(),
                status: "Pending"
            }]
        });

        sendEmail(userSnap.data().email, "Booking Confirmed", "Your cylinder booking is confirmed.");
        console.log(`✅ Cylinder booked successfully for user ${userId}.`);
        logger.info(`User ${userId} booked a cylinder.`);
    } catch (error) {
        console.error(`❌ Booking failed: ${error.message}`);
        logger.error(`Booking failed: ${error.message}`);
    }
}

module.exports = { bookCylinder };
