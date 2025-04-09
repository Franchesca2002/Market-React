import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC08U3wk1qvOtzbVbqAVWDdaH18LJz76DI",
  authDomain: "market-bbf94.firebaseapp.com",
  projectId: "market-bbf94",
  storageBucket: "market-bbf94.firebasestorage.app",
  messagingSenderId: "568857072383",
  appId: "1:568857072383:web:9ea8c1a4ea8ea1d24fb2ca",
  measurementId: "G-2SYY76R9S7"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const analytics = getAnalytics(appFirebase);
const db = getFirestore(appFirebase);

export { appFirebase, auth, analytics, db };
