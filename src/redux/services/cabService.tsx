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
    }),
});

export const {
    useCreateCabVendorMutation,
    useGetCabVendorByUserIdQuery,
    useSetCabVendorStatusMutation,
} = cabService;
