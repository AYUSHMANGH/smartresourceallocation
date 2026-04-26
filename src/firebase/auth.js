import { auth } from './config';
import { getDocument, createDocumentWithId } from './firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'admin@email.com';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDocument('users', user.uid);
    
    if (!userDoc) {
      await createDocumentWithId('users', user.uid, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        role: 'volunteer',
        status: 'approved', // Bypassing onboarding for immediate access
        createdAt: new Date().toISOString(),
        avatar: user.photoURL || '👤'
      });
    }
    
    return { user: result.user, role: 'volunteer' };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInAdmin = async (email, password) => {
  if (email !== ADMIN_EMAIL) {
    throw new Error('Not an admin account.');
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, role: 'admin' };
  } catch (error) {
    // If account doesn't exist yet (for demo), create it
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return { user: result.user, role: 'admin' };
      } catch (createError) {
        if (createError.code === 'auth/email-already-in-use') {
           throw new Error('Invalid admin credentials. Please check your password.');
        }
        throw new Error(createError.message);
      }
    }
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserRole = (user) => {
  if (!user) return null;
  return user.email === ADMIN_EMAIL ? 'admin' : 'volunteer';
};
