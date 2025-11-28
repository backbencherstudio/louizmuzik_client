"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useGoogleLoginMutation } from "@/app/store/api/authApis/authApi";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  loginWithRedirect: () => void;
  logout: () => void;
  auth0User: any;
  isGoogleSigningUp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a GoogleProvider");
  }
  return context;
};

interface GoogleProviderProps {
  children: ReactNode;
}

export const GoogleProvider = ({ children }: GoogleProviderProps) => {
  const router = useRouter();
  const {
    user: auth0User,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const [googleSignup, { isLoading: isGoogleSigningUp }] =
    useGoogleLoginMutation();
  const [isGoogleSignupDone, setIsGoogleSignupDone] = useState(false);

  const handleGoogleSignup = async () => {
    if (auth0User?.email && !isGoogleSignupDone) {
      try {
        const res = await googleSignup({
          email: auth0User?.email,
          producer_name: auth0User?.name,
        }).unwrap();
        if (res?.success) {
          localStorage.setItem("token", res?.data?.accessToken);
          
          // Fetch user data to check isPro status
          try {
            const token = res?.data?.accessToken;
            if (token) {
              const decodedToken = jwtDecode<{ userId: string }>(token);
              const userId = decodedToken?.userId;
              
              if (userId) {
                const userResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/userManagement/getSingleUserData/${userId}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  }
                );
                
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  const isPro = userData?.data?.isPro;
                  
                  setIsGoogleSignupDone(true);
                  
                  if (isPro === true) {
                    router.push("/dashboard");
                  } else {
                    router.push("/browse");
                  }
                } else {
                  setIsGoogleSignupDone(true);
                  router.push("/dashboard");
                }
              } else {
                setIsGoogleSignupDone(true);
                router.push("/dashboard");
              }
            } else {
              setIsGoogleSignupDone(true);
              router.push("/dashboard");
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            setIsGoogleSignupDone(true);
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.log("error", error);
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isGoogleSignupDone) {
      handleGoogleSignup();
    }
  }, [isAuthenticated, auth0User, isGoogleSignupDone]);

  setTimeout(() => {
    if (isAuthenticated && !isGoogleSignupDone) {
      handleGoogleSignup();
    }
  }, 1000);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginWithRedirect, logout, auth0User,isGoogleSigningUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};
