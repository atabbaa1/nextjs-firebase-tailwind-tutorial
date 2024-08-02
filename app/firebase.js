// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoHkTv2uvovDH3JhbpqutWo3tgY0KvPas",
  authDomain: "pantry-tracker-44830.firebaseapp.com",
  projectId: "pantry-tracker-44830",
  storageBucket: "pantry-tracker-44830.appspot.com",
  messagingSenderId: "855439003864",
  appId: "1:855439003864:web:ae3ac5eb981a819eb9c7ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app)
// export {app, firestore}
export const database = getFirestore(app);