'use client'
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData, error, isLoading } = useLoggedInUserQuery(null);

  useEffect(() => {
    // If there's an error (user not logged in), redirect immediately
    if (error) {
      router.push("/login");
      return;
    }

    // If we have user data, check role-based access
    if (userData) {
      const userRole = userData?.data?.role;
      
      // Only redirect if user is trying to access admin routes without admin role
      if (userRole !== "admin" && pathname.startsWith("/admin")) {
        router.push("/");
        return;
      }
    }
  }, [userData, error, router, pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-500">Loading...</div>
      </div>
    );
  }

  // Don't render anything if there's an error (user will be redirected)
  if (error) {
    return null;
  }

  // Don't render anything if user is not logged in
  if (!userData) {
    return null;
  }

  // Check if user has the required role for this route
  const userRole = userData.data?.role;
  
  // For admin routes, only allow admin users
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return null;
  }

  // If we reach here, user is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
