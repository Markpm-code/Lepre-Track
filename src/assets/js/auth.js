import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase";

export const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      console.log(user);
    } else {
      console.log("user is not logged in");
    }
  });
};

checkAuthState();
