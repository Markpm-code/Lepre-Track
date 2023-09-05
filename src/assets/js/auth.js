import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { doc, getDoc } from "@firebase/firestore";

export const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      console.log(user);
      const userData = await getUserData(user);

      console.log(userData);

      const profileIcon = document.getElementById("profile");
      profileIcon.innerHTML = `<i class="fa-solid fa-user"></i
      > ${userData.name}`;
    } else {
      console.log("user is not logged in");
    }
  });
};

checkAuthState();

async function getUserData(user) {
  try {
    const userRef = doc(firebaseDB, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error retrieving user data:", error);
  }
}
