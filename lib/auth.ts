// import { auth, googleProvider, githubProvider } from "./firebase";
// import { signInWithPopup, signOut, getRedirectResult, signInWithRedirect } from "firebase/auth";

// export const signInWithGoogle = async () => {
//   await signInWithRedirect(auth, googleProvider);
// };

// export const signInWithGitHub = async () => {
//   await signInWithRedirect(auth, githubProvider);
// };

// export const handleRedirectResult = async () => {
//   return await getRedirectResult(auth);
// };

// export const logout = async () => {
//   await signOut(auth);
// };


import { 
  auth, 
  googleProvider, 
  githubProvider 
} from "./firebase";
import { 
  signInWithPopup, 
  signOut, 
  getRedirectResult, 
  signInWithRedirect, 
  UserCredential 
} from "firebase/auth";

/**
 * Sign in with Google. Uses popup for desktop, redirect for mobile.
 */
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      return await signInWithPopup(auth, googleProvider);
    } else {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
  } catch (error: any) {
    console.error("Google Sign-in Error:", error.message);
    return null;
  }
};

/**
 * Sign in with GitHub. Uses popup for desktop, redirect for mobile.
 */
export const signInWithGitHub = async (): Promise<UserCredential | null> => {
  try {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      return await signInWithPopup(auth, githubProvider);
    } else {
      await signInWithRedirect(auth, githubProvider);
      return null;
    }
  } catch (error: any) {
    console.error("GitHub Sign-in Error:", error.message);
    return null;
  }
};

/**
 * Handle redirect result for authentication.
 */
export const handleRedirectResult = async (): Promise<UserCredential | null> => {
  try {
    return await getRedirectResult(auth);
  } catch (error: any) {
    console.error("Redirect Handling Error:", error.message);
    return null;
  }
};

/**
 * Logout function.
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error: any) {
    console.error("Logout Error:", error.message);
  }
};
