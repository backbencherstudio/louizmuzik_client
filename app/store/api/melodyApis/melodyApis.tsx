import { baseApi } from "../baseApi";

export const melodyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMelodies: build.query({
      query: () => ({
        url: "/melody",
      }),
      providesTags: ["Melody"],
    }),

    getMelodyByUserId: build.query({
      query: (id) => ({
        url: `/melody/${id}`,
      }),
      providesTags: ["Melody"],
    }),

    createMelody: build.mutation({
      query: (formData) => ({
        url: "/melody/create-melody",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Melody"],
    }),

    getMelodyById: build.query({
      query: (id) => ({
        url: `/melody/single-melody/${id}`, 
      }),
      providesTags: ["Melody"],
    }),

    updateMelody: build.mutation({
      query: ({id,formData}) => ({
        url: `/melody/update-melody/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Melody"],
    }),

    deleteMelody: build.mutation({
      query: ({ id, userId }) => ({
        url: `/melody/${id}?userId=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Melody"],
    }),

    favoriteMelody: build.mutation({
      query: ({ id, userId }) => ({
        url: `/melody/${id}?userId=${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Melody"],
    }),

    melodyDownload: build.mutation({
      query: (id) => ({
        url: `/melody/eachMelodyDownloadCounter/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Melody"],
    }),

    melodyPlay: build.mutation({
      query: (id) => ({
        url: `/melody/melodyPlay/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Melody"],
    }),

    getFavoriteMelody: build.query({
      query: (id) => ({
        url: `/auth/userManagement/favorites/${id}`,
        method: "GET",
      }),
      providesTags: ["Melody"],
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetMelodiesQuery,
  useGetMelodyByUserIdQuery,
  useGetMelodyByIdQuery,
  useCreateMelodyMutation,
  useUpdateMelodyMutation,
  useDeleteMelodyMutation,
  useFavoriteMelodyMutation,
  useMelodyDownloadMutation,
  useMelodyPlayMutation,
  useGetFavoriteMelodyQuery,
  } = melodyApi;
