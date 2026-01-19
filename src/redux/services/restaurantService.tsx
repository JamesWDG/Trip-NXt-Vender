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
    addMenuItem: builder.mutation({
      query: (data: any) => ({
        url: endpoint.ADD_MENU_ITEM,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Menu'],
    }),
    getMenuItems: builder.query({
      query: () => ({
        url: endpoint.GET_MENU_ITEMS,
        method: 'GET',
      }),
      providesTags: ['Menu'],
    }),
    updateMenuItem: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoint.UPDATE_MENU_ITEM(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Menu'],
    }),
    deleteMenuItem: builder.mutation({
      query: (id: number) => ({
        url: endpoint.DELETE_MENU_ITEM(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu'],
    }),
  }),
});

export const {
  useLazyGetRestaurantQuery,
  useAddRestaurantMutation,
  useLazyGetAuthUserRestaurantQuery,
  useUpdateRestaurantMutation,
  useAddMenuItemMutation,
  useLazyGetMenuItemsQuery,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation
} = RestaurantApi;
