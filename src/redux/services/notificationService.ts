import { baseApi } from './api';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerFcmToken: builder.mutation<{ success?: boolean }, { fcmToken: string }>({
      query: (body) => ({
        url: '/notification/register-token',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterFcmTokenMutation } = notificationApi;
