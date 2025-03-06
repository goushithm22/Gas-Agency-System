# 🚀 Gas Agency Management System

## 📌 Overview
The **Gas Agency Management System** is a web-based platform that enables users to **register, log in, and book gas cylinders online**. Admins can log in separately to **approve or reject** booking requests.

The project is built using **Firebase Authentication and Firestore** as the backend, ensuring a **secure and efficient** experience for both users and administrators.

---

## 📂 Features
### ✅ **User Panel**
- **Register & Login** (via Firebase Authentication)
- **Book Gas Cylinder** (with tracking in Firestore)
- **View Booking History** (in Firestore)

### ✅ **Admin Panel**
- **Login as Admin** (restricted access)
- **Approve/Reject Bookings** (admin can manage bookings)
- **Track Users & Bookings** (admin can see booking status)

### ✅ **Security & Storage**
- **Firebase Authentication** (for secure user access)
- **Firestore Database** (stores user & booking data)
- **Access Control** (only admin can approve/reject bookings)

---

## 💻 Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase Firestore (NoSQL database)
- **Authentication:** Firebase Auth
- **Hosting:** Firebase Hosting (optional)

---

## 🔥 How to Run the Project?
Follow these steps to **set up and run** the Gas Agency Management System on your local machine.

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/goushithm22/Gas-Agency-System.git
cd Gas-Agency-System


Navigate to the project folder and install the required dependencies:
```sh
npm install
```

3️⃣ Set Up Firebase
Go to Firebase Console.
Create a project & enable Authentication (Email/Password).
Enable Cloud Firestore and create a database.
Get your Firebase Config Details from Project Settings.
Replace the placeholder values in 'firebase-config.js' with your actual Firebase credentials.

4️⃣ Start the Development Server
Run the following command to start a local server:

sh

Edit
npx http-server frontend
Then, open your browser

🔑 Admin Login Details
Email: admin@example.com
Password: Admin@1234
Admins can approve/reject bookings after logging in.

⚠️ Important Notes
Firebase functions are not used in this project to avoid requiring a paid plan.
Ensure that Firestore security rules are configured properly to allow users to read/write their own data.
