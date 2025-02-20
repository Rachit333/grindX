import { auth, googleProvider, githubProvider } from "./firebase";
import { signInWithPopup, signOut, getRedirectResult, signInWithRedirect } from "firebase/auth";

export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProvider);
};

export const signInWithGitHub = async () => {
  await signInWithRedirect(auth, githubProvider);
};

export const handleRedirectResult = async () => {
  return await getRedirectResult(auth);
};

export const logout = async () => {
  await signOut(auth);
};
