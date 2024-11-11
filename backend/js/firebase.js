import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkIJxkGq2fWLNswDbGc3UbQ21eV2V9fIM",
  authDomain: "venture-c06fc.firebaseapp.com",
  projectId: "venture-c06fc",
  storageBucket: "venture-c06fc.firebasestorage.app",
  messagingSenderId: "342502666217",
  appId: "1:342502666217:web:dd4e1552ab28614b9ea578"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };