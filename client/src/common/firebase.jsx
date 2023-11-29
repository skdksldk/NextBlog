/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCNSUv7X5Zh8JYvnS1xb_cUlstl6jZjbY4",
    authDomain: "next-f7741.firebaseapp.com",
    projectId: "next-f7741",
    storageBucket: "next-f7741.appspot.com",
    messagingSenderId: "1026249727734",
    appId: "1:1026249727734:web:f126d1989b37f22b0116d7",
    measurementId: "G-7NKVEY16LY"
};

const app = initializeApp(firebaseConfig);

// Google Auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {        
        user = result.user;
    })
    .catch((error) => {
        console.log(error)
    });

    return user;

}