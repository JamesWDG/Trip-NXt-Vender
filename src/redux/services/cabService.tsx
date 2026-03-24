import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const cabService = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCabVendor: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/cab/cab-vendor',
        method: 'POST',
        body: formData,
      }),
    }),
    getCabVendorByUserId: builder.query<any, number>({
      query: (userId) => `/cab/cab-vendor/user/${userId}`,
    }),
    setCabVendorStatus: builder.mutation<
      any,
      { cabId: number; status: 'online' | 'offline'; latitude: number; longitude: number }
    >({
      query: (body) => ({
        url: '/cab/cab-vendor-status/set',
        method: 'PUT',
        body,
      }),
    }),
    updateCabVendor: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/cab/cab-vendor/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    getCabTotalEarnings: builder.query({
      query: () => ({
        url: endpoint.GET_CAB_TOTAL_EARNINGS,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateCabVendorMutation,
  useGetCabVendorByUserIdQuery,
  useSetCabVendorStatusMutation,
  useUpdateCabVendorMutation,
  useLazyGetCabTotalEarningsQuery,
} = cabService;
