import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getUserRole } from '../firebase/auth';
import { getDocument } from '../firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getDocument('users', firebaseUser.uid);
        
        // Create profile if first time login
        if (!profile) {
          const isDefaultAdmin = firebaseUser.email === 'admin@email.com';
          const newProfile = {
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email,
            role: isDefaultAdmin ? 'administrator' : 'field_worker',
            status: isDefaultAdmin ? 'approved' : 'pending',
            avatar: firebaseUser.photoURL || firebaseUser.displayName?.slice(0, 2).toUpperCase() || 'U',
            createdAt: new Date().toISOString()
          };
          const { setDocument } = await import('../firebase/firestore');
          await setDocument('users', firebaseUser.uid, newProfile);
          profile = newProfile;
        }

        setUser({ 
          ...firebaseUser, 
          status: profile.status,
          profileName: profile.name
        });
        setRole(profile.role === 'administrator' ? 'admin' : 'volunteer');
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      loading, 
      isAdmin: role === 'admin', 
      isVolunteer: role === 'volunteer',
      isApproved: user?.status === 'approved' || role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
