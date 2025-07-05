import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // import your auth instance

export const loginRequest = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
