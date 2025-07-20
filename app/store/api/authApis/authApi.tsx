import { baseApi } from "../baseApi";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

// Extend JwtPayload to include custom properties
interface CustomJwtPayload {
  userId: string;
  [key: string]: any;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/create-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    otp: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resetPassword: builder.mutation({
      query: (formData: FormData) => ({
        url: "/auth/resetPassword",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    OtpForResetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/sendOtpForResetPassword",
        method: "PATCH",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    loggedInUser: builder.query({
      query: () => {
        if (typeof window === "undefined") {
          throw new Error("Server-side rendering - skip query");
        }
        const token = localStorage.getItem("token");

        if (!token) {
          // Return a special response instead of throwing an error
          return {
            url: "/auth/no-token", // This endpoint should return a 401 or handle no token case
            method: "GET",
          };
        }

        try {
          const decodedToken = jwtDecode<CustomJwtPayload>(token);

          const userId = decodedToken?.userId;

          if (!userId) {
            throw new Error("User ID not found in the token");
          }

          return {
            url: `/auth/userManagement/getSingleUserData/${userId}`,
            method: "GET",
          };
        } catch (error) {
          throw new Error("Invalid or expired token");
        }
      },
      providesTags: ["User"],
      extraOptions: {
        skipToken: true,
      },
      keepUnusedDataFor: 3600,
    }),

    favoritePack: builder.query({
      query: ({id}: { id: string}) => ({
        url: `/auth/userManagement/favorites/${id}`,
        method: "GET",
      }),
    }),



  }),
  overrideExisting: true, // This ensures that the query is not overridden by a new one
});

export const {
  useSignupMutation,
  useLoginMutation,
  useOtpMutation,
  useResetPasswordMutation,
  useLoggedInUserQuery,
  useOtpForResetPasswordMutation,
  useFavoritePackQuery,
} = authApi;

// Custom hook to safely get logged in user
export const useLoggedInUser = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return useLoggedInUserQuery(undefined, {
    skip: !token
  });
};
