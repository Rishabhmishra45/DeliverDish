// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "deliverdish-food-delivery.firebaseapp.com",
  projectId: "deliverdish-food-delivery",
  storageBucket: "deliverdish-food-delivery.firebasestorage.app",
  messagingSenderId: "337150037330",
  appId: "1:337150037330:web:d89d3b57f72927ea2afe8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app,auth}