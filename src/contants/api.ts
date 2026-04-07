type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
    GET_USER_PROFILE: string;
    USER_SEARCH: string;
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
    GET_SINGLE_ORDER: (id: string | number) => string;
    UPDATE_ORDER_STATUS: (id: string) => string;
    STRIPE_CONNECT: string;
    GET_BOOKING_LOGS: string;
    GET_BOOKING_BY_ID: (id: number) => string;
    UPDATE_HOTEL_BOOKING_STATUS: (id: number) => string;
    GET_HOTEL_REVIEWS: (hotelId: number) => string;
    GET_VENDOR_EARNINGS_SUMMARY: string;
    GET_VENDOR_WITHDRAWALS: string;
    REQUEST_VENDOR_WITHDRAWAL: string;
    GET_STRIPE_VENDOR_STATUS: string;
    GET_RESTAURANT_REVIEWS: string;
    GET_ALL_NOTIFICATIONS: string;
    GET_RESTAURANT_TOTAL_EARNINGS: string;
    GET_HOTEL_TOTAL_EARNINGS: string;
    GET_CAB_TOTAL_EARNINGS: string;
    GET_WALLET: string;
    REQUEST_WALLET_PAYOUT: string;
    CREATE_PAYMENT_INTENT: string;
    CONFIRM_PAYMENT: string;
    GET_FOOD_PROMOS: string;
    CREATE_FOOD_PROMO: string;
}

export const GOOGLE_API_KEY: string = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
// export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1' //live
export const BASE_URL: string = 'https://noreen-unpunishing-fredricka.ngrok-free.dev/api/v1' //live
// export const BASE_URL: string = 'http://192.168.0.108:5003/api/v1' //localdr
// export const BASE_URL: string = 'https://immaterial-overfrequently-audrie.ngrok-free.dev/api/v1' //ngrok 
// export const BASE_URL: string = 'http://192.168.1.171:5003/api/v1' //ngrok 

export const endpoint: endpointTypes = Object.freeze({
    LOGIN: '/user/login',
    SIGNUP: '/user/register',
    LOGOUT: '/user/logout',
    FORGOT_PASSWORD: '/user/forget-password',
    VERIFY_OTP: '/user/verify-otp',
    RESEND_OTP: '/user/resend-otp',
    RESET_PASSWORD: '/user/reset-password',
    GET_USER_PROFILE: '/user/get-auth-user',
    USER_SEARCH: '/user/search',
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
    GET_SINGLE_ORDER: (id: string | number) => `/order/get-single-order/${id}`,
    UPDATE_ORDER_STATUS: (id: string) => '/order/update-order-status/' + id,
    STRIPE_CONNECT: '/subscription/create-stripe-vender-account',
    GET_BOOKING_LOGS: '/booking/get-all-hotel-bookings-for-vendor',
    GET_BOOKING_BY_ID: (id: number) => `/booking/get-single-hotel-booking/${id}`,
    UPDATE_HOTEL_BOOKING_STATUS: (id: number) => `/booking/update-hotel-booking-status/${id}`,
    GET_HOTEL_REVIEWS: (hotelId: number) => `/review/get-reviews-by-hotel-id/${hotelId}`,
    GET_VENDOR_EARNINGS_SUMMARY: '/vendor/earnings/summary',
    GET_VENDOR_WITHDRAWALS: '/vendor/withdrawals',
    REQUEST_VENDOR_WITHDRAWAL: '/vendor/withdrawals/request',
    GET_STRIPE_VENDOR_STATUS: '/subscription/get-stripe-vender-account-status',
    GET_RESTAURANT_REVIEWS: '/review/get-restaurant-reviews',
    GET_ALL_NOTIFICATIONS: '/notification/list',
    GET_RESTAURANT_TOTAL_EARNINGS: '/restaurant/get-total-earnings',
    GET_HOTEL_TOTAL_EARNINGS: '/hotel/get-total-earnings',
    GET_CAB_TOTAL_EARNINGS: '/cab/get-total-earnings',
    GET_WALLET: '/wallet/',
    REQUEST_WALLET_PAYOUT: '/wallet/payout-request',
    CREATE_PAYMENT_INTENT: '/wallet/payment-intent',
    CONFIRM_PAYMENT: '/wallet/confirm-payment',
    GET_FOOD_PROMOS: '/discount/food-promos',
    CREATE_FOOD_PROMO: '/discount/food-promos',
})