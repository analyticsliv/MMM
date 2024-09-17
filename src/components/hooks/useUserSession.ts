import { useEffect, useState } from 'react';

const useUserSession = () => {
  const [user, setUser] = useState<Object | null>(null);

  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window !== 'undefined') {
      try {
        const storedUserSession = localStorage.getItem('userSession');
        if (storedUserSession) {
          setUser(JSON.parse(storedUserSession)?.user || null);
        }
      } catch (error) {
        console.error('Failed to retrieve user session from localStorage', error);
        setUser(null);
      }
    }
  }, []);

  return {user, setUser};
};

export default useUserSession;
