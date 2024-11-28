import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseAuth } from '../firebaseConfig';

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during registration: ", error.message);
    throw error;
  }
};

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        const user = userCredential.user;
        console.log('Logged in user:', user);
        return user;
      } catch (error) {
        console.error('Login failed:', error.message);  
        throw new Error(error.message);
      }
    };

export const logout = async () => {
    try {
        await signOut(FirebaseAuth);  
        console.log('User logged out');
      } catch (error) {
        console.error('Logout failed:', error.message);
        throw new Error(error.message);
      }
    };
