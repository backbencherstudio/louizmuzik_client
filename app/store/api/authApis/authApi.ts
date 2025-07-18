import { baseApi } from "../baseApi";

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



  }),
});

export const { useSignupMutation, useLoginMutation, useOtpMutation } = authApi;