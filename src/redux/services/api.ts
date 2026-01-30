import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setLogout } from "../slices/authSlice";
import { RootState } from "../store";
import { BASE_URL } from "../../contants/api";



const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    console.log('token ===>', token);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});



export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  console.log("args api", args, api, extraOptions)
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    await api.dispatch(setLogout());

  }
  console.log('result ===>', result);
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Menu', 'Hotel'],
});