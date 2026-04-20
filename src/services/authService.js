// src/services/authService.js

import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";


// -------------------- SIGN UP --------------------
export const signup = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    createdAt: serverTimestamp(),
  });

  return user;
};

// -------------------- LOGIN --------------------
export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};