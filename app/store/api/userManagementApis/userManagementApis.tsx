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
      query: ({ id, data }: { id: string; data: { old_password: string; new_password: string } }) => {
        return {
          url: `/auth/userManagement/changePassword/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-Type": "application/json"
          }
        }
      },
    }),

    allProducersDataWithTopProducersData: builder.query({
      query: () => ({
        url: `/auth/userManagement/allProducersDataWithTopProducersData`,
        method: "GET",
      }),
    }),

    followUnFollowProducer: builder.mutation({
      query: ({ userId,producerId }: { userId: string; producerId: string }) => ({
        url: `/auth/userManagement/followingProducersCalculation/${userId}?producerUserId=${producerId}`,
        method: "PATCH",
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
  useFollowUnFollowProducerMutation,
  } = userManagementApis;
