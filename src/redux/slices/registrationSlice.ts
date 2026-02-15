import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegistrationState {
    // Driver Details
    fullName: string;
    dob: string;
    phoneNumber: string;
    email: string;
    address: string;
    passportPhoto: string | null;

    // Driver Documents
    driverLicenseFront: string | null;
    driverLicenseBack: string | null;

    // Vehicle Documents (Insurance and registration)
    vehicleInsuranceFront: string | null;
    vehicleInsuranceBack: string | null; // Placeholder for now if needed, or mapping to available fields

    // Vehicle Registration
    vehicleType: string;
    vehicleModal: string;
    vehicleYear: string;
    vehicleNumber: string;
    vehicleColor: string;
    vehicleImage: string | null;
}

const initialState: RegistrationState = {
    fullName: '',
    dob: '',
    phoneNumber: '',
    email: '',
    address: '',
    passportPhoto: null,
    driverLicenseFront: null,
    driverLicenseBack: null,
    vehicleInsuranceFront: null,
    vehicleInsuranceBack: null,
    vehicleType: '',
    vehicleModal: '',
    vehicleYear: '',
    vehicleNumber: '',
    vehicleColor: '',
    vehicleImage: null,
};

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        updateRegistrationData: (state, action: PayloadAction<Partial<RegistrationState>>) => {
            return { ...state, ...action.payload };
        },
        resetRegistrationData: () => initialState,
    },
});

export const { updateRegistrationData, resetRegistrationData } = registrationSlice.actions;
export default registrationSlice.reducer;
