import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB7zqTKgO5V-YrSjduVl0Jo7cmrc8TsZHE",
    authDomain: "chamada-86699.firebaseapp.com",
    projectId: "chamada-86699",
    storageBucket: "chamada-86699.appspot.com",
    messagingSenderId: "822046672744",
    appId: "1:822046672744:web:59226313425723353138dd",
    measurementId: "G-LCWZ3GM521"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const store = getStorage(firebaseApp);

export { auth, db, store };
