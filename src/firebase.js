import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


  const firebaseConfig = {
  apiKey: "AIzaSyAvdQfbb9DTIosGFrYUZln24JGNNwMafro",
  authDomain: "laptopkart-13fce.firebaseapp.com",
  projectId: "laptopkart-13fce",
  storageBucket: "laptopkart-13fce.firebasestorage.app",
  messagingSenderId: "172561609808",
  appId: "1:172561609808:web:5ae429c1a0dd35b94c0d55",
  measurementId: "G-873Q8Y24YB"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };