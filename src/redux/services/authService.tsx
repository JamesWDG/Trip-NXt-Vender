import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {  endpoint } from '../../contants/api';
import { baseApi } from './api';



export const authApi = baseApi.injectEndpoints({
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
    logout: builder.mutation({
      query: (_) => ({
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
} = authApi;
