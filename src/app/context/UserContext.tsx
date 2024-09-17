"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the context type
interface UserContextType {
  user: object | null;
  setUser: (user: object | null) => void;
}

// Create the UserContext with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Export useUserContext for easier access to the context in other components
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// Define props type for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Create the UserProvider component to wrap around your app
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Read from localStorage and update the state
      const storedUser = JSON.parse(localStorage.getItem('userSession') || '{}')?.user;
      setUser(storedUser || null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  
  // Throw error if the context is used outside of the provider
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}
