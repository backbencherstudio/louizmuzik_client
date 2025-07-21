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

    deleteMelody: build.mutation({
      query: ({ id, userId }) => ({
        url: `/melody/${id}?userId=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Melody"],
    }),

    favoriteMelody: build.mutation({
      query: ({ id, userId }) => ({
        url: `/melody/favorite-melody?id=${id}&userId=${userId}`,
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
        url: `//melody/melodyPlay/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Melody"],
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetMelodiesQuery,
  useGetMelodyByUserIdQuery,
  useCreateMelodyMutation,
  useDeleteMelodyMutation,
  useFavoriteMelodyMutation,
  useMelodyDownloadMutation,
  useMelodyPlayMutation,
} = melodyApi;
