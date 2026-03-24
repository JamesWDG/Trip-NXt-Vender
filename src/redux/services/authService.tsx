import { endpoint } from '../../contants/api';
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
      query: _ => ({
        url: endpoint.LOGOUT,
        method: 'POST',
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
    stripeConnect: builder.query({
      query: () => ({
        url: endpoint.STRIPE_CONNECT,
        method: 'GET',
      })
    }),
    searchUsers: builder.query<
      Array<{ id: number; name: string; email?: string; profilePicture?: string | null }>,
      { q?: string; limit?: number }
    >({
      query: (params = {}) => {
        const q = params.q ?? '';
        const limit = params.limit ?? 80;
        return {
          url: `${endpoint.USER_SEARCH}?q=${encodeURIComponent(q)}&limit=${limit}`,
          method: 'GET',
        };
      },
      transformResponse: (res: any) => (Array.isArray(res) ? res : res?.data ?? res ?? []),
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
  useUpdateUserMutation,
  useLazyGetUserQuery,
  useLazyStripeConnectQuery,
  useSearchUsersQuery,
} = authApi;
