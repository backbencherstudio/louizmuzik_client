import { baseApi } from "../baseApi";

export const adminApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
    }),
    getAdminOverview: builder.query({
      query: () => ({
        url: "/admin/adminOverview",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useGetAdminOverviewQuery } = adminApis;
