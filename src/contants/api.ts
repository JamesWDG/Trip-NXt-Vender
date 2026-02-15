type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
    GET_USER_PROFILE: string;
    UPDATE_USER_PROFILE: (id: number) => string;
    CREATE_RESTAURANT: string;
    GET_RESTAURANT: (id: string) => string;
    UPDATE_RESTAURANT: (id: number) => string;
    GET_AUTH_USER_RESTAURANT: string;
    ADD_MENU_ITEM: string;
    GET_MENU_ITEMS: string;
    UPDATE_MENU_ITEM: (id: number) => string;
    DELETE_MENU_ITEM: (id: number) => string;
    GET_FEATURES_ITEMS: string;
    GET_MY_HOTEL: string;
    GET_HOTEL_BY_ID: (id: number) => string;
    CREATE_HOTEL: string;
    GET_ORDERS: (id: string) => string;
    UPDATE_ORDER_STATUS: (id: string) => string;
    STRIPE_CONNECT: string;
    GET_BOOKING_LOGS: string;
    GET_BOOKING_BY_ID: (id: number) => string;
    UPDATE_HOTEL_BOOKING_STATUS: (id: number) => string;
}

export const GOOGLE_API_KEY: string = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1' //live
// export const BASE_URL: string = 'http://192.168.0.108:5003/api/v1' //localdr
// export const BASE_URL: string = 'https://immaterial-overfrequently-audrie.ngrok-free.dev/api/v1' //ngrok 
// export const BASE_URL: string = 'http://192.168.100.227:5003/api/v1' //ngrok 

export const endpoint: endpointTypes = Object.freeze({
    LOGIN: '/user/login',
    SIGNUP: '/user/register',
    LOGOUT: '/user/logout',
    FORGOT_PASSWORD: '/user/forget-password',
    VERIFY_OTP: '/user/verify-otp',
    RESEND_OTP: '/user/resend-otp',
    RESET_PASSWORD: '/user/reset-password',
    GET_USER_PROFILE: '/user/get-auth-user',
    UPDATE_USER_PROFILE: (id: number) => `/user/update-user/${id}`,
    CREATE_RESTAURANT: '/restaurant/create',
    GET_AUTH_USER_RESTAURANT: '/restaurant/get',
    GET_RESTAURANT: (id: string) => `/restaurant/get/${id}`,
    UPDATE_RESTAURANT: (id: number) => `/restaurant/update/${id}`,
    ADD_MENU_ITEM: '/menu',
    GET_MENU_ITEMS: '/menu/restaurant',
    UPDATE_MENU_ITEM: (id: number) => `/menu/${id}`,
    DELETE_MENU_ITEM: (id: number) => `/menu/${id}`,
    GET_FEATURES_ITEMS: '/feature',
    CREATE_HOTEL: '/hotel',
    GET_MY_HOTEL: '/hotel/get-auth-user-hotels',
    GET_HOTEL_BY_ID: (id: number) => `/hotel/get/${id}`,
    GET_ORDERS: (id: string) => '/order/get-orders-by-restaurant-id/' + id,
    UPDATE_ORDER_STATUS: (id: string) => '/order/update-order-status/' + id,
    STRIPE_CONNECT: '/subscription/create-stripe-vender-account',
    GET_BOOKING_LOGS: '/booking/get-all-hotel-bookings-for-vendor',
    GET_BOOKING_BY_ID: (id: number) => `/booking/get-single-hotel-booking/${id}`,
    UPDATE_HOTEL_BOOKING_STATUS: (id: number) => `/booking/update-hotel-booking-status/${id}`,
})