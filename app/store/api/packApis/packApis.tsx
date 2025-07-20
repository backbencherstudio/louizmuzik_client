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

        allPacks: builder.query({
            query: () => ({
                url: '/pack',
                method: 'GET',
            }),
        }),


        getProducerPack: builder.query({
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


        deletePack: builder.mutation({
            query: (id: string) => ({
                url: `/pack/${id}`,
                method: 'DELETE',
            }),
        }),



    }),
    overrideExisting: true,
});

export const { useCreatePackMutation, useGetProducerPackQuery, useGetPackDetailsQuery, useDeletePackMutation, useAllPacksQuery } = packApis;