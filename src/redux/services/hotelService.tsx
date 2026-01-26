import { endpoint } from "../../contants/api";
import { baseApi } from "./api";

export const hotelApi = baseApi.injectEndpoints({
    endpoints: function (builder) {
        return {
            getFeaturesItems: builder.query({
                query: () => ({
                    method: 'GET',
                    url: endpoint.GET_FEATURES_ITEMS,
                })
            }),
            createHotel: builder.mutation({
                query: (data) => ({
                    method: 'POST',
                    url: endpoint.CREATE_HOTEL,
                    body: data,
                })
            })
        }
    }
});

export const { useLazyGetFeaturesItemsQuery, useCreateHotelMutation } = hotelApi;