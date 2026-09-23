import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export async function authenticateAdmin() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (user.email !== ADMIN_EMAIL) {
    await signOut(auth);
    throw new Error("This Google account is not authorized.");
  }

  return user;
}

export async function logoutAdmin() {
  await signOut(auth);
}