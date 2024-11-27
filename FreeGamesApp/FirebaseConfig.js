import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Tuodaan Firestore
import { getDatabase } from "firebase/database";

const firebaseConfig = {

    apiKey: "AIzaSyDSbmWlNwC1sq0SkiL_cBV1Y55ALsjzPqE",
  
    authDomain: "fir-auth-f55c0.firebaseapp.com",
  
    databaseURL: "https://fir-auth-f55c0-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "fir-auth-f55c0",
  
    storageBucket: "fir-auth-f55c0.firebasestorage.app",
  
    messagingSenderId: "700002627541",
  
    appId: "1:700002627541:web:aa45afe66ce5078527175c",
  
    measurementId: "G-R2Z7K4G9ZP"
  
  };
  
  

export default firebaseConfig;

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseFirestore = getFirestore(FirebaseApp); // Alustetaan Firestore
export const FirebaseDatabase = getDatabase(FirebaseApp);  // Alustetaan Realtime Database


console.log('Firebase initialized:', FirebaseApp.name);
console.log('Authorized domain configuration appears correct!');
