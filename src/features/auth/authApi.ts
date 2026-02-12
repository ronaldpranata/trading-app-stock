import { baseApi } from '@/store/api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<boolean, string>({
      query: (password) => ({
        url: 'auth/login',
        method: 'POST',
        body: { password },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    checkAuth: builder.query<boolean, void>({
      query: () => 'auth/check',
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation, useCheckAuthQuery } = authApi;
