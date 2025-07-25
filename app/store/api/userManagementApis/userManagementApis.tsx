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
  }),
  overrideExisting: false,
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  userManagementApis;
