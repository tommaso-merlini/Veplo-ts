// Firebase App (the core Firebase SDK) is always required and must be listed first
// import { initializeApp } from "firebase/app"; // If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// require("firebase/analytics");

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "@firebase/messaging";
import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";
const FieldValue = admin.firestore.FieldValue;

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const dev_firebaseConfig = {
  apiKey: "AIzaSyDs607C9zpuZjhM9H9lA48QRkFX4nZwi9o",
  authDomain: "dintorni-dev.firebaseapp.com",
  projectId: "dintorni-dev",
  storageBucket: "dintorni-dev.appspot.com",
  messagingSenderId: "519973926988",
  appId: "1:519973926988:web:8570da91f33a1b6b2d9ce9",
  measurementId: "G-FJ9863RJ7L",
};
const prod_firebaseconfig = {
  apiKey: "AIzaSyD2Qy57T2kfvcmUXsgId8X2aUPJbnqvq34",
  authDomain: "dintorni-prod.firebaseapp.com",
  projectId: "dintorni-prod",
  storageBucket: "dintorni-prod.appspot.com",
  messagingSenderId: "890670080840",
  appId: "1:890670080840:web:1c04dd1f4e6a29d4c5497d",
  measurementId: "G-EETDDVBRRY",
};

let serviceAccount;

// console.log("===============================");
// console.log(JSON.parse(JSON.stringify(process.env.PROD_FIREBASE_SERVICE_ACCOUNT)));
// console.log("===============================");

if (process.env.NODE_ENV === "production") {
  serviceAccount = {
    type: process.env.PROD_TYPE,
    project_id: process.env.PROD_PROJECT_ID,
    private_key_id: process.env.PROD_PRIVATE_KEY_ID,
    private_key: process.env.PROD_PRIVATE_KEY,
    client_email: process.env.PROD_CLIENT_EMAIL,
    client_id: process.env.PROD_CLIENT_ID,
    auth_uri: process.env.PROD_AUTH_URI,
    token_uri: process.env.PROD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.PROD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.PROD_CLIENT_X509_CERT_URL,
  };
} else {
  serviceAccount = {
    type: process.env.DEV_TYPE,
    project_id: process.env.DEV_PROJECT_ID,
    private_key_id: process.env.DEV_PRIVATE_KEY_ID,
    private_key: process.env.DEV_PRIVATE_KEY,
    client_email: process.env.DEV_CLIENT_EMAIL,
    client_id: process.env.DEV_CLIENT_ID,
    auth_uri: process.env.DEV_AUTH_URI,
    token_uri: process.env.DEV_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.DEV_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.DEV_CLIENT_X509_CERT_URL,
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

const db = admin.firestore();

let firebaseConfig;

if (process.env.NODE_ENV === "production") {
  firebaseConfig = prod_firebaseconfig;
} else {
  firebaseConfig = dev_firebaseConfig;
}

// const app = initializeApp(firebaseConfig);

export { admin, db, FieldValue };
