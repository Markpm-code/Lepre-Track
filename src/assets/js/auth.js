import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { firebaseAuth, firebaseDB } from "../../config/firebase";

const loginForm = document.getElementById("login-form");
const userNameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

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

  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { email, displayName, uid } = userAuth;

    console.log(userAuth);

    const createAt = new Date();

    const newUser = {
      id: uid,
      createAt,
      email,
      name: userName,
    };

    console.log(newUser);

    try {
      await setDoc(userDocRef, newUser);
    } catch (err) {
      console.log(`error creating user`, err.message);
    }
  }

  return userSnapShot;
}

loginForm.addEventListener("submit", signUpUserWithEmailAndPassword);
