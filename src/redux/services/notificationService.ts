import { endpoint } from '../../contants/api';
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
    getAllNotifications: builder.query({
      query: () => ({
        url: endpoint.GET_ALL_NOTIFICATIONS,
        method: 'GET',
      }),
    }),
  }),
});

export const { useRegisterFcmTokenMutation,useLazyGetAllNotificationsQuery } = notificationApi;
