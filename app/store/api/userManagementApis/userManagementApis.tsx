import { baseApi } from "../baseApi";

export const userManagementApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: (userId: string) => ({
                url: `/auth/userManagement/profile/${userId}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetUserProfileQuery } = userManagementApis;