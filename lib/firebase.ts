import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBGfo5E0C-9UlwTJ00GAXLxTFEWlC9vBrA",
  authDomain: "tam-project-350c0.firebaseapp.com",
  databaseURL: "https://tam-project-350c0-default-rtdb.firebaseio.com",
  projectId: "tam-project-350c0",
  storageBucket: "tam-project-350c0.firebasestorage.app",
  messagingSenderId: "743400893160",
  appId: "1:743400893160:web:793a5bb70fd5471bb2f75d",
  measurementId: "G-3B3GP5WDWF"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
