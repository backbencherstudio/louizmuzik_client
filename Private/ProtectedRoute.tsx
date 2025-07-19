'use client'
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData, error, isLoading } = useLoggedInUserQuery(null);

  useEffect(() => {
    if (error) {
      router.push("/login");
      return;
    }

    if (userData) {
      const userRole = userData?.data?.role;
      
      if (userRole !== "admin" && pathname.startsWith("/admin")) {
        router.push("/");
        return;
      }
    }
  }, [userData, error, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!userData) {
    return null;
  }

  const userRole = userData.data?.role;
  
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
