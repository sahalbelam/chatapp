// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore" 

const firebaseConfig = {
    apiKey: "AIzaSyAwdxoO6ufWbKQVRysn6ln0zLo8nsmCj4s",
  authDomain: "chat-aae83.firebaseapp.com",
  projectId: "chat-aae83",
  storageBucket: "chat-aae83.appspot.com",
  messagingSenderId: "246357079135",
  appId: "1:246357079135:web:03cb46ec5095ca402657ea",
  measurementId: "G-KNN23E9YVM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db  = getFirestore(app)


export { auth,db }
