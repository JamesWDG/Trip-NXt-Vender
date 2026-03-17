import { endpoint } from "../../contants/api";
import { baseApi } from "./api";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getHotelReviews: builder.query({
            query: (hotelId: number) => ({
                url: endpoint.GET_HOTEL_REVIEWS(hotelId),
                method: 'GET'
            })
        })
    })
})

export const { useGetHotelReviewsQuery } = reviewApi;