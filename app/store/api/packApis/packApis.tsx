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


        getPackProducer: builder.query({
            query: (id: string) => ({
                url: `/pack/${id}`,
                method: 'GET',
            }),
        }),


        getPackDetails: builder.query({
            query: (id: string) => ({
                url: `/pack/single-pack/${id}`,
                method: 'GET',
            }),
        }),



    }),
    overrideExisting: true,
});

export const { useCreatePackMutation, useGetPackProducerQuery, useGetPackDetailsQuery } = packApis;