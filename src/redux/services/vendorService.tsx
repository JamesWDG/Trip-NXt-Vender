import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const VendorApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getVendorEarningsSummary: builder.query<any, void>({
      query: () => ({
        url: endpoint.GET_VENDOR_EARNINGS_SUMMARY,
        method: 'GET',
      }),
    }),
    getVendorWithdrawals: builder.query<any[], void>({
      query: () => ({
        url: endpoint.GET_VENDOR_WITHDRAWALS,
        method: 'GET',
      }),
    }),
    requestVendorWithdrawal: builder.mutation<any, { requestedAmount: number; currency?: string }>({
      query: body => ({
        url: endpoint.REQUEST_VENDOR_WITHDRAWAL,
        method: 'POST',
        body,
      }),
    }),
    getStripeVendorStatus: builder.query<any, void>({
      query: () => ({
        url: endpoint.GET_STRIPE_VENDOR_STATUS,
        method: 'GET',
      }),
    }),
    createStripeVendorAccount: builder.mutation<any, void>({
      query: () => ({
        url: endpoint.STRIPE_CONNECT,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetVendorEarningsSummaryQuery,
  useGetVendorWithdrawalsQuery,
  useRequestVendorWithdrawalMutation,
  useLazyGetStripeVendorStatusQuery,
  useCreateStripeVendorAccountMutation,
} = VendorApi;

