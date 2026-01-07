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
}

export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1/user/' //live
// export const BASE_URL: string = 'https://immaterial-overfrequently-audrie.ngrok-free.dev/api/v1/user/' //local 

export const endpoint: endpointTypes = Object.freeze({
    LOGIN: 'login',
    SIGNUP: 'register',
    LOGOUT: 'logout',
    FORGOT_PASSWORD: 'forget-password',
    VERIFY_OTP: 'verify-otp',
    RESEND_OTP: 'resend-otp',
    RESET_PASSWORD: 'reset-password',
    GET_USER_PROFILE: 'get-auth-user',
    UPDATE_USER_PROFILE: (id) => `update-user/${id}`,
    // UPDATE_USER_PROFILE: (data: any) => `update-user/${data?.id}?profilePicture=${data?.profilePicture}&name=${data?.name}&phoneNumber=${data?.phoneNumber}`,
})