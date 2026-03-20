import { endpoint } from "../../contants/api";
import { baseApi } from "./api";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getHotelReviews: builder.query({
            query: (hotelId: number) => ({
                url: endpoint.GET_HOTEL_REVIEWS(hotelId),
                method: 'GET'
            })
        }),
        getRestaurantReviews: builder.query({
            query: () => ({
              url: endpoint.GET_RESTAURANT_REVIEWS,
              method: 'GET',
            }),
          }),
    })
})

export const { useGetHotelReviewsQuery,useLazyGetRestaurantReviewsQuery } = reviewApi;