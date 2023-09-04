import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import { firebaseAuth, firebaseDB } from "../../config/firebase";

const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");

const userNameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");

async function signUpUserWithEmailAndPassword(e) {
  e.preventDefault();

  const signUpEmail = emailInput.value;
  const signUpPassword = passwordInput.value;
  const userName = userNameInput.value;

  try {
    const userCreds = await createUserWithEmailAndPassword(
      firebaseAuth,
      signUpEmail,
      signUpPassword
    );

    const { user } = userCreds;

    createUserDocumentFromAuth(user, userName);
  } catch (err) {
    console.log(err);
  }
}

async function createUserDocumentFromAuth(userAuth, userName) {
  if (!userAuth) return;

  const userDocument = await getUserDocument(userAuth);

  if (!userDocument) {
    const { email, displayName, uid } = userAuth;

    const createAt = new Date();

    const newUser = {
      id: uid,
      createAt,
      email,
      name: userName,
    };

    try {
      const userDocRef = doc(firebaseDB, "users", userAuth.uid);
      await setDoc(userDocRef, newUser);
    } catch (err) {
      console.log(`error creating user`, err.message);
    }
  }
}

async function signInUserWithEmailAndPassword(e) {
  e.preventDefault();

  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  try {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const data = await getUserDocument(user);

    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function getUserDocument(userAuth) {
  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (userSnapShot.exists()) {
    return userSnapShot.data();
  } else return null;
}

signupForm.addEventListener("submit", signUpUserWithEmailAndPassword);
loginForm.addEventListener("submit", signInUserWithEmailAndPassword);
