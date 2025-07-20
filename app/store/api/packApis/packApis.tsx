import { baseApi } from "../baseApi";

export const packApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPack: builder.mutation({
      query: (formData: FormData) => ({
        url: "/pack/create-pack",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Pack"],
    }),

    allPacks: builder.query({
      query: () => ({
        url: "/pack",
        method: "GET",
      }),
    }),

    getProducerPack: builder.query({
      query: (id: string) => ({
        url: `/pack/${id}`,
        method: "GET",
      }),
    }),

    getPackDetails: builder.query({
      query: (id: string) => ({
        url: `/pack/single-pack/${id}`,
        method: "GET",
      }),
    }),

    updatePack: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/pack/update-pack/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    deletePack: builder.mutation({
      query: (id: string) => ({
        url: `/pack/${id}`,
        method: "DELETE",
      }),
    }),

    favoritePack: builder.mutation({
      query: ({ id, userId }: { id: string; userId: string }) => ({
        url: `/pack/${id}?userId=${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),


    getFavoritePack: builder.query({
        query: ({id}: { id: string}) => ({
          url: `/auth/userManagement/favorites/${id}`,
          method: "GET",
        }),
      }),
  }),
  overrideExisting: true,
});

export const {
  useCreatePackMutation,
  useGetProducerPackQuery,
  useGetPackDetailsQuery,
  useDeletePackMutation,
  useAllPacksQuery,
  useUpdatePackMutation,
  useFavoritePackMutation,
  useGetFavoritePackQuery,
    } = packApis;
