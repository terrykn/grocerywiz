import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCU1GzR73bwoinuOtikWK_s4_cxC9Jg-KU",
  authDomain: "grocerywiz-f2aeb.firebaseapp.com",
  projectId: "grocerywiz-f2aeb",
  storageBucket: "grocerywiz-f2aeb.firebasestorage.app",
  messagingSenderId: "377080370945",
  appId: "1:377080370945:web:6066dcdca08503e8c6ad00",
  measurementId: "G-JHR0N74XDC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };