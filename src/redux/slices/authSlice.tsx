import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authService';

interface User {
  id?: string;
  email?: string;
  password?: string;
  role?: string[];
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  rememberMe: boolean;
  needAccommodationVerification: boolean;
  needRestaurantVerification: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  rememberMe: false,
  needAccommodationVerification: false,
  needRestaurantVerification: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: state => {
    //   state.user = null;
    //   state.token = null;
    // },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    saveCredentials: (state, action) => {
      state.user = {
        ...state.user,
        email: action.payload?.email,
        password: action.payload?.password,
      };
    },
    clearCredentials: state => {
      state.user = {
        ...state.user,
        email: undefined,
        password: undefined,
      };
    },
    setLogout: state => {
      state.token = null;
      state.user = null;
    },
    setUserRole: (state, action) => {
      state.user = {
        ...state.user,
        role: action.payload,
      };
    },
    setVerificationStatus: (state, action) => {
      state.needAccommodationVerification = action.payload.needAccommodationVerification;
      state.needRestaurantVerification = action.payload.needRestaurantVerification;
    },
    setRestaurantVerificationStatus: (state, action) => {
      state.needRestaurantVerification = action.payload;
    },
    setAccommodationVerificationStatus: (state, action) => {
      state.needAccommodationVerification = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.otpVerification.matchFulfilled,
      (state, action) => {
        if (action.payload?.data && action.payload?.data?.type !== 'reset') {
          state.token = action.payload.data?.accessToken;
          state.user = action.payload.data?.user;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        if (action.payload?.data) {
          state.token = action.payload.data?.accessToken;
          state.user = action.payload.data?.user;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state, action) => {
        if (action.payload?.data) {
          state.token = null;
        }
      },
    );
  },
});

export const { setRememberMe, saveCredentials, clearCredentials, setLogout, setUserRole, setVerificationStatus, setRestaurantVerificationStatus, setAccommodationVerificationStatus } =
  authSlice.actions;

export default authSlice.reducer;
