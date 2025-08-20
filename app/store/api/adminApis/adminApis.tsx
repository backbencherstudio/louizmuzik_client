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

    freeSubscription: builder.mutation({
      query: (userId) => ({
        url: `/auth/userManagement/directSubscription/${userId}`,
        method: "PATCH",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useGetAdminOverviewQuery, useFreeSubscriptionMutation } = adminApis;
