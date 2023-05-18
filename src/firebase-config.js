import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8JvSPVy4-D-I3AZ2qvJPDH9AGyxnZNZE",
  authDomain: "habital-app.firebaseapp.com",
  projectId: "habital-app",
  storageBucket: "habital-app.appspot.com",
  messagingSenderId: "544276824372",
  appId: "1:544276824372:web:8923c590c7df60c4622561",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
