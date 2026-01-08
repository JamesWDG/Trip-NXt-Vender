import {  endpoint } from '../../contants/api';
import { baseApi } from './api';



export const RestaurantApi = baseApi.injectEndpoints({
  endpoints: builder => ({
      getRestaurant: builder.query({
        query: (id: string) => ({
          url: endpoint.GET_RESTAURANT(id),
          method: 'GET',
        }),
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
    useLazyGetAuthUserRestaurantQuery
} = RestaurantApi;
