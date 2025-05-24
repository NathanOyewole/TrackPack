import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSGVopYLEfOfsITReIKu8dgHnTTsTqzQA',
  authDomain: 'landlord-saas.firebaseapp.com',
  projectId: 'landlord-saas',
  storageBucket: 'landlord-saas.firebasestorage.app',
  messagingSenderId: '616243085817',
  appId: '1:616243085817:web:427cf4c111877cb750bd28',
  measurementId: "G-QHBQWMSST1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
