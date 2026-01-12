import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const RestaurantApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getRestaurant: builder.query({
      query: (id: string) => ({
        url: endpoint.GET_RESTAURANT(id),
        method: 'GET',
      }),
    }),
    addRestaurant: builder.mutation({
      query: (data: any) => {
        console.log('data Create ===>', data);
        return {
          url: endpoint.CREATE_RESTAURANT,
          method: 'POST',
          body: data,
        };
      },
    }),
    updateRestaurant: builder.mutation({
      query: ({ id, data }) => {
        console.log('id ===>', id);
        console.log('data ===>', data);
        return {
          url: endpoint.UPDATE_RESTAURANT(id),
          method: 'PUT',
          body: data,
        };
      },
    }),
    getAuthUserRestaurant: builder.query({
      query: (_: any) => ({
        url: endpoint.GET_AUTH_USER_RESTAURANT,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLazyGetRestaurantQuery,
  useAddRestaurantMutation,
  useLazyGetAuthUserRestaurantQuery,
  useUpdateRestaurantMutation,
} = RestaurantApi;
