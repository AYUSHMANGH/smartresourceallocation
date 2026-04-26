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
        const profile = await getDocument('users', firebaseUser.uid);
        setUser({ 
          ...firebaseUser, 
          status: profile?.status || (firebaseUser.email === 'admin@email.com' ? 'approved' : 'pending'),
          profileName: profile?.name || firebaseUser.displayName
        });
        setRole(getUserRole(firebaseUser));
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
