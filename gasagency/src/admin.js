const { db } = require("./firebase-config");
const { doc, updateDoc, getDoc } = require("firebase/firestore");
const logger = require("./logger");

async function approveBooking(userId, bookingId, status) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error(`❌ User ${userId} not found.`);
            logger.error(`User ${userId} not found.`);
            return;
        }

        let bookings = userSnap.data().bookingHistory || [];
        
        console.log(`🔍 Checking bookings for user ${userId}:`, JSON.stringify(bookings, null, 2));

        let found = false;
        const bookingIdNum = Number(bookingId);  // 🔹 Ensure ID is treated as a number

        bookings = bookings.map(booking => {
            if (booking.id === bookingIdNum) {  // 🔹 Compare as a number
                console.log(`🔹 Found Booking ID: ${bookingIdNum}, updating status to: ${status}`);
                found = true;
                return { ...booking, status: status };
            }
            return booking;
        });

        if (!found) {
            console.error(`❌ Booking ID ${bookingIdNum} not found for user ${userId}.`);
            logger.error(`Booking ID ${bookingIdNum} not found.`);
            return;
        }

        await updateDoc(userRef, { bookingHistory: bookings });
        console.log(`✅ Admin updated booking ${bookingIdNum} to ${status} for user ${userId}`);
        logger.info(`Admin updated booking ${bookingIdNum} to ${status} for user ${userId}`);
    } catch (error) {
        console.error(`❌ Admin booking approval failed: ${error.message}`);
        logger.error(`Admin booking approval failed: ${error.message}`);
    }
}

module.exports = { approveBooking };
