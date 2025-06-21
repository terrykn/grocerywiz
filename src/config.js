import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: post.env.REACT_APP_FIREBASE_API,
  authDomain: "grocerywiz-f2aeb.firebaseapp.com",
  projectId: "grocerywiz-f2aeb",
  storageBucket: "grocerywiz-f2aeb.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };