import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


export type StackType = 'RestaurantStack' | 'Accomodation' | 'CabStack' | null;
export type ScreenType = 'FindYourRide' | string | null;

export interface NavigationState {
    activeStack: StackType;
}

export const initialState: NavigationState = {
    activeStack: null,
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setActiveStack: (
            state,
            action: PayloadAction<{
                stack: StackType;
            }>,
        ) => {


            state.activeStack = action.payload.stack;
        },
        clearNavigation: state => {
            state.activeStack = null;
        },
    },
});

export const { setActiveStack, clearNavigation } = navigationSlice.actions;

export const selectActiveStack = (state: RootState) => state.navigation.activeStack;
export default navigationSlice.reducer;

