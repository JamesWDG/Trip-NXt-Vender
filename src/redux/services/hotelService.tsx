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
            getMyHotel: builder.query({
                query: () => ({
                    method: 'GET',
                    url: endpoint.GET_MY_HOTEL,
                }),
                providesTags: ['Hotel'],
            }),
            getHotelById: builder.query({
                query: (id: number) => ({
                    method: 'GET',
                    url: endpoint.GET_HOTEL_BY_ID(id),
                }),
                providesTags: (_result, _error, id) => [{ type: 'Hotel', id }],
            }),
            createHotel: builder.mutation({
                query: (data) => ({
                    method: 'POST',
                    url: endpoint.CREATE_HOTEL,
                    body: data,
                })
            }),
            getBookingLogs: builder.query({
                query: (params?: { status?: string }) => ({
                    method: 'GET',
                    url: endpoint.GET_BOOKING_LOGS,
                    params: params ?? {},
                }),
                providesTags: ['Hotel'],
            }),
            getBookingById: builder.query({
                query: (id: number) => ({
                    method: 'GET',
                    url: endpoint.GET_BOOKING_BY_ID(id),
                }),
                providesTags: (_result, _error, id) => [{ type: 'Hotel', id: `Booking${id}` }],
            }),
            getVendorPendingBookings: builder.query({
                query: () => ({
                    method: 'GET',
                    url: endpoint.GET_BOOKING_LOGS,
                    params: { status: 'pending' },
                }),
                providesTags: ['Hotel'],
            }),
            updateHotelBookingStatus: builder.mutation({
                query: ({ id, status }: { id: number; status: string }) => ({
                    method: 'PATCH',
                    url: endpoint.UPDATE_HOTEL_BOOKING_STATUS(id),
                    body: { status },
                }),
                invalidatesTags: ['Hotel'],
            }),
        }
    }
});

export const {
  useLazyGetFeaturesItemsQuery,
  useCreateHotelMutation,
  useLazyGetMyHotelQuery,
  useGetHotelByIdQuery,
  useLazyGetBookingLogsQuery,
  useGetBookingByIdQuery,
  useLazyGetVendorPendingBookingsQuery,
  useUpdateHotelBookingStatusMutation,
} = hotelApi;