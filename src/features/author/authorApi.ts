import { baseApi } from "@/store/api/baseApi";
import { AuthorProfile } from "@/types";

export const authorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthor: builder.query<AuthorProfile, void>({
      query: () => "author",
    }),
  }),
  overrideExisting: false,
});

export const { useGetAuthorQuery } = authorApi;
