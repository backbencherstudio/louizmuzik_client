import { baseApi } from "../baseApi";

export const adminApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => ({
        url: "/admin/adminOverview",
        method: "GET",
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/${userId}`,
        method: "DELETE",
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

export const {
  useGetAdminOverviewQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useFreeSubscriptionMutation,
} = adminApis;
