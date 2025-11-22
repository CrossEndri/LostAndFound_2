// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVFrJMEdA_d3f6AiBAy5H9HKJsz_05h_U",
  authDomain: "lostandfound-c139a.firebaseapp.com",
  projectId: "lostandfound-c139a",
  storageBucket: "lostandfound-c139a.firebasestorage.app",
  messagingSenderId: "672611490980",
  appId: "1:672611490980:web:924a141dd6377397c59a31",
  measurementId: "G-F67JTGT5NL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
