// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app"; // If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
require("firebase/analytics");
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "@firebase/messaging";
import { getAuth, UserRecord } from "firebase-admin/auth";

import admin from "firebase-admin";
const Timestamp = admin.firestore.Timestamp;
const FieldValue = admin.firestore.FieldValue;

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyDs607C9zpuZjhM9H9lA48QRkFX4nZwi9o",
  authDomain: "dintorni-dev.firebaseapp.com",
  projectId: "dintorni-dev",
  storageBucket: "dintorni-dev.appspot.com",
  messagingSenderId: "519973926988",
  appId: "1:519973926988:web:8570da91f33a1b6b2d9ce9",
  measurementId: "G-FJ9863RJ7L",
};

import serviceAccount from "./fbServiceAccountKey";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

const db = admin.firestore();

const app = initializeApp(firebaseConfig);

//TODO funzione da utilizzare quando crei il negozio
// const prova = () => {
//   getAuth()
//     .setCustomUserClaims("PhtskS3aIgWI2mgAULCbOhGhOO03", { isShop: true })
//     .then((c) => {
//       console.log(c);
//     });
// };

//prova();

export { admin, db, FieldValue };
