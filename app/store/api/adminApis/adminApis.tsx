import { baseApi } from "../baseApi";

export const adminApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
    }),
    createAdmin: builder.mutation({
      query: () => ({
        url: "/auth/create-admin",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useCreateAdminMutation } = adminApis;
