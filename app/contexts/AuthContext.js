'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (!userProfile) return 'U';
    const firstName = userProfile.first_name || '';
    const lastName = userProfile.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getFullName = () => {
    if (!userProfile) return 'User';
    return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
    getInitials,
    getFullName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};