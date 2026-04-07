import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const discountApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFoodPromos: builder.query({
      query: () => ({
        url: endpoint.GET_FOOD_PROMOS,
        method: 'GET',
      }),
    }),
    createFoodPromo: builder.mutation({
      query: (body: {
        name: string;
        code: string;
        discount: number;
        discountType: 'percentage' | 'fixed';
        moduleScope?: 'food' | 'ride' | 'all';
        minOrderAmount?: number | null;
        maxDiscountAmount?: number | null;
        usageLimit?: number | null;
        expiresAt?: string | null;
      }) => ({
        url: endpoint.CREATE_FOOD_PROMO,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetFoodPromosQuery, useCreateFoodPromoMutation } = discountApi;
