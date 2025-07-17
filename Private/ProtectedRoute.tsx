'use client'
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData, error, isLoading } = useLoggedInUserQuery(null);

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  useEffect(() => {
    if (userData) {
      const userRole = userData?.data?.role;
      
      // Only redirect if user is not on the correct route for their role
      if (userRole === "user" && !pathname.startsWith("/dashboard")) {
        router.push("/dashboard");
      } else if (userRole === "admin" && !pathname.startsWith("/admin")) {
        router.push("/admin");
      }
    }
  }, [userData, router, pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Return null if there's an error or if user is not authorized for this route
  if (error) {
    return null;
  }

  // Check if user has the required role for this route
  if (userData) {
    const userRole = userData.data?.role;
    
    // For admin routes, only allow admin users
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return null;
    }
    
    // For dashboard routes, only allow user role
    if (pathname.startsWith("/dashboard") && userRole !== "user") {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
