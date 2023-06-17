import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice for Loader
 */
export const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    isLoading: false,
  },
  /**
   * Reducers functions to show slice or not
   */
  reducers: {
    showLoader: (state) => {
      state.isLoading = true;
      return state;
    },
    hideLoader: (state) => {
      state.isLoading = false;
      return state;
    },
  },
});
export const { showLoader, hideLoader } = loaderSlice.actions;
export const loader = (state) => state.loader.isLoading;
export default loaderSlice.reducer;
