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
}

export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1' //live
// export const BASE_URL: string = 'https://immaterial-overfrequently-audrie.ngrok-free.dev/api/v1/user/' //local 

export const endpoint: endpointTypes = Object.freeze({
    LOGIN: '/user/login',
    SIGNUP: '/user/register',
    LOGOUT: '/user/logout',
    FORGOT_PASSWORD: '/user/forget-password',
    VERIFY_OTP: '/user/verify-otp',
    RESEND_OTP: '/user/resend-otp',
    RESET_PASSWORD: '/user/reset-password',
    GET_USER_PROFILE: '/user/get-auth-user',
    UPDATE_USER_PROFILE: (id) => `/user/update-user/${id}`,
    CREATE_RESTAURANT: '/restaurant/create',

    // UPDATE_USER_PROFILE: (data: any) => `update-user/${data?.id}?profilePicture=${data?.profilePicture}&name=${data?.name}&phoneNumber=${data?.phoneNumber}`,
})