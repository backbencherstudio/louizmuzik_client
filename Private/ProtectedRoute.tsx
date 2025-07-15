'use client'
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const router = useRouter();
  const { data: userData, error, isLoading } = useLoggedInUserQuery(null);

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  useEffect(() => {
    if (userData) {
      if (userData?.data?.role === "user") {
        router.push("/dashboard");
      } else if (userData?.data?.role === "admin") {
        router.push("/admin");
      }
    }
  }, [userData, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || (userData && (userData.data?.role === "user" || userData.data?.role === "admin"))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
