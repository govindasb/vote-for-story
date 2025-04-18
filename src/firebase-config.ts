// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9AKhwdj4Er6w668MiRi36TY4XKiPk42w",
  authDomain: "story-vote-app.firebaseapp.com",
  databaseURL: "https://story-vote-app-default-rtdb.firebaseio.com",
  projectId: "story-vote-app",
  storageBucket: "story-vote-app.firebasestorage.app",
  messagingSenderId: "1065668180200",
  appId: "1:1065668180200:web:faa265d372031b8dc3f15d",
  measurementId: "G-GMGR0J4XT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);