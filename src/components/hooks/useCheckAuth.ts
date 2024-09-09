// useCheckAuth.ts
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Use `next/navigation` instead of `next/router`
import { useSession } from 'next-auth/react';
import { useUser } from '@/app/context/UserContext';

export function useCheckAuth(redirectPath: string = '/login') {
  const { setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { status, data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure we're running this effect on the client side
    if (typeof window === 'undefined') {
      return;
    }


    if (status === 'loading') {
      // Wait for session status to load
      return;
    }

    if (status === 'unauthenticated') {
      // Redirect to login if unauthenticated
      router.push(redirectPath);
    } else if (status === 'authenticated') {
      setUser(session?.user);
      setLoading(false);
    }
  }, [status, session, router, redirectPath]);

  useEffect(() => {
    if (session) {
      setUser(session?.user); // Update user state on route change
    }
  }, [pathname, session]);

  return { loading, session };
}
