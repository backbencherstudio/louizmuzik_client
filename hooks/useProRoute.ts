'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoggedInUser } from '@/app/store/api/authApis/authApi';

/**
 * Hook to protect PRO-only routes
 * Returns loading state and user data
 * Automatically redirects to checkout if user is not PRO
 */
export function useProRoute() {
  const router = useRouter();
  const { data: userData, isLoading, isError } = useLoggedInUser();
  const isPro = userData?.data?.isPro;
  const userId = userData?.data?._id;

  useEffect(() => {
    // Only redirect after data has loaded (not loading) and user is confirmed not PRO
    if (!isLoading && !isError && userData && isPro === false) {
      router.push('/checkout-membership');
    }
  }, [isLoading, isError, userData, isPro, router]);

  return {
    isPro: isPro === true, // Explicitly convert to boolean
    isLoading,
    isError,
    userData,
    userId,
    // Only show content if we're sure user is PRO (not undefined, not false)
    isAuthorized: isPro === true && !isLoading && !isError,
  };
}

