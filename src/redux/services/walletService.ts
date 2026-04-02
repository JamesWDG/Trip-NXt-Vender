import { endpoint } from '../../contants/api';
import { baseApi } from './api';

export const WalletApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getWallet: builder.query<any, void>({
      query: () => ({
        url: endpoint.GET_WALLET,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),
    requestWalletPayout: builder.mutation<
      any,
      { requestedAmount: number; currency?: string }
    >({
      query: body => ({
        url: endpoint.REQUEST_WALLET_PAYOUT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
    createPaymentIntent: builder.mutation<any, {amount: number}>({
      query: body => ({
        url: endpoint.CREATE_PAYMENT_INTENT,
        method: 'POST',
        body,
      })
    }),
    confirmWalletPayment: builder.mutation<any, {paymentIntentId: string,}>({
      query: body => ({
        url: endpoint.CONFIRM_PAYMENT,
        method: 'POST',
        body,
      })
    })
  }),
});

export const { useLazyGetWalletQuery, useRequestWalletPayoutMutation, useCreatePaymentIntentMutation, useConfirmWalletPaymentMutation } =
  WalletApi;
