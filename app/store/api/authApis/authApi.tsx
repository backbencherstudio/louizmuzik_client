import { baseApi } from "../baseApi";
import { jwtDecode } from "jwt-decode";

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
    }),

    otp: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/sendOtpForResetPassword",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    loggedInUser: builder.query({
      query: () => {
        if (typeof window === "undefined") {
          throw new Error("Server-side rendering - skip query");
        }
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found in localStorage");
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
      keepUnusedDataFor: 5000,
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useOtpMutation,
  useLoggedInUserQuery,
} = authApi;
