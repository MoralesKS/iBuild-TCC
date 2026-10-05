import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const auth = initializeAuth(firebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});