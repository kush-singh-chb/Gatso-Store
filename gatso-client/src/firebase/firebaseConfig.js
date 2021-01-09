import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyDSGslIb5rQpti-pUkSfsIjD3QgVMQgeBE",
    authDomain: "gatso-2020.firebaseapp.com",
    projectId: "gatso-2020",
    storageBucket: "gatso-2020.appspot.com",
    messagingSenderId: "401461731560",
    appId: "1:401461731560:web:5160af09fdd7279dcb695d",
    measurementId: "G-DBCSR4GCPW"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
