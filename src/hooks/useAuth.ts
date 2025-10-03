"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenFromCookie, isTokenValid, clearAuthCookie } from '@/lib/auth-utils';

export function useAuth(redirectToLogin = true) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = getTokenFromCookie();
      
      if (!token || !isTokenValid(token)) {
        setIsAuthenticated(false);
        clearAuthCookie();
        
        if (redirectToLogin) {
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router, redirectToLogin]);

  return { isAuthenticated, isLoading };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useOptionalAuth() {
  return useAuth(false);
}