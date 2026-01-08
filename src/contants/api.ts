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
    GET_RESTAURANT: (id:string) => string;
    GET_AUTH_USER_RESTAURANT: string;
}

export const GOOGLE_API_KEY: string = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1' //live
// export const BASE_URL: string = 'http://192.168.0.108:5003/api/v1' //live
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
    UPDATE_USER_PROFILE: (id:number) => `/user/update-user/${id}`,
    CREATE_RESTAURANT: '/restaurant/create',
    GET_AUTH_USER_RESTAURANT: '/restaurant/get',
    GET_RESTAURANT: (id:string) => `/restaurant/get/${id}`,

    // UPDATE_USER_PROFILE: (data: any) => `update-user/${data?.id}?profilePicture=${data?.profilePicture}&name=${data?.name}&phoneNumber=${data?.phoneNumber}`,
})