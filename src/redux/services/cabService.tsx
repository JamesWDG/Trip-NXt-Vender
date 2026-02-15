import { baseApi } from './api';

export const cabService = baseApi.injectEndpoints({
    endpoints: builder => ({
        createCabVendor: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/cab/cab-vendor',
                method: 'POST',
                body: formData,
                // FormData requires specific headers which fetchBaseQuery usually handles 
                // if body is FormData, it automatically sets the Content-Type to multipart/form-data
            }),
        }),
        getCabVendorByUserId: builder.query<any, number>({
            query: (userId) => `/cab/cab-vendor/user/${userId}`,
        }),
    }),
});

export const { useCreateCabVendorMutation, useGetCabVendorByUserIdQuery } = cabService;
