// firebaseSetup.js

import { initializeApp } from 'firebase/app'; // Firebase v9+ import
import { getAuth } from 'firebase/auth'; // Firebase Authentication v9+ import
import firebaseConfig from './firebaseConfig'; // Import your config

// Firebase initialize
const app = initializeApp(firebaseConfig); // Initializes Firebase app

// Get Auth instance
const auth = getAuth(app); // Use the initialized app instance for auth

export { auth }; // Export auth for use elsewhere
