import { baseApi } from "../baseApi";

export const adminApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
    }),
    
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = adminApis;
