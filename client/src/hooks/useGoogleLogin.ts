import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '@/lib/firebase'


export function useGoogleLogin() {
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { login, logout };
}
