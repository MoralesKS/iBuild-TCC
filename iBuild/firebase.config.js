import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDvAooZZzReX48GktOKaQaDkP-z8uzm4j4",
  authDomain: "ibuild-daf54.firebaseapp.com",
  projectId: "ibuild-daf54",
  storageBucket: "ibuild-daf54.firebasestorage.app",
  messagingSenderId: "1091983583694",
  appId: "1:1091983583694:web:34fab52518387968de239f",
  measurementId: "G-VHGQH8GBX8"
};

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);