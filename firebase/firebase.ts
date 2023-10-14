// Firebase App (the core Firebase SDK) is always required and must be listed first
// import { initializeApp } from "firebase/app"; // If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// require("firebase/analytics");

// Add the Firebase products that you want to use
import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const dev_firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket-id>",
  messagingSenderId: "<your-message-sender-id>",
  appId: "<your-app-id>",
  measurementId: "<your-measurement-id>",
};
const prod_firebaseconfig = {
   apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket-id>",
  messagingSenderId: "<your-message-sender-id>",
  appId: "<your-app-id>",
  measurementId: "<your-measurement-id>",
};

let serviceAccount;

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

let firebaseConfig;

if (process.env.NODE_ENV === "production") {
  firebaseConfig = prod_firebaseconfig;
} else {
  firebaseConfig = dev_firebaseConfig;
}

export { admin };
