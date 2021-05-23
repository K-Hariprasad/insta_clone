import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyDvfgiTnyYckeN6gscmcRB9J_Dp9ysRm0c",
    authDomain: "ulgram.firebaseapp.com",
    projectId: "ulgram",
    storageBucket: "ulgram.appspot.com",
    messagingSenderId: "550275354776",
    appId: "1:550275354776:web:2279ec6a08fc33d332c0ed"
  };

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}