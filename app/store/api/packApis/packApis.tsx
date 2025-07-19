import { baseApi } from "../baseApi";


export const packApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPack: builder.mutation({
            query: (formData: FormData) => ({
                url: '/pack/create-pack',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Pack'],
        }),


        getPack: builder.query({
            query: () => ({
                url: '/pack',
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useCreatePackMutation, useGetPackQuery } = packApis;