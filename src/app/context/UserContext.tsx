// src/app/context/UserContext.tsx
"use client"
import { createContext, useState, useContext, ReactNode } from 'react';



// Define the context type
interface UserContextType {
  user: Object | null;
  setUser: (arg:any) => void;
}

// Create the UserContext with default values
const UserContext = createContext({
  email : "data.analytics@analyticsliv.com"
});

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
export const UserProvider = ({ children }:any) => {
  const [user, setUser] = useState<Object | null>({});

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
