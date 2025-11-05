'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoggedInUser } from '@/app/store/api/authApis/authApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ProRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component wrapper to protect PRO-only routes
 * Shows loading state while checking, redirects if not PRO
 */
export default function ProRouteGuard({ children, fallback }: ProRouteGuardProps) {
  const router = useRouter();
  const { data: userData, isLoading, isError } = useLoggedInUser();
  const isPro = userData?.data?.isPro;

  useEffect(() => {
    // Only redirect after data has loaded and user is confirmed not PRO
    if (!isLoading && !isError && userData && isPro === false) {
      router.push('/checkout-membership');
    }
  }, [isLoading, isError, userData, isPro, router]);

  // Show loading state while checking
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-emerald-500 animate-spin">
            <AiOutlineLoading3Quarters size={32} />
          </div>
        </div>
      )
    );
  }

  // Show loading if there's an error (might be auth issue)
  if (isError || !userData) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-emerald-500 animate-spin">
            <AiOutlineLoading3Quarters size={32} />
          </div>
        </div>
      )
    );
  }

  // Only render children if user is confirmed PRO
  if (isPro === true) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-500 animate-spin">
          <AiOutlineLoading3Quarters size={32} />
        </div>
      </div>
    )
  );
}

