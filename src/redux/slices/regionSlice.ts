import { createSlice } from '@reduxjs/toolkit';

export type RegionType = 'USD' | 'NGN';

interface RegionState {
  selectedRegion: RegionType;
}

const initialState: RegionState = {
  selectedRegion: 'NGN',
};

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    setRegion: (state, action: { payload: RegionType }) => {
      state.selectedRegion = action.payload;
    },
  },
});

export const { setRegion } = regionSlice.actions;
export default regionSlice.reducer;
