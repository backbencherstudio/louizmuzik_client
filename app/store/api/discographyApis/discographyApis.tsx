import { baseApi } from "../baseApi";

export const discographyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addDiscography: builder.mutation({
            query: ({ userId, discographyUrl }) => ({
                url: "/auth/createDiscography",
                method: "POST",
                body: { userId, discographyUrl },
            }),
        }),
        getDiscography: builder.query({
            query: (userId) => ({
                url: `/auth/fetchDiscography/${userId}`,
                method: "GET",
            }),
        }),

        deleteDiscography: builder.mutation({
            query: (id) => ({
                url: `/auth/removeDiscography/${id}`,
                method: "DELETE",
            }),
        }),
    }),
    overrideExisting: false,
})

export const { useGetDiscographyQuery, useAddDiscographyMutation, useDeleteDiscographyMutation } = discographyApi;