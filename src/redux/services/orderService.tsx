import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const authApi = baseApi.injectEndpoints({
 endpoints: builder => ({
  getOrders: builder.query({
    query: (id: string) => ({
      url: endpoint.GET_ORDERS(id),
      method: 'GET',
    }),
  }),
 }),
});

export const {
    useLazyGetOrdersQuery
} = authApi;
