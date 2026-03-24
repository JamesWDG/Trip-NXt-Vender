import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const authApi = baseApi.injectEndpoints({
 endpoints: builder => ({
  getOrders: builder.query({
    query: ({ restaurantId, status }: { restaurantId: string; status?: 'processing' | 'all' }) => ({
      url: status === 'all' ? `${endpoint.GET_ORDERS(restaurantId)}?status=all` : endpoint.GET_ORDERS(restaurantId),
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
  getSingleOrder: builder.query({
    query: (id: string | number) => ({
      url: endpoint.GET_SINGLE_ORDER(id),
      method: 'GET',
    }),
    transformResponse: (response: any) => response?.data ?? response,
  }),
 }),
});

export const {
    useLazyGetOrdersQuery,
    useUpdateOrderStatusMutation,
    useLazyGetSingleOrderQuery,
} = authApi;
