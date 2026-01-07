import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, endpoint } from '../../contants/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    signup: builder.mutation({
      query: data => ({
        url: endpoint.SIGNUP,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: credentials => ({
        url: endpoint.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    otpVerification: builder.mutation({
      query: data => ({
        url: endpoint.VERIFY_OTP,
        method: 'POST',
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: data => ({
        url: endpoint.FORGOT_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),
    resendOTP: builder.mutation({
      query: data => ({
        url: endpoint.RESEND_OTP,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: data => ({
        url: endpoint.RESET_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: endpoint.GET_USER_PROFILE,
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoint.UPDATE_USER_PROFILE(id),
        method: 'PUT',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: endpoint.LOGOUT,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useOtpVerificationMutation,
  useForgetPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useLazyGetUserQuery,
  useUpdateUserMutation,
} = authApi;
