import { baseApi } from "../baseApi";

export const userManagementApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (userId: string) => ({
        url: `/auth/userManagement/profile/${userId}`,
        method: "GET",
      }),
    }),

    updateUserProfile: builder.mutation({
      query: ({
        formData,
        id,
      }: {
        formData: FormData;
        id: string;
      }) => ({
        url: `/auth/userManagement/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    updateUserPassword: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/auth/userManagement/changePassword/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    allProducersDataWithTopProducersData: builder.query({
      query: () => ({
        url: `/auth/userManagement/allProducersDataWithTopProducersData`,
        method: "GET",
      }),
    }),


  }),
  overrideExisting: false,
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useAllProducersDataWithTopProducersDataQuery,
} = userManagementApis;
