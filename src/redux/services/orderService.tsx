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
  updateOrderStatus: builder.mutation({
    query: ({ id, data }: { id: string; data: {status: string, restaurantId: string} })=> {
      
      console.log(data , "DSfbueygerguey")
      return {
        url: endpoint.UPDATE_ORDER_STATUS(id),
        method: 'PUT',
        body: data,
      }
    }
   
  }),
 }),
});

export const {
    useLazyGetOrdersQuery,
    useUpdateOrderStatusMutation
} = authApi;
